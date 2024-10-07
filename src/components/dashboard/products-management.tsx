import ProductForm from "@components/products/products-form";
import { getAllCarsInfoAction } from "@lib/actions/carInfoActions";
import { getAllCategoriesAction } from "@lib/actions/categoriesAction";
import { getAllProductBrandsAction } from "@lib/actions/productBrandsActions";
import { getAllProductTypesAction } from "@lib/actions/productTypeActions";
import { Product, ProductById, ProductImage } from "@lib/types";
import { cn } from "@lib/utils";
import React from "react";

const ProductManagement = async ({
  productToEdit,
  productToEditImages,
  useParams = false,
  className,
}: {
  productToEdit?: ProductById;
  productToEditImages?: ProductImage[];
  className?: string;
  useParams?: boolean;
}) => {
  const [categories, carInfos, productBrands, brandTypes] = await Promise.all([
    getAllCategoriesAction(),
    getAllCarsInfoAction(),
    getAllProductBrandsAction(),
    getAllProductTypesAction(),
  ]);

  const { data: categoriesData, error: categoriesError } = categories;
  const { data: carInfosData, error: carInfosError } = carInfos;
  const { data: productBrandsData, error: productBrandsError } = productBrands;
  const { data: brandTypesData, error: brandTypesError } = brandTypes;

  const isError =
    categoriesError || carInfosError || productBrandsError || brandTypesError;

  if (isError)
    return <p>Something went wrong while trying to fetch some data!.</p>;

  return (
    <div
      className={cn(
        "flex  flex-col  gap-y-2 xs:flex-row xs:items-center justify-between rounded-lg border p-3 shadow-sm gap-x-7",
        className
      )}
    >
      <div className="space-y-0.5   ">
        <label className=" font-semibold">Products</label>
        <p className=" text-muted-foreground text-sm">
          {productToEdit ? "Edit product." : "Add product."}
        </p>
      </div>
      <div className=" flex items-center  gap-3">
        <ProductForm
          useParams={useParams}
          productToEdit={productToEdit}
          categories={categoriesData}
          carinfos={carInfosData}
          productBrand={productBrandsData}
          productTypes={brandTypesData}
        />
      </div>
    </div>
  );
};

export default ProductManagement;
