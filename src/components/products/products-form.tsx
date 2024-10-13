"use client";
import React, { useMemo, useState } from "react";
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

  function handleOpen(filter: string) {
    if (useParams) {
      const params = new URLSearchParams(searchParam);

      params.set("edit", filter);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      setIsOpen(true);
    }
  }

  function handleClose() {
    if (useParams) {
      const params = new URLSearchParams(searchParam);
      params.delete("edit");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else {
      setIsOpen(false);
    }
    form.reset();
    setDeletedMedia([]);
  }

  const [deletedMedia, setDeletedMedia] = useState<ProductImage[]>([]);
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
    carinfoId: 1,
    salePrice: productToEdit?.salePrice,
    stock: productToEdit?.stock,
    isAvailable: productToEdit?.isAvailable,
    images: [],
    isMain: false,
  };
  console.log(productToEdit, "PRODDD");

  const defaultValues = {
    name: pro.name || "NAMEEEEEE",
    categoryId: pro.carinfoId || 1,
    productTypeId: pro.productTypeId || 1,
    productBrandId: productToEdit?.productBrand.id || 1,
    description: pro.description || "DESCRIPTION",
    listPrice: pro.listPrice || 1,
    carinfoId: 1,
    salePrice: pro.salePrice || 1,
    stock: pro.stock || 1,
    isAvailable: pro.isAvailable !== undefined ? pro.isAvailable : true,
    images: [],
    isMain: false,
  };
  const form = useForm<z.infer<typeof ProductsSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProductsSchema),
    defaultValues: defaultValues,
  });

  // checking if the user changet the forms data in order to enable the user to change it. if not we check if they deleted any images as shown below in the (disabled variable).
  const isEqual = useObjectCompare(defaultValues, form.getValues());
  // if the user didn't change the form's data nor did he delete any already uploaded images we want the submit button to be disabled to prevent any unnecessary api calls.
  const disabled = isEqual && !deletedMedia.length;

  const isLoading = form.formState.isSubmitting;

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
      if (productToEdit) {
        const imagesToUpload = images.map((image) => {
          const formData = new FormData();
          formData.append("image", image);
          formData.append("productId", String(productToEdit.id));
          formData.append("isMain", "false");
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
        await editProductAction({
          productToEdit: productToEditData,
          imagesToUpload,
          imagesToDelete: deletedMedia,
          isEqual,
        });

        handleClose();
      } else {
        await createProductAction({
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
        });
      }

      toast({
        title: `${
          productToEdit
            ? "Product has been updated"
            : "Product has been created."
        }`,
        description: (
          <SuccessToastDescription message="Product as been created." />
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

      <DialogComponent.Content className="  max-h-[65vh]  sm:max-h-[76vh] overflow-y-auto max-w-[1000px] sm:p-14">
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
                        disabled={isLoading}
                        type="number"
                        min={0}
                        placeholder="Listing price"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                        type="number"
                        min={0}
                        disabled={isLoading}
                        placeholder="Sale price."
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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

            <div className=" flex  flex-col gap-2 sm:flex-row items-center">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>Stock available</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        disabled={isLoading}
                        placeholder="Stock available"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
            </div>

            <div className=" flex  flex-col gap-2 sm:flex-row">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="carinfoId"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>Car info</FormLabel>
                    <FormControl>
                      {/* <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="name"
                      /> */}
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
              />

              <FormField
                disabled={isLoading}
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className=" w-full ">
                    <FormLabel>category</FormLabel>
                    <FormControl className=" ">
                      <ComboBox
                        disabled={isLoading}
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
                disabled={isLoading}
                control={form.control}
                name="productBrandId"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>Product brand</FormLabel>
                    <FormControl>
                      <ComboBox
                        disabled={isLoading}
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
                disabled={isLoading}
                control={form.control}
                name="productTypeId"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>Product type</FormLabel>
                    <FormControl>
                      <ComboBox
                        disabled={isLoading}
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
            {productToEdit ? (
              <>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className=" w-full">
                      <FormLabel>Product images</FormLabel>
                      <FormControl>
                        <MultiFileUploader
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
                  name="isMain"
                  render={({ field }) => (
                    <FormItem className="flex flex-row h-fit  items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                      <div className="space-y-0.5 ">
                        <FormLabel>Main image?</FormLabel>
                        <FormDescription>
                          Set the image as the main image.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          aria-readonly
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            ) : null}

            <DialogComponent.Footer>
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
