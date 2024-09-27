import ProductForm from "@components/products/products-form";
import { getProductsAction } from "@lib/actions/productsAction";
import React from "react";

const Page = async () => {
  const products = await getProductsAction();

  console.log(products, "PRODUCTSSS");

  return (
    <div>
      {products?.length &&
        products.map((pro: any, i: number) => <div key={i}>{pro.name}</div>)}
      <ProductForm />
    </div>
  );
};

export default Page;
