import { formatCurrency } from "@lib/helper";
import { ProductById } from "@lib/types";
import React from "react";

const ProdcutViewDetials = ({ product }: { product: ProductById }) => {
  return (
    <main className=" mt-10">
      <h1 className=" text-center text-3xl font-semibold tracking-wide">
        {product.name}
      </h1>
      <section className=" mt-10 space-y-7 p-6">
        <div className=" text-xs items-center  flex justify-between">
          <div className="  flex  gap-3">
            <span>
              Listing price:{" "}
              <span className=" text-red-400">
                {" "}
                {formatCurrency(product.listPrice)}
              </span>
            </span>
            <span className=" ">
              Sales price:{" "}
              <span className=" text-green-400">
                {" "}
                {formatCurrency(product.salePrice)}
              </span>
            </span>
          </div>

          <div>
            <span>
              Created at:{" "}
              <span className=" text-muted-foreground">
                {product.dateAdded}
              </span>
            </span>
          </div>
        </div>

        <div>
          <h2 className=" text-xl">Description</h2>
          <p className=" text-muted-foreground">{product.description}</p>
        </div>
      </section>
    </main>
  );
};

export default ProdcutViewDetials;
