import ProductManagement from "@components/products-management";
import ProdcutViewDetials from "@components/products/product-view-detials";
import FullImagesGallery from "@components/full-images-gallery";
import { Button } from "@components/ui/button";
import { getProductByIdAction } from "@lib/actions/productsActions";
import { ProductImage } from "@lib/types";
import Link from "next/link";
import React from "react";
import { getCurrentUser } from "@lib/actions/authActions";
import { ArrowBigLeftDash, ArrowBigRightDash, ImageOff } from "lucide-react";
import { getAllCategoriesAction } from "@lib/actions/categoriesAction";
import { getAllProductBrandsAction } from "@lib/actions/productBrandsActions";
import { getAllProductTypesAction } from "@lib/actions/productTypeActions";
import DeleteManagement from "@components/products/delete-management";
import { Metadata } from "next";
import { ProductSwipeNavigator } from "@components/products/product-swipe-navigator";

export const metadata: Metadata = {
  title: "Product Details",
};

interface Params {
  productId: string;
}
interface searchParams {
  size?: string;
  page?: string;
}
const ProductView = async ({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: searchParams;
}) => {
  const currPage = searchParams.page ?? "";
  const pageSize = searchParams.size ?? "";

  const [product, user, categories, productBrands, brandTypes] =
    await Promise.all([
      getProductByIdAction(params.productId),
      getCurrentUser(),
      getAllCategoriesAction(),
      getAllProductBrandsAction(),
      getAllProductTypesAction(),
    ]);

  const { data: productData, error } = product;
  const { data: categoriesData, error: categoriesError } = categories;
  const { data: productBrandsData, error: productBrandsError } = productBrands;
  const { data: brandTypesData, error: brandTypesError } = brandTypes;

  // const { data: images, error: productImagesError } = productImages;
  // const { data: productData, error: producError } = product;

  if (error) return <p>{error}</p>;
  if (!productData) return <div>Couldn&apos;t find the product.</div>;

  const prevPro = productData.pages?.prevPro || null;
  const nextPro = productData.pages?.nextPro || null;
  const imageUrls = productData?.productImages.map(
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
    <ProductSwipeNavigator
      currentProductId={productData.id}
      prevProductId={prevPro}
      nextProductId={nextPro}
    >
      <div className=" relative">
        {/* {nextPro && (
        <div className=" fixed -left-10 top-0  hover:left-0 z-30  hover:backdrop-blur-sm  transition-all  h-full w-16 flex items-center justify-center">
          <Button asChild variant="secondary">
            <Link href={`/products/${nextPro}`} replace>
              <ArrowBigLeftDash className=" w-5 h-5" />
            </Link>
          </Button>
        </div>
      )}

      {prevPro && (
        <div className=" fixed -right-10 hover:right-0 hover:backdrop-blur-sm transition-all top-0 z-30  h-full w-16 flex items-center justify-center">
          <Button asChild variant="secondary">
            <Link href={`/products/${prevPro}`} replace>
              <ArrowBigRightDash className=" h-5 w-5" />
            </Link>
          </Button>
        </div>
      )} */}
        {imageUrls?.length ? (
          <FullImagesGallery images={imageUrls} productId={productData.id} />
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
          <div className=" flex flex-col mb-5 sm:flex-row items-center gap-5  px-2  sm:px-5">
            <ProductManagement
              useParams
              className=" w-full"
              categories={categoriesData}
              productBrands={productBrandsData}
              productTypes={brandTypesData}
              productToEdit={productData}
            />

            <DeleteManagement
              imagesToDelete={imageUrls}
              pageSize={Number(pageSize)}
              currPage={Number(currPage)}
              productId={Number(params.productId)}
            />
          </div>
        ) : null}
      </div>
    </ProductSwipeNavigator>
  );
};

export default ProductView;
