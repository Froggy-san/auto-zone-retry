import { getAllCategoriesAction } from "@lib/actions/categoriesAction";
import { getAllProductBrandsAction } from "@lib/actions/productBrandsActions";
import { getAllProductTypesAction } from "@lib/actions/productTypeActions";
import React from "react";
import ProductsFilterContent from "./product-filter-content";

interface Props {
  name: string;
  categoryId: string;
  productTypeId?: string;
  productBrandId: string;
  isAvailable: string;
}
const ProductsFilterBar: React.FC<Props> = async ({
  categoryId,
  productTypeId,
  isAvailable,
  name,
  productBrandId,
}) => {
  const [categories, productBrands, brandTypes] = await Promise.all([
    getAllCategoriesAction(),
    getAllProductBrandsAction(),
    getAllProductTypesAction(),
  ]);

  const { data: categoriesData, error: categoriesError } = categories;
  const { data: productBrandsData, error: productBrandsError } = productBrands;
  const { data: brandTypesData, error: brandTypesError } = brandTypes;
  // if (categoriesError || brandTypesError || productBrandsError) return null;
  return (
    <aside className={`sm:w-[200px]  sm:p-2 sm:border-t sm:border-r `}>
      <ProductsFilterContent
        name={name}
        categoryId={categoryId}
        productTypeId={productTypeId}
        productBrandId={productBrandId}
        isAvailable={isAvailable}
        categories={categoriesData}
        productBrands={productBrandsData}
        productTypes={brandTypesData}
      />
    </aside>
  );
};

export default ProductsFilterBar;
