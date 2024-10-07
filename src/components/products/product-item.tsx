import { getProductsImageAction } from "@lib/actions/productsActions";
import { Product } from "@lib/types";
import { cn } from "@lib/utils";
import React from "react";
import ProductImages from "./product-images";
import { formatCurrency } from "@lib/helper";
import { ProdcutAction } from "./product-actions";
import Link from "next/link";

const ProductItem = async ({ product }: { product: Product }) => {
  const { data, error } = await getProductsImageAction(product.id);

  return (
    <li className={`${!product.isAvailable && "opacity-50 "}`}>
      <Link
        href={`/products/${product.id}`}
        className="space-y-1 flex flex-col"
      >
        {error ? (
          <h2>{error}</h2>
        ) : (
          <ProductImages images={data} productId={product.id} />
        )}

        <div className="    flex-1  space-y-1  flex flex-col ">
          <h1 className=" line-clamp-1 text-xl font-semibold">
            {product.name}
          </h1>
          <h2 className=" text-sm text-muted-foreground break-words line-clamp-2">
            {product.description}
          </h2>
          <div className=" flex justify-between  items-center text-xs">
            <span className=" text-green-500 dark:text-green-600">
              {formatCurrency(product.salePrice)}
            </span>
            <div className=" flex gap-3 items-center">
              <span
                className={cn("text-muted-foreground", {
                  "text-green-500 dark:text-green-600":
                    product.stock && product.isAvailable,
                })}
              >
                {product.stock && product.isAvailable
                  ? "In stock"
                  : "Out of stock"}
              </span>
              <ProdcutAction productId={product.id} />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ProductItem;
