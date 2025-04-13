"use client";
import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  CarInfoProps,
  Category,
  ProductBrand,
  ProductById,
  ProductImage,
  ProductsSchema,
  ProductType,
} from "@lib/types";
import { Textarea } from "@components/ui/textarea";
import { Switch } from "@components/ui/switch";
import Spinner from "@components/Spinner";
import {
  createProductAction,
  editProductAction,
  revalidateProductById,
  revalidateProducts,
} from "@lib/actions/productsActions";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";

import { ComboBox } from "@components/combo-box";
import { MultiFileUploader } from "./multi-file-uploader";
import useObjectCompare from "@hooks/use-compare-objs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DialogComponent from "@components/dialog-component";
import { Trash2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@lib/constants";
import { createProduct, editProdcut } from "@lib/services/products-services";

interface ProductFormProps {
  categories: Category[];
  productTypes: ProductType[];
  productBrand: ProductBrand[];
  productToEdit?: ProductById;
  useParams?: boolean;
}

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

  const [deletedMedia, setDeletedMedia] = useState<ProductImage[]>([]);

  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

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

  const pro = {
    name: productToEdit?.name,
    categoryId: productToEdit?.categories.id,
    productTypeId: productToEdit?.productTypes.id,
    productBrandId: productToEdit?.productBrands.id,
    description: productToEdit?.description,
    listPrice: productToEdit?.listPrice,
    carinfoId: 1, //! Removed from the back end
    salePrice: productToEdit?.salePrice,
    stock: productToEdit?.stock,
    isAvailable: productToEdit?.isAvailable,
    images: [],
    isMain: false,
  };

  const defaultValues = {
    name: pro.name || "",
    categoryId: pro.categoryId || 0,
    productTypeId: pro.productTypeId || 0,
    productBrandId: pro.productBrandId || 0,
    description: pro.description || "",
    listPrice: pro.listPrice || 0,
    carinfoId: 0, //! Removed from the back end
    salePrice: pro.salePrice || 0,
    stock: pro.stock || 0,
    isAvailable: pro.isAvailable !== undefined ? pro.isAvailable : true,
    images: [],
    isMain: false,
  };
  const form = useForm<z.infer<typeof ProductsSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductsSchema),
    defaultValues: defaultValues,
  });
  const { images } = form.watch();

  // checking if the user changet the forms data in order to enable the user to change it. if not we check if they deleted any images as shown below in the (disabled variable).
  const isEqual = useObjectCompare(defaultValues, form.getValues());
  // if the user didn't change the form's data nor did he delete any already uploaded images we want the submit button to be disabled to prevent any unnecessary api calls.
  const disabled =
    isMainChange === isMainImage && isEqual && !deletedMedia.length;

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (!productToEdit && images.length) {
      setIsMainImage(0);
    }
  }, [images, productToEdit]);

  useEffect(() => {
    form.reset(defaultValues);
    setIsMainImage(
      productToEdit?.productImages.find((image) => image.isMain === true) ||
        null
    );
  }, [isOpen, productToEdit?.productImages]);

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
  console.log(isMainImage);
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
    // isMain,
    images,
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
        };
        // Edit the product.
        await editProdcut({
          productToEdit: productToEditData,
          imagesToUpload,
          imagesToDelete: deletedMedia,
          isMain: isMainEdited ? isMainImage : null,
          prevIsMian: isMainChange,
          isEqual,
        });
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
          carinfoId,
          salePrice,
          stock,
          isAvailable,
          images: imagesToUpload,
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
        {productToEdit ? " Edit" : "Create"} a porduct
      </Button>

      <DialogComponent.Content className="  max-h-[76vh] overflow-y-auto max-w-[1000px] sm:p-14 pb-0 sm:pb-0">
        <DialogComponent.Header>
          <DialogComponent.Title>
            {" "}
            {productToEdit ? "Update" : "Add"} Product
          </DialogComponent.Title>
          <DialogComponent.Description>
            {productToEdit
              ? `Edit product '${productToEdit.name}' data.`
              : "Add new product to the products page."}
            .
          </DialogComponent.Description>
        </DialogComponent.Header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the name of the product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className=" flex  flex-col gap-2 sm:flex-row">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="listPrice"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>List price</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        value={field.value}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^\d*$/.test(inputValue)) {
                            field.onChange(Number(inputValue));
                          }
                        }}
                        placeholder="List price..."
                        // {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a description for your product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>Sale price</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        value={field.value}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^\d*$/.test(inputValue)) {
                            field.onChange(Number(inputValue));
                          }
                        }}
                        placeholder="Sale price"
                        // {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a description for your product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" flex  flex-col gap-2 sm:flex-row">
              {/* <FormField
                disabled={isLoading}
                control={form.control}
                name="carinfoId"
                render={({ field }) => (
                  <FormItem className=" w-full ">
                    <FormLabel>Car info</FormLabel>
                    <FormControl>
         
                      <CarInfoComboBox
                        disabled={isLoading}
                        options={carinfos}
                        value={field.value}
                        setValue={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a description for your product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                disabled={isLoading}
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>Stock available</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        value={field.value}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^\d*$/.test(inputValue)) {
                            field.onChange(Number(inputValue));
                          }
                        }}
                        placeholder="Stock"
                        // {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a description for your product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading || !categories.length}
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className=" w-full ">
                    <FormLabel>category</FormLabel>
                    <FormControl className=" ">
                      <ComboBox
                        disabled={isLoading || !categories.length}
                        options={categories}
                        value={field.value}
                        setValue={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a description for your product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className=" flex  flex-col gap-2 sm:flex-row">
              <FormField
                disabled={isLoading || !productBrand.length}
                control={form.control}
                name="productBrandId"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>Product brand</FormLabel>
                    <FormControl>
                      <ComboBox
                        disabled={isLoading || !productBrand.length}
                        options={productBrand}
                        value={field.value}
                        setValue={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a description for your product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isLoading || !productTypes.length}
                control={form.control}
                name="productTypeId"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>Product type</FormLabel>
                    <FormControl>
                      <ComboBox
                        disabled={isLoading || !productTypes.length}
                        options={productTypes}
                        value={field.value}
                        setValue={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a description for your product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="Description"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a description for your product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel>Product images</FormLabel>
                  <FormControl>
                    <MultiFileUploader
                      isMainImage={isMainImage}
                      setIsMainImage={setIsMainImage}
                      disabled={isLoading}
                      handleDeleteMedia={handleDeleteMedia}
                      selectedFiles={field.value}
                      fieldChange={field.onChange}
                      mediaUrl={mediaUrls}
                    />
                  </FormControl>
                  <FormDescription className=" flex items-center justify-between">
                    <span> Add images related to the product.</span>{" "}
                    <div className=" flex items-center gap-2">
                      <span className=" text-xs ">
                        Images: {field.value.length + mediaUrls?.length}
                      </span>
                      <Button
                        disabled={
                          (!field.value.length && !mediaUrls.length) ||
                          isLoading
                        }
                        onClick={() => {
                          field.onChange([]);
                          setIsMainImage(null);
                          if (productToEdit)
                            setDeletedMedia(productToEdit.productImages);
                        }}
                        type="button"
                        variant="destructive"
                        className=" p-0 w-6 h-6"
                      >
                        {" "}
                        <Trash2 className=" w-4 h-4 shrink-0" />
                      </Button>
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={isLoading}
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row h-fit  items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                  <div className="space-y-0.5 ">
                    <FormLabel>Availability</FormLabel>
                    <FormDescription>
                      Is the product available?.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isLoading}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogComponent.Footer className="  sm:pb-14 pb-5 pt-4 !mt-4 sticky  bg-background bottom-0 z-50">
              <Button
                onClick={handleClose}
                type="reset"
                variant="secondary"
                size="sm"
                disabled={isLoading}
                className=" w-full sm:w-[unset]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading || disabled}
                className=" w-full sm:w-[unset]"
              >
                {isLoading ? (
                  <Spinner className=" h-full" />
                ) : productToEdit ? (
                  "Edit"
                ) : (
                  "Create"
                )}
              </Button>
            </DialogComponent.Footer>
          </form>
        </Form>
      </DialogComponent.Content>
    </DialogComponent>
  );
};

export default ProductForm;
