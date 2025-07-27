import {
  CarGenerationProps,
  CarMakerData,
  CarModelProps,
  Category,
  ProductBrand,
  ProductById,
  ProductImage,
  ProductsSchema,
  ProductType,
} from "@lib/types";
import { Control } from "react-hook-form";
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
import { useState } from "react";
import { ModelCombobox } from "@components/model-combobox";
import GenerationsTagInput from "@components/generations-tag-input";

interface StepOneProps {
  control: Control<z.infer<typeof ProductsSchema>>;
  isLoading: boolean;
  categories: Category[];
  productTypes: ProductType[];
  productBrand: ProductBrand[];
  isMainImage: number | ProductImage | null;
  mediaUrls: ProductImage[];
  productToEdit?: ProductById;
  currStep: number[];
  makerId: number | null;
  modelId: number | null;
  carMaker: CarMakerData | undefined;
  handleDeleteMedia(productImage?: ProductImage): void;
  setIsMainImage: React.Dispatch<
    React.SetStateAction<number | ProductImage | null>
  >;
  setDeletedMedia: React.Dispatch<React.SetStateAction<ProductImage[]>>;
}

function StepOne({
  currStep,
  control,
  isLoading,
  categories,
  productBrand,
  productTypes,
  isMainImage,
  setIsMainImage,
  handleDeleteMedia,
  mediaUrls,
  setDeletedMedia,
  productToEdit,
  makerId,
  modelId,
  carMaker,
}: StepOneProps) {
  const [searchTerm, setSearchTerm] = useState(carMaker?.name || "");
  const [step, direction] = currStep;
  const { carBrands, isLoading: searching, error } = useCarBrands(searchTerm);
  const carModels =
    makerId && carBrands?.find((car) => car.id === makerId)?.carModels;
  const carGenerations =
    modelId &&
    carModels &&
    carModels.find((model) => model.id === modelId)?.carGenerations;

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
      <FormField
        disabled={isLoading}
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input disabled={isLoading} placeholder="name" {...field} />
            </FormControl>
            <FormDescription>Enter the name of the product.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className=" flex  flex-col gap-2 sm:flex-row">
        <FormField
          disabled={isLoading}
          control={control}
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
              <FormDescription>Enter the listing price.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading}
          control={control}
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
              <FormDescription>Enter the discounted price.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className=" flex  flex-col gap-2 sm:flex-row">
        <FormField
          disabled={isLoading}
          control={control}
          name="makerId"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>Car brand</FormLabel>
              <FormControl>
                <CarBrandsCombobox
                  options={carBrands || []}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  value={field.value}
                  setValue={field.onChange}
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
          control={control}
          name="modelId"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>Car model</FormLabel>
              <FormControl>
                <ModelCombobox
                  disabled={!carModels || !carModels.length}
                  options={carModels || []}
                  value={field.value}
                  setValue={field.onChange}
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
          control={control}
          name="generationsArr"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>Car model</FormLabel>
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
        <FormField
          disabled={isLoading}
          control={control}
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
                Enter the amount of stock available.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading || !categories.length}
          control={control}
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
                Enter what category does the product belong to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className=" flex  flex-col gap-2 sm:flex-row">
        <FormField
          disabled={isLoading || !productBrand.length}
          control={control}
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
              <FormDescription>Enter the brand of the product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isLoading || !productTypes.length}
          control={control}
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
                Enter what type of product it is.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        disabled={isLoading}
        control={control}
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
        control={control}
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
        control={control}
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
