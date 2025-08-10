import React from "react";
import ProductsFilterContent from "./product-filter-content";
import { Category, ProductBrand, ProductType } from "@lib/types";

interface Props {
  name: string;
  categoryId: string;
  productTypeId?: string;
  productBrandId: string;
  makerId: string;
  modelId: string;
  generationId: string;
  isAvailable: string;
  categories: Category[];
  productTypes: ProductType[];
  productBrands: ProductBrand[];
  carBrand?: string;
  count: number;
}
const ProductsFilterBar: React.FC<Props> = async ({
  categoryId,
  productTypeId,
  isAvailable,
  name,
  productBrandId,
  categories,
  productBrands,
  productTypes,
  count,
  makerId,
  modelId,
  generationId,
  carBrand,
}) => {
  return (
    <aside className={`sm:w-[200px]    sm:border-r `}>
      <ProductsFilterContent
        name={name}
        count={count || 0}
        categoryId={categoryId}
        productTypeId={productTypeId}
        productBrandId={productBrandId}
        isAvailable={isAvailable}
        categories={categories || []}
        productBrands={productBrands || []}
        productTypes={productTypes || []}
        makerId={makerId}
        modelId={modelId}
        generationId={generationId}
        carBrand={carBrand}
      />
    </aside>
  );
};

export default ProductsFilterBar;
