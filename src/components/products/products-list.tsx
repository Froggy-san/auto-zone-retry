import { Product } from "@lib/types";
import React from "react";

interface ProductsListProps {
  productsArr: Product[];
}

const ProductsList: React.FC<ProductsListProps> = ({ productsArr }) => {
  return <ul className=" grid grid-cols-2 md:grid-cols-3 ">ProductsList</ul>;
};

export default ProductsList;
