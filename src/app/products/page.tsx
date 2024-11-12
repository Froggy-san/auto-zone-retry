import React, { Suspense } from "react";

import Header from "@components/home/header";
import ProductsList from "@components/products/products-list";
import Spinner from "@components/Spinner";
import ProductPagenation from "@components/products/product-pagenation";
import ProductsFilterBar from "@components/products/products-filter-bar";
import IntersectionProvidor from "@components/products/intersection-providor";

// Define the type for searchParam
interface SearchParams {
  // Add the properties you expect in searchParam

  page?: string;
  name?: string;
  categoryId?: string;
  productTypeId?: string;
  productBrandId?: string;
  isAvailable?: string;
}

const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  const name = searchParams?.name ?? "";
  const pageNumber = searchParams?.page ?? "1";
  const categoryId = searchParams?.categoryId ?? "";
  const productTypeId = searchParams?.productTypeId ?? "";
  const productBrandId = searchParams?.productBrandId ?? "";
  const isAvailable = searchParams?.isAvailable ?? "";

  // if (productsError || categoriesError) {
  //   return <div>Error loading data</div>;
  // }

  const key =
    pageNumber +
    categoryId +
    productTypeId +
    productBrandId +
    isAvailable +
    name;

  return (
    <main
      data-vaul-drawer-wrapper
      className=" min-h-screen bg-background flex flex-col"
    >
      <Header />
      <IntersectionProvidor>
        <div className=" flex   flex-1  w-full">
          <ProductsFilterBar
            name={name}
            categoryId={categoryId}
            productTypeId={productTypeId}
            productBrandId={productBrandId}
            isAvailable={isAvailable}
          />
          <section className=" flex-1 ">
            <Suspense fallback={<Spinner />} key={key}>
              <ProductsList
                name={name}
                pageNumber={pageNumber}
                categoryId={categoryId}
                productTypeId={productTypeId}
                productBrandId={productBrandId}
                isAvailable={isAvailable}
              />
            </Suspense>
            <ProductPagenation
              name={name}
              categoryId={categoryId}
              productTypeId={productTypeId}
              productBrandId={productBrandId}
              isAvailable={isAvailable}
            />
          </section>
        </div>
      </IntersectionProvidor>
    </main>
  );
};

export default Page;
