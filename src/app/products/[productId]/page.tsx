import ProductManagement from "@components/dashboard/products-management";
import ProdcutViewDetials from "@components/products/product-view-detials";
import FullImagesGallery from "@components/full-images-gallery";
import { Button } from "@components/ui/button";
import { getProductByIdAction } from "@lib/actions/productsActions";
import { STATIC_IMAGES } from "@lib/constants";
import { ProductImage } from "@lib/types";
import Link from "next/link";
import React from "react";
import { getCurrentUser } from "@lib/actions/authActions";
import { ImageOff } from "lucide-react";

interface Params {
  productId: string;
}

const ProductView = async ({ params }: { params: Params }) => {
  const [product, user] = await Promise.all([
    getProductByIdAction(params.productId),
    getCurrentUser(),
  ]);

  const { data: productData, error } = product;
  // const { data: images, error: productImagesError } = productImages;
  // const { data: productData, error: producError } = product;

  // console.log(product.data, productImages.data, "PPPPPPPPPPPPP");

  if (error)
    return <p>Something went wrong while searching for the product&rsquo;</p>;

  const imageUrls = productData?.productImages?.map(
    (image: ProductImage) => image.imageUrl
  );

  console.log(imageUrls, "WWWW");
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
      {imageUrls.length ? (
        <FullImagesGallery
          images={imageUrls}
          productId={productData.productId}
        />
      ) : (
        <div className=" h-full flex items-center justify-center  bg-foreground/10  font-semibold text-xl py-5 gap-3">
          <ImageOff className=" w-10 h-10" /> No images.
        </div>
      )}
      <div className=" text-xs  text-muted-foreground my-4 text-right px-3">
        {productData.stock ? (
          <i>
            Stock: <span>{productData.stock}</span>
          </i>
        ) : (
          <i>Out of stock</i>
        )}
      </div>
      <ProdcutViewDetials user={user} product={productData} />

      {user ? (
        <ProductManagement
          useParams
          className=" w-[97%] mx-auto mb-6"
          productToEdit={productData}
        />
      ) : null}
    </div>
  );
};

export default ProductView;
