import { Product } from "@lib/types";
import { cn } from "@lib/utils";
import { ImageOff } from "lucide-react";
import Link from "next/link";
import React from "react";

const ProductItem = ({ product }: { product: Product }) => {
  return (
    <li
      className={cn("", {
        " opacity-65": !product.stock || !product.isAvailable,
      })}
    >
      <Link href="/" className=" space-y-4">
        <div className=" flex items-center justify-center  h-60">
          <ImageOff size={30} />
        </div>

        <h1 className=" line-clamp-2 font-semibold">{product.name}</h1>
        <h2 className=" line-clamp-3 text-sm">{product.description}</h2>
        <div className=" flex justify-end gap-2 text-xs">
          <div>
            {" "}
            <span className=" font-semibold">Stock:</span>{" "}
            <span className=" text-red-600">{product.stock}</span>
          </div>

          <div>
            {" "}
            <span className=" font-semibold">Price:</span>{" "}
            <span className=" text-green-600">{product.salePrice}</span>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ProductItem;
