import ProductManagement from "@components/dashboard/products-management";
import ProdcutViewDetials from "@components/products/product-view-detials";
import ProductViewImages from "@components/products/product-view-images";
import { Button } from "@components/ui/button";
import {
  getProductByIdAction,
  getProductsImageAction,
} from "@lib/actions/productsActions";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Link from "next/link";
import React from "react";

const ProductView = async ({ params }: { params: Params }) => {
  // const [product, productImages] = await Promise.all([
  //   getProductByIdAction(params.productId),
  //   getProductsImageAction(params.productId),
  // ]);

  const { data: productData, error } = await getProductByIdAction(
    params.productId
  );
  // const { data: images, error: productImagesError } = productImages;
  // const { data: productData, error: producError } = product;

  // console.log(product.data, productImages.data, "PPPPPPPPPPPPP");

  if (!productData)
    return (
      <p>
        {" "}
        Something went wrong, please refresh the page or login into your
        account.{" "}
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </p>
    );

  return (
    <div>
      <ProductViewImages
        images={productData.productImages}
        productId={productData.productId}
      />
      <div className=" text-xs  text-muted-foreground my-4 text-right px-3">
        {productData.stock ? (
          <i>
            Stock: <span>{productData.stock}</span>
          </i>
        ) : (
          <i>Out of stock</i>
        )}
      </div>
      <ProdcutViewDetials product={productData} />

      <ProductManagement
        useParams
        className=" w-[97%] mx-auto mb-6"
        productToEdit={productData}
      />
    </div>
  );
};

export default ProductView;
