import ProductManagement from "@components/dashboard/products-management";
import ProdcutViewDetials from "@components/products/product-view-detials";
import FullImagesGallery from "@components/full-images-gallery";
import { Button } from "@components/ui/button";
import { getProductByIdAction } from "@lib/actions/productsActions";
import { STATIC_IMAGES } from "@lib/constants";
import { ProductImage } from "@lib/types";
import Link from "next/link";
import React from "react";

interface Params {
  productId: string;
}

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

  if (error)
    return <p>Something went wrong while searching for the product&rsquo;</p>;

  const imageUrls = productData?.productImages?.map(
    (image: ProductImage) => image.imageUrl
  );
  if (!productData)
    return (
      <p>
        {" "}
        Couldn&apos;t find that products&rsquo;{" "}
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </p>
    );

  return (
    <div>
      <FullImagesGallery
        images={imageUrls || STATIC_IMAGES}
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
