import React from "react";
import ProductsFilterContent from "./product-filter-content";
import {
  CarMakersData,
  Category,
  CategoryProps,
  ProductBrand,
  ProductType,
} from "@lib/types";

interface Props {
  name: string;
  categoryId: string;
  productTypeId?: string;
  productBrandId: string;
  makerId: string;
  modelId: string;
  generationId: string;
  isAvailable: string;
  categories: CategoryProps[];
  carMakers: CarMakersData[];
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
  count,
  makerId,
  modelId,
  generationId,
  carBrand,
  carMakers,
}) => {
  return (
    <aside className={`sm:w-[210px]  3xl:w-[260px]    sm:border-r `}>
      <ProductsFilterContent
        name={name}
        count={count || 0}
        categoryId={categoryId}
        productTypeId={productTypeId}
        productBrandId={productBrandId}
        isAvailable={isAvailable}
        categories={categories || []}
        productBrands={productBrands || []}
        carMakers={carMakers}
        makerId={makerId}
        modelId={modelId}
        generationId={generationId}
        carBrand={carBrand}
      />
    </aside>
  );
};

export default ProductsFilterBar;
