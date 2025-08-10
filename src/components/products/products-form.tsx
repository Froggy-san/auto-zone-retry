"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
  Category,
  ProductBrand,
  ProductById,
  ProductImage,
  ProductsSchema,
  ProductType,
} from "@lib/types";

import Spinner from "@components/Spinner";
import {
  revalidateProductById,
  revalidateProducts,
} from "@lib/actions/productsActions";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";

import useObjectCompare from "@hooks/use-compare-objs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DialogComponent from "@components/dialog-component";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

import { SUPABASE_URL } from "@lib/constants";
import { createProduct, editProdcut } from "@lib/services/products-services";

import {
  Progress,
  ProgressBarContainer,
  ProgressMeter,
} from "@components/progress";
import { Cross2Icon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import StepTwo from "./form-step-two";

import _ from "lodash";
import { cn } from "@lib/utils";
import StepOne from "./form-step-one";
import StepThree from "./form-step-three";
import { CurrencyInputOnChangeValues } from "react-currency-input-field";

interface ProductFormProps {
  categories: Category[];
  productTypes: ProductType[];
  productBrand: ProductBrand[];
  productToEdit?: ProductById;
  useParams?: boolean;
}

type FirstStepFiedls =
  | "categoryId"
  | "productTypeId"
  | "productBrandId"
  | "listPrice";

const firstStepFields: FirstStepFiedls[] = [
  "categoryId",
  "productTypeId",
  "productBrandId",
  "listPrice",
];

const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  productTypes,
  productBrand,
  productToEdit,
  useParams = false,
}) => {
  const searchParam = useSearchParams();
  const edit = searchParam.get("edit") ?? "";
  const [isOpen, setIsOpen] = useState(edit ? true : false);
  const [isMainImage, setIsMainImage] = useState<ProductImage | null | number>(
    null
  );
  const [deletedDetails, setDeletedDetails] = useState<number[]>([]);
  const [deletedMedia, setDeletedMedia] = useState<ProductImage[]>([]);
  const [[step, direction], setStep] = useState([0, 1]);

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const maxNumOfSteps = 2;

  const handleNext = useCallback(
    (newStep: number) => {
      // Prevent overflow or underflow if needed:
      if (newStep < 0 || newStep > maxNumOfSteps) return;

      const newDirection = newStep > step ? 1 : -1;

      setStep([newStep, newDirection]);
    },
    [step, setStep]
  );

  const carMaker = productToEdit?.carMakers;

  const isMainChange =
    productToEdit?.productImages.find((image) => image.isMain === true) || null;

  const mediaUrls = useMemo(() => {
    const deletedIds = deletedMedia.map((del) => del.id);
    const mediaArr = productToEdit
      ? productToEdit.productImages.filter(
          (imageObj) => !deletedIds.includes(imageObj.id)
        )
      : [];
    return mediaArr;
  }, [deletedMedia, productToEdit]);

  // const pro = {
  //   name: productToEdit?.name,
  //   categoryId: productToEdit?.categories.id,
  //   productTypeId: productToEdit?.productTypes.id,
  //   productBrandId: productToEdit?.productBrands.id,
  //   description: productToEdit?.description,
  //   listPrice: productToEdit?.listPrice,
  //   carinfoId: 1, //! Removed from the back end
  //   makerId: productToEdit?.makerId,
  //   modelId: productToEdit?.modelId,
  //   generationsArr: productToEdit?.generationsArr,
  //   salePrice: productToEdit?.salePrice,
  //   stock: productToEdit?.stock,
  //   isAvailable: productToEdit?.isAvailable,
  //   images: [],
  //   moreDetails: productToEdit?.moreDetails,
  //   isMain: false,
  // };

  const defaultValues = {
    name: productToEdit?.name || "",
    categoryId: productToEdit?.categories.id || 0,
    productTypeId: productToEdit?.productTypes.id || 0,
    productBrandId: productToEdit?.productBrands.id || 0,
    description: productToEdit?.description || "",
    listPrice: productToEdit?.listPrice || 0,
    carinfoId: 0, //! Removed from the back end
    makerId: productToEdit?.makerId || null,
    modelId: productToEdit?.modelId || null,
    generationsArr: productToEdit?.generationsArr
      ? productToEdit?.generationsArr.map((gen) => gen.id)
      : [],
    salePrice: productToEdit?.salePrice || 0,
    stock: productToEdit?.stock || 0,
    isAvailable:
      productToEdit?.isAvailable !== undefined
        ? productToEdit.isAvailable
        : true,
    images: [],
    moreDetails: productToEdit?.moreDetails || [],
    isMain: false,
  };
  const form = useForm<z.infer<typeof ProductsSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductsSchema),
    defaultValues,
    // shouldUnregister: true,
  });

  const { images, moreDetails, makerId, modelId } = form.watch();

  const formValues = form.getValues();
  const formErrors = form.formState.errors;

  const [isFirstVaild, isSecondVaild] = useMemo(() => {
    let isFirstStepValid = true;
    let isSecondStepVaild = true;

    if (form.formState.errors.salePrice) isFirstStepValid = false;
    if (formErrors.name || formValues.name === "") isFirstStepValid = false;
    if (formValues.listPrice > formValues.salePrice && formErrors.salePrice)
      form.clearErrors("salePrice");

    for (let i = 0; i < firstStepFields.length; i++) {
      if (
        formErrors[firstStepFields[i]] ||
        formValues[firstStepFields[i]] === 0
      ) {
        isFirstStepValid = false;
        break;
      }
    }

    for (let i = 0; i < moreDetails.length; i++) {
      let itemError = false;
      const item = moreDetails[i];

      item.table.forEach((item) => {
        if (!item.title.length || !item.description.length) itemError = true;
      });

      if (!item.title.length || itemError) {
        isSecondStepVaild = false;
        break;
      }
    }

    if (formErrors.moreDetails) isSecondStepVaild = false;

    return [isFirstStepValid, isSecondStepVaild];
  }, [formValues, form, formErrors]);

  // checking if the user changet the forms data in order to enable the user to change it. if not we check if they deleted any images as shown below in the (disabled variable).
  const isEqual = useObjectCompare(defaultValues, formValues);

  // if the user didn't change the form's data nor did he delete any already uploaded images we want the submit button to be disabled to prevent any unnecessary api calls.
  const disabled =
    (step === 0 && !isFirstVaild) ||
    (step === 1 && !isSecondVaild) ||
    (step === 2 &&
      isMainChange === isMainImage &&
      isEqual &&
      !deletedMedia.length);

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (!productToEdit && images.length) {
      setIsMainImage(0);
    }
  }, [images, productToEdit]);

  useEffect(() => {
    images.forEach((file) => URL.revokeObjectURL(file.preview));
    form.reset(defaultValues);
    setStep([0, 1]);
    setDeletedDetails([]);
    setIsMainImage(
      productToEdit?.productImages.find((image) => image.isMain === true) ||
        null
    );
    if (formRef.current) formRef.current.scrollTo(0, 0);
  }, [isOpen, productToEdit?.productImages]);

  useEffect(() => {
    if (formRef.current) formRef.current.scrollTo(0, 0);
  }, [step]);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleClose() {
    if (isLoading && productToEdit) return;
    if (edit) {
      const params = new URLSearchParams(searchParam);
      params.delete("edit");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    setIsOpen(false);

    if (isLoading) return;

    setIsMainImage(
      productToEdit?.productImages.find((image) => image.isMain === true) ||
        null
    );
    setDeletedMedia([]);
  }

  function handleDeleteMedia(productImage?: ProductImage) {
    if (productImage) setDeletedMedia((arr) => [...arr, productImage]);
  }

  function handleSubmit() {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  }

  async function onSubmit({
    name,
    categoryId,
    productBrandId,
    productTypeId,
    description,
    listPrice,
    carinfoId,
    salePrice,
    stock,
    isAvailable,
    makerId,
    modelId,
    generationsArr,
    // isMain,
    images,
    moreDetails,
  }: z.infer<typeof ProductsSchema>) {
    try {
      const isMainEdited = isMainImage && typeof isMainImage !== "number";
      const imagesToUpload = images.map((img, i) => {
        const name = `${Math.random()}-${img.name}`.replace(/\//g, "");
        const path = `${SUPABASE_URL}/storage/v1/object/public/product/${name}`;

        return {
          name,
          path,
          isMain: typeof isMainImage === "number" && isMainImage === i,
          file: img,
        };
      });
      if (productToEdit) {
        // const imagesToUpload = images.map((image, i) => {
        //   const formData = new FormData();
        //   formData.append("image", image);
        //   formData.append("productId", String(productToEdit.id));
        //   formData.append(
        //     "isMain",
        //     typeof isMainImage === "number" && isMainImage === i
        //       ? "true"
        //       : "false"
        //   );
        //   return formData;
        // });

        const isMoreDetailEqual = _.isEqual(
          productToEdit.moreDetails,
          moreDetails
        );

        const productToEditData = {
          id: productToEdit.id,
          name,
          categoryId,
          productBrandId,
          productTypeId,
          description,
          listPrice,
          salePrice,
          stock,
          isAvailable,
          makerId,
          modelId,
          generationsArr: generationsArr.length
            ? JSON.stringify(generationsArr)
            : null,
        };

        // Edit the product.

        await editProdcut({
          productToEdit: productToEditData,
          imagesToUpload,
          imagesToDelete: deletedMedia,
          isMain: isMainEdited ? isMainImage : null,
          prevIsMian: isMainChange,
          isEqual,
          deletedDetails,
          moreDetails: !isMoreDetailEqual ? moreDetails : [],
        });

        await revalidateProducts();
        await revalidateProductById(productToEdit.id);
        // const { error } = await editProductAction({
        //   productToEdit: productToEditData,
        //   imagesToUpload,
        //   imagesToDelete: deletedMedia,
        //   isMain: isMainEdited ? isMainImage : null,
        //   isEqual,
        // });
        // if (error) throw new Error(error);
        handleClose();
        setDeletedMedia([]);
      } else {
        // const imagesToUpload = images.length
        //   ? images.map((image, i) => {
        //       const formData = new FormData();
        //       formData.append("image", image);
        //       formData.append(
        //         "isMain",
        //         typeof isMainImage === "number" && isMainImage === i
        //           ? "true"
        //           : "false"
        //       );
        //       return formData;
        //     })
        //   : [];

        const product = await createProduct({
          name,
          categoryId,
          productTypeId,
          productBrandId,
          description,
          listPrice,
          salePrice,
          stock,
          isAvailable,
          images: imagesToUpload,
          moreDetails,
          makerId,
          modelId,
          generationsArr,
        });

        await revalidateProducts();

        // const { error } = await createProductAction({
        //   name,
        //   categoryId,
        //   productTypeId,
        //   productBrandId,
        //   description,
        //   listPrice,
        //   carinfoId,
        //   salePrice,
        //   stock,
        //   isAvailable,
        //   images: imagesToUpload,
        // });
        // const { data, error } = await supabase.from("product").insert([
        //   {
        //     name,
        //     categoryId,
        //     productTypeId,
        //     productBrandId,
        //     description,
        //     listPrice,
        //     salePrice,
        //     stock,
        //     isAvailable,
        //   },
        // ]);
        // if (error) throw new Error(error.message);
        // console.log(data);
        // console.log(images);
        // // if (!data) return;

        // // if (!images.length) return { data, error: "" };
        // const uploadPromises = images.map(async (img) => {
        //   try {
        //     const { data, error } = await supabase.storage
        //       .from("product")
        //       .upload(img.name, img);

        //     if (error) {
        //       console.log("ERROR:", error.message);
        //       throw new Error(error.message);
        //     }

        //     console.log("UPLOAD SUCCESS:", data);
        //     return data;
        //   } catch (err: any) {
        //     console.log("UPLOAD ERROR:", err);
        //   }
        // });

        // await Promise.all(uploadPromises);

        handleClose();
      }

      toast({
        className: "bg-primary  text-primary-foreground",
        title: `Done.`,
        description: (
          <SuccessToastDescription
            message={`${
              productToEdit
                ? "Product has been updated"
                : "Product has been created."
            }`}
          />
        ),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }
  return (
    <DialogComponent open={isOpen} onOpenChange={handleClose}>
      <Button onClick={handleOpen} size="sm" className=" w-full">
        {productToEdit ? "Edit" : "Create"} a porduct
      </Button>
      {/* sm:p-14 pb-0 sm:pb-0 */}
      <DialogComponent.Content className="  max-h-[85vh] overflow-hidden max-w-[1050px] border border-transparent  sm:rounded-none lg:rounded-lg flex flex-col gap-1   p-0">
        <DialogComponent.Header className="     border-b pb-2  px-6 pt-6 sm:px-14 sm:pt-8 sm:pb-4  bg-background ">
          <DialogComponent.Title>
            {" "}
            {productToEdit ? "Update" : "Add"} Product
          </DialogComponent.Title>
          <DialogComponent.Description>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{
                  y: -15,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: 15,
                  opacity: 0,
                }}
                // initial={{
                //   scale: 0.9,
                // }}
                // animate={{
                //   scale: [0.9, 1.1, 0.9, 1],
                //   transition: { stiffness: 2, duration: 0.6 },
                // }}
                // exit={{
                //   y: 15,
                //   opacity: 0,
                //   transition: { duration: 0.2 },
                // }}
                transition={{
                  ease: "backInOut",
                }}
                className="  text-center  sm:text-left"
              >
                {step === 0 &&
                  (productToEdit
                    ? `1. Edit product '${productToEdit.name}'s essential data.`
                    : "1. Add new product's essential data.")}
                {step === 1 &&
                  (productToEdit
                    ? `2. Edit product '${productToEdit.name}'s additional description section.`
                    : "2. Add additional description to the product, **Optional**.")}
                {step === 2 &&
                  "3. Preview of what the product's page will look like."}
              </motion.div>
            </AnimatePresence>
          </DialogComponent.Description>
        </DialogComponent.Header>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              "space-y-8  px-6 sm:px-6 md:px-14  relative  py-4 overflow-y-auto overscroll-contain overflow-x-hidden",
              {
                " px-2 sm:px-6  ": step === maxNumOfSteps,
              }
            )}
          >
            <AnimatePresence mode="wait">
              {step === 0 && (
                <StepOne
                  control={form.control}
                  isLoading={isLoading}
                  currStep={[step, direction]}
                  categories={categories}
                  productTypes={productTypes}
                  productBrand={productBrand}
                  isMainImage={isMainImage}
                  setIsMainImage={setIsMainImage}
                  handleDeleteMedia={handleDeleteMedia}
                  mediaUrls={mediaUrls}
                  productToEdit={productToEdit}
                  setDeletedMedia={setDeletedMedia}
                  makerId={makerId}
                  modelId={modelId}
                  carMaker={carMaker}
                />
              )}

              {step === 1 && (
                <StepTwo
                  control={form.control}
                  moreDetails={moreDetails}
                  currStep={[step, direction]}
                  setDeletedDetails={setDeletedDetails}
                />
              )}

              {step === 2 && (
                <StepThree
                  currStep={[step, direction]}
                  isLoading={isLoading}
                  formValues={formValues}
                  mediaUrls={mediaUrls}
                  categoriesArr={categories}
                  productTypesArr={productTypes}
                  productBrandsArr={productBrand}
                />
              )}
            </AnimatePresence>
          </form>
        </Form>

        <DialogComponent.Footer className="  px-6 pt-2 pb-6 sm:px-14 sm:pb-8 sm:pt-4 border-t     bg-background bottom-0 z-50">
          {/* bg-muted-foreground/20 dark:bg-accent */}
          <div className="flex justify-between gap-4 items-center w-full">
            <div className="bg-muted-foreground/10  dark:bg-accent/20      rounded-md p-3 flex-1 ">
              <Progress value={step} maxValue={maxNumOfSteps}>
                <ProgressBarContainer className=" flex-1 border border-secondary-foreground/20 dark:border-border ">
                  <ProgressMeter />
                </ProgressBarContainer>
              </Progress>
            </div>
            <div className=" flex items-center gap-2 w-fit">
              {/* sm:w-[unset] */}
              <Button
                onClick={() => handleNext(step - 1)}
                type="reset"
                variant="secondary"
                size="sm"
                disabled={isLoading || step === 0}
                className=" w-full "
              >
                Back
              </Button>
              <Button
                size="sm"
                disabled={isLoading || disabled}
                className=" w-full "
                onClick={() => {
                  if (step < maxNumOfSteps) {
                    handleNext(step + 1);
                  } else {
                    handleSubmit();
                  }
                }}
              >
                {isLoading ? (
                  <Spinner className=" h-full" />
                ) : step < maxNumOfSteps ? (
                  "Next"
                ) : productToEdit ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </div>
        </DialogComponent.Footer>
      </DialogComponent.Content>
    </DialogComponent>
  );
};

interface ProgressBarProps {
  currStep: number;
  setcurrStep: React.Dispatch<React.SetStateAction<number>>;
}

function ProgressBar({ currStep, setcurrStep }: ProgressBarProps) {
  const maxNumOfSteps = 3;
  const handleNext = useCallback(() => {
    if (currStep < maxNumOfSteps) {
      setcurrStep((curStep) => curStep + 1);
    }
  }, [currStep, setcurrStep]);

  const handlePrev = useCallback(() => {
    if (currStep > 0) {
      setcurrStep((curStep) => curStep - 1);
    }
  }, [currStep, setcurrStep]);

  return (
    <div className=" flex items-center gap-5">
      <Button size="sm" onClick={handlePrev} disabled={currStep === 0}>
        <ArrowBigLeft />
      </Button>

      <Progress value={currStep} maxValue={maxNumOfSteps}>
        <ProgressBarContainer className=" flex-1">
          <ProgressMeter />
        </ProgressBarContainer>
      </Progress>

      <Button
        size="sm"
        onClick={handleNext}
        disabled={currStep === maxNumOfSteps}
      >
        <ArrowBigRight />
      </Button>
    </div>
  );
}

export default ProductForm;
/*
function createCurrencyInputHandler(
    setFormattedValueState: SetFormattedValueState,
    numericPrefix: string
  ) {
    return useCallback(
      (
        formattedValue: string | undefined,
        name?: string,
        values?: CurrencyInputOnChangeValues,
        onChange?: React.Dispatch<React.SetStateAction<number>>
      ) => {
        if (!formattedValue || (values && !values.value)) {
          setFormattedValueState("");
          onChange?.(0);
          return;
        }

        if (values && values.value === "0") {
          // You might also check if the formattedValue is just the prefix + '0' or '0.00'
          const isJustZero =
            formattedValue === `${numericPrefix} 0` ||
            formattedValue === `${numericPrefix} 0.00`; // Adjust based on your actual prefix and decimal settings

          if (isJustZero) {
            setFormattedValueState("");
            onChange?.(0);
            return;
          }
        }

        // Default behavior: update states normally
        setFormattedValueState(formattedValue);
        if (values) {
          onChange?.(Number(values.value)); // Store the clean numeric string
        }
      },
      [setFormattedValueState, numericPrefix]
    );
  }

*/
