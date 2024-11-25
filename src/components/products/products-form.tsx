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
} from "@lib/actions/productsActions";
import { useToast } from "@hooks/use-toast";
import SuccessToastDescription, {
  ErorrToastDescription,
} from "@components/toast-items";

import { ComboBox } from "@components/combo-box";
import { CarInfoComboBox } from "@components/dashboard/car-info-combobox";
import { MultiFileUploader } from "./multi-file-uploader";
import useObjectCompare from "@hooks/use-compare-objs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DialogComponent from "@components/dialog-component";

interface ProductFormProps {
  categories: Category[];
  carinfos: CarInfoProps[];
  productTypes: ProductType[];
  productBrand: ProductBrand[];
  productToEdit?: ProductById;
  useParams?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  carinfos,
  productTypes,
  productBrand,
  productToEdit,
  useParams = false,
}) => {
  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const edit = searchParam.get("edit") ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const isEditing = edit ? true : false || isOpen;

  const [isMainImage, setIsMainImage] = useState<ProductImage | null | number>(
    null
  );
  const [deletedMedia, setDeletedMedia] = useState<ProductImage[]>([]);
  const isMainChange =
    productToEdit?.productImages.find((image) => image.isMain === true) || null;

  const params = new URLSearchParams(searchParam);
  function handleOpen(filter: string) {
    if (useParams) {
      params.set("edit", filter);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      setIsOpen(true);
    }
  }

  function handleClose() {
    if (isLoading && productToEdit) return;
    if (useParams) {
      const params = new URLSearchParams(searchParam);
      params.delete("edit");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      setIsOpen(false);
    }
    if (isLoading) return;
    form.reset(defaultValues);

    setIsMainImage(
      productToEdit?.productImages.find((image) => image.isMain === true) ||
        null
    );
    setDeletedMedia([]);
  }

  function handleDeleteMedia(productImage: ProductImage) {
    setDeletedMedia((arr) => [...arr, productImage]);
  }

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
    categoryId: productToEdit?.category.id,
    productTypeId: productToEdit?.productType.id,
    productBrandId: productToEdit?.productBrand.id,
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
    name: pro.name || "NAMEEEEEE",
    categoryId: pro.categoryId || 0,
    productTypeId: pro.productTypeId || 0,
    productBrandId: productToEdit?.productBrand.id || 0,
    description: pro.description || "DESCRIPTION",
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

  useEffect(() => {
    if (!productToEdit && images.length) {
      setIsMainImage(0);
    }
  }, [images]);

  // checking if the user changet the forms data in order to enable the user to change it. if not we check if they deleted any images as shown below in the (disabled variable).
  const isEqual = useObjectCompare(defaultValues, form.getValues());
  // if the user didn't change the form's data nor did he delete any already uploaded images we want the submit button to be disabled to prevent any unnecessary api calls.
  const disabled =
    isMainChange === isMainImage && isEqual && !deletedMedia.length;

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    setIsMainImage(
      productToEdit?.productImages.find((image) => image.isMain === true) ||
        null
    );
  }, [isEditing]);

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

      if (productToEdit) {
        const imagesToUpload = images.map((image, i) => {
          const formData = new FormData();
          formData.append("image", image);
          formData.append("productId", String(productToEdit.id));
          formData.append(
            "isMain",
            typeof isMainImage === "number" && isMainImage === i
              ? "true"
              : "false"
          );
          return formData;
        });

        const productToEditData = {
          id: productToEdit.id,
          name,
          categoryId,
          description,
          listPrice,
          salePrice,
          stock,
          isAvailable,
        };
        // Edit the product.
        const { error } = await editProductAction({
          productToEdit: productToEditData,
          imagesToUpload,
          imagesToDelete: deletedMedia,
          isMain: isMainEdited ? isMainImage : null,
          isEqual,
        });
        if (error) throw new Error(error);
        handleClose();
        setDeletedMedia([]);
      } else {
        const imagesToUpload = images.length
          ? images.map((image, i) => {
              const formData = new FormData();
              formData.append("image", image);
              // formData.append("productId", String(prodcutId));
              formData.append(
                "isMain",
                typeof isMainImage === "number" && isMainImage === i
                  ? "true"
                  : "false"
              );
              return formData;
            })
          : [];

        const { error } = await createProductAction({
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

        if (error) throw new Error(error);
        handleClose();
      }

      toast({
        title: `Done`,
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
      console.log(error);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: <ErorrToastDescription error={error.message} />,
      });
    }
  }
  return (
    <DialogComponent open={isEditing} onOpenChange={handleClose}>
      <Button onClick={() => handleOpen("open")} size="sm" className=" w-full">
        {productToEdit ? " Edit" : "Create"} a porduct
      </Button>

      <DialogComponent.Content className="  max-h-[76vh] overflow-y-auto max-w-[1000px] sm:p-14 pb-0 sm:pb-0">
        <DialogComponent.Header>
          <DialogComponent.Title>Product form</DialogComponent.Title>
          <DialogComponent.Description>
            Create or edit products.
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
                  <FormDescription className=" flex justify-between">
                    <span> Add images related to the product.</span>{" "}
                    <span className=" text-xs">
                      Images: {field.value.length + mediaUrls?.length}
                    </span>
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
