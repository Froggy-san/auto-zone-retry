import {
  CarGenerationProps,
  CarMakerData,
  CarMakersData,
  CarModelProps,
  Category,
  CategoryProps,
  FilesWithPreview,
  ProductBrand,
  ProductById,
  ProductImage,
  ProductsSchema,
  ProductType,
} from "@lib/types";
import { Control, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { ProFormSlideVariants, ProFormTransition } from "@lib/constants";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { ComboBox } from "@components/combo-box";
import { Textarea } from "@components/ui/textarea";
import { MultiFileUploader } from "./multi-file-uploader";
import { Button } from "@components/ui/button";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { Switch } from "@components/ui/switch";
import CarBrandsCombobox from "@components/car-brands-combobox";
import useCarBrands from "@lib/queries/useCarBrands";
import { useEffect, useMemo, useState } from "react";
import { ModelCombobox } from "@components/model-combobox";
import GenerationsTagInput from "@components/generations-tag-input";
import InputMask from "react-input-mask";
import CurrencyInput, {
  CurrencyInputOnChangeValues,
} from "react-currency-input-field";

type Form = UseFormReturn<
  {
    name: string;
    description: string;
    listPrice: number;
    salePrice: number;
    stock: number;
    makerId: number | null;
    modelId: number | null;
    generationsArr: number[];
    isAvailable: boolean;
    moreDetails: {
      table: {
        title: string;
        description: string;
      }[];
      title: string;
      description: string;
      id?: number | undefined;
      created_at?: string | undefined;
      productId?: number | undefined;
    }[];
    categoryId: number;
    productTypeId: number;
    productBrandId: number;
    carinfoId: number;
    images: FilesWithPreview[];
    isMain: boolean;
  },
  any,
  undefined
>;

type HandleNumber = (
  formattedValue: string | undefined,
  name?: string,
  values?: CurrencyInputOnChangeValues,
  onChange?: React.Dispatch<React.SetStateAction<number>>
) => void;
interface StepOneProps {
  form: Form;
  control: Control<z.infer<typeof ProductsSchema>>;

  isLoading: boolean;
  categories: CategoryProps[];

  productBrand: ProductBrand[];
  isMainImage: number | ProductImage | null;
  mediaUrls: ProductImage[];
  productToEdit?: ProductById;
  currStep: number[];

  carMaker: CarMakerData | undefined;
  handleDeleteMedia(productImage?: ProductImage): void;

  setIsMainImage: React.Dispatch<
    React.SetStateAction<number | ProductImage | null>
  >;
  setDeletedMedia: React.Dispatch<React.SetStateAction<ProductImage[]>>;
  carMakers: CarMakersData[];
}

function StepOne({
  form,
  currStep,
  control,
  isLoading,
  categories,
  productBrand,
  isMainImage,
  setIsMainImage,
  handleDeleteMedia,
  mediaUrls,
  setDeletedMedia,
  productToEdit,
  carMaker,
  carMakers,
}: StepOneProps) {
  const [step, direction] = currStep;
  // const { carBrands, isLoading: searching, error } = useCarBrands(searchTerm);
  const { makerId, modelId, generationsArr } = form.watch();
  const carModels =
    makerId && carMakers?.find((car) => car.id === makerId)?.carModels;
  const carGenerations =
    modelId &&
    carModels &&
    carModels.find((model) => model.id === modelId)?.carGenerations;
  const { categoryId } = form.watch();
  const productTypes = useMemo(() => {
    return categories.find((cat) => cat.id === categoryId)?.productTypes || [];
  }, [categoryId]);
  // useEffect(() => {
  //   if (searching) {
  //     if (makerId) form.setValue("makerId", null);
  //     if (modelId) form.setValue("modelId", null);
  //     if (generationsArr.length) form.setValue("generationsArr", []);
  //   }
  // }, [searching, generationsArr.length, makerId, modelId, form.setValue]);

  return (
    <motion.div
      custom={direction}
      variants={ProFormSlideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={ProFormTransition}
      className="  space-y-7"
    >
      <div className="  flex flex-col sm:flex-row gap-x-2 gap-y-3 ">
        <FormField
          disabled={isLoading}
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="name" {...field} />
              </FormControl>
              <FormDescription>Enter the name of the product.</FormDescription>
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
              <FormLabel>Category</FormLabel>
              <FormControl className=" ">
                <ComboBox
                  placeholder="Select category..."
                  disabled={isLoading || !categories.length}
                  options={categories}
                  value={field.value}
                  setValue={(value) => {
                    field.onChange(value);
                    form.setValue("productTypeId", 0);
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter what category does the product belong to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className=" flex  flex-col gap-2 sm:flex-row">
        <FormField
          disabled={isLoading || !productTypes.length}
          control={form.control}
          name="productTypeId"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>Product type</FormLabel>
              <FormControl>
                <ComboBox
                  placeholder="Select type..."
                  disabled={isLoading || !productTypes.length}
                  options={productTypes}
                  value={field.value}
                  setValue={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Enter what type of product it is.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading || !productBrand.length}
          control={form.control}
          name="productBrandId"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>Product brand</FormLabel>
              <FormControl>
                <ComboBox
                  placeholder="Select Brand..."
                  disabled={isLoading || !productBrand.length}
                  options={productBrand}
                  value={field.value}
                  setValue={field.onChange}
                />
              </FormControl>
              <FormDescription>Enter the brand of the product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className=" flex  gap-x-2 gap-y-3 flex-wrap flex-row">
        <FormField
          disabled={isLoading}
          control={form.control}
          name="listPrice"
          render={({ field }) => (
            <FormItem className=" w-full flex-1">
              <FormLabel htmlFor="listPrice">List price</FormLabel>
              <FormControl>
                {/* <CurrencyField onChange={field.onChange} /> */}

                <CurrencyInput
                  id="listPrice"
                  name="price"
                  placeholder="Original Price"
                  decimalsLimit={2} // Max number of decimal places
                  prefix="EGP " // Currency symbol (e.g., Egyptian Pound)
                  decimalSeparator="." // Use dot for decimal
                  groupSeparator="," // Use comma for thousands
                  value={field.value || ""}
                  onValueChange={(formattedValue, name, value) => {
                    // setFormattedListing(formattedValue || "");

                    field.onChange(Number(value?.value) || 0);
                  }}
                  className="input-field "
                />
              </FormControl>
              <FormDescription>Enter the listing price.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading}
          control={form.control}
          name="salePrice"
          render={({ field }) => (
            <FormItem className=" w-full  flex-1">
              <FormLabel htmlFor="salesInput">Sale price</FormLabel>
              <FormControl>
                <CurrencyInput
                  id="salesInput"
                  name="price"
                  placeholder="Discounted Price"
                  decimalsLimit={2} // Max number of decimal places
                  prefix="EGP " // Currency symbol (e.g., Egyptian Pound)
                  decimalSeparator="." // Use dot for decimal
                  groupSeparator="," // Use comma for thousands
                  value={field.value || ""}
                  onValueChange={(formattedValue, name, value) => {
                    field.onChange(Number(value?.value) || 0);
                  }}
                  className="input-field   "
                />
              </FormControl>
              <FormDescription>Enter the discounted price.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem className=" w-full basis-full sm:flex-1 ">
              <FormLabel htmlFor="stockInput">Stock available </FormLabel>
              <FormControl>
                <CurrencyInput
                  id="stockInput"
                  name="price"
                  placeholder="Available Stock"
                  decimalsLimit={2} // Max number of decimal places
                  prefix="UNITS " // Currency symbol (e.g., Egyptian Pound)
                  decimalSeparator="." // Use dot for decimal
                  groupSeparator="," // Use comma for thousands
                  value={field.value || ""}
                  onValueChange={(formattedValue, name, value) => {
                    field.onChange(Number(value?.value) || 0);
                  }}
                  className="input-field  "
                />
              </FormControl>
              <FormDescription>
                Enter the amount of stock available.
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
          name="makerId"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>
                Car brand{" "}
                <span className=" text-xs text-muted-foreground pl-1">
                  Optional
                </span>
              </FormLabel>
              <FormControl>
                <CarBrandsCombobox
                  options={carMakers}
                  shouldFilter={false}
                  value={field.value}
                  setValue={(value) => {
                    field.onChange(value);
                    form.setValue("modelId", null);
                    form.setValue("generationsArr", []);
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter the amount of stock available.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading}
          control={form.control}
          name="modelId"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>
                Car model{" "}
                <span className=" text-xs text-muted-foreground pl-1">
                  Optional
                </span>
              </FormLabel>
              <FormControl>
                <ModelCombobox
                  disabled={!carModels || !carModels.length}
                  options={carModels || []}
                  value={field.value}
                  setValue={(value) => {
                    form.setValue("generationsArr", []);
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter the amount of stock available.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          disabled={isLoading}
          control={form.control}
          name="generationsArr"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>
                Car Generations{" "}
                <span className=" text-xs text-muted-foreground pl-1">
                  Optional
                </span>
              </FormLabel>
              <FormControl>
                <GenerationsTagInput
                  disabled={!carGenerations || !carGenerations.length}
                  setIds={field.onChange}
                  ids={field.value}
                  generations={carGenerations || []}
                />
              </FormControl>
              <FormDescription>
                Enter the amount of stock available.
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
          name="stock"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>Stock available</FormLabel>
              <FormControl>
                <CurrencyInput
                  id="priceInput"
                  name="price"
                  placeholder="UNITS, 1,234.56"
                  decimalsLimit={2} // Max number of decimal places
                  prefix="UNITS " // Currency symbol (e.g., Egyptian Pound)
                  decimalSeparator="." // Use dot for decimal
                  groupSeparator="," // Use comma for thousands
                  value={formattedStockValue}
                  onValueChange={(formattedValue, name, value) => {
                    setFormattedStock(formattedValue || "");
                    field.onChange(Number(value?.value) || 0);
                  }}
                  className="input-field "
                />

     
              </FormControl>
              <FormDescription>
                Enter the amount of stock available.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
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
                cols={6}
                placeholder="Description"
                {...field}
              />
            </FormControl>
            <FormDescription>Describe the product.</FormDescription>
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
              <p className=" flex items-center gap-2">
                <span className=" text-xs ">
                  Images: {field.value.length + mediaUrls?.length}
                </span>
                <Button
                  disabled={
                    (!field.value.length && !mediaUrls.length) || isLoading
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
              </p>
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
              <FormDescription>Is the product available?.</FormDescription>
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
    </motion.div>
  );
}

export default StepOne;
{
  /* <Input
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
                /> */
}
