import { Product, ProductWithCategory } from "@lib/types";
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
}

const ProductsList: React.FC<ProductsListProps> = async ({
  pageNumber,
  name,
  categoryId,
  productTypeId,
  productBrandId,
  isAvailable,
}) => {
  const { data: products, error: productsError } = await getProductsAction({
    pageNumber,
    name,
    categoryId,
    productTypeId,
    productBrandId,
    isAvailable,
  });

  if (productsError) return <p>{productsError}</p>;
  if (!products)
    return <p>Something went wrong while grabing the products data</p>;
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
  return (
    <>
      <ul className=" grid  grid-cols-1 xs:grid-cols-2  p-3 border-t   xl:grid-cols-3 gap-3">
        {products && products.length
          ? products.map((product: ProductWithCategory, i: number) => (
              <ProductItem
                currPage={pageNumber}
                pageSize={products.length}
                product={product}
                key={i}
              />
            ))
          : null}
      </ul>
    </>
  );
};

export default ProductsList;
