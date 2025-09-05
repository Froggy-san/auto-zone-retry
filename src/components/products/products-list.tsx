import { Product, ProductWithCategory, User } from "@lib/types";
import React from "react";
import ProductItem from "./product-item";
import { getProductsAction } from "@lib/actions/productsActions";
import ErrorMessage from "@components/error-message";
import { ShoppingBasket } from "lucide-react";

interface ProductsListProps {
  pageNumber: string;
  name?: string;
  categoryId?: string;
  productTypeId?: string;
  productBrandId?: string;
  isAvailable?: string;
  makerId?: string;
  modelId?: string;
  generationId?: string;
  user: User | null;
}

const ProductsList: React.FC<ProductsListProps> = async ({
  user,
  pageNumber,
  name,
  categoryId,
  productTypeId,
  productBrandId,
  makerId,
  modelId,
  generationId,
  isAvailable,
}) => {
  const { data: products, error: productsError } = await getProductsAction({
    pageNumber,
    name,
    categoryId,
    productTypeId,
    productBrandId,
    isAvailable,
    makerId,
    modelId,
    generationId,
  });

  if (productsError)
    return (
      <ErrorMessage
        icon={<ShoppingBasket className="  w-10 h-10" />}
        className=" px-2 my-7 "
      >
        {" "}
        {productsError}.
      </ErrorMessage>
    );
  if (!products)
    return (
      <ErrorMessage
        icon={<ShoppingBasket className="  w-10 h-10" />}
        className=" px-2 my-7"
      >
        {" "}
        Something went wrong while grabbing the products.
      </ErrorMessage>
    );
  if (!products.length)
    return (
      <ErrorMessage
        icon={<ShoppingBasket className="  w-10 h-10" />}
        className=" px-2 my-7"
      >
        {" "}
        No products.
      </ErrorMessage>
    );

  const filters = {
    name,
    categoryId,
    productTypeId,
    productBrandId,
    isAvailable,
    makerId,
    modelId,
    generationId,
  };
  const encondedFilters = encodeURIComponent(JSON.stringify(filters));
  return (
    <>
      <ul className=" grid  grid-cols-1 xs:grid-cols-2  p-3   xl:grid-cols-3 gap-3">
        {products && products.length
          ? products.map((product: Product, i: number) => (
              <ProductItem
                user={user}
                currPage={pageNumber}
                pageSize={products.length}
                product={product}
                appliedFilters={encondedFilters}
                key={i}
              />
            ))
          : null}
      </ul>
    </>
  );
};

export default ProductsList;
