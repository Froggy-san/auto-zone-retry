import CarsList from "@components/grage/cars-list";
import Header from "@components/home/header";
import IntersectionProvidor from "@components/products/intersection-providor";
import ProductsFilterBar from "@components/products/products-filter-bar";
import Spinner from "@components/Spinner";
import React, { Suspense } from "react";
interface SearchParams {
  page?: string;
  color?: string;
  plateNumber?: string;
  chassisNumber?: string;
  motorNumber?: string;
  clientId?: string;
  carInfoId?: string;
}
const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  const pageNumber = searchParams.page ?? "1";
  const color = searchParams.color ?? "";
  const plateNumber = searchParams.plateNumber ?? "";
  const chassisNumber = searchParams.chassisNumber ?? "";
  const motorNumber = searchParams.motorNumber ?? "";
  const clientId = searchParams.clientId ?? "";
  const carInfoId = searchParams.carInfoId ?? "";
  const key =
    pageNumber +
    color +
    plateNumber +
    chassisNumber +
    motorNumber +
    clientId +
    carInfoId;
  return (
    <main
      data-vaul-drawer-wrapper
      className=" min-h-screen bg-background flex flex-col"
    >
      <Header />
      <IntersectionProvidor>
        <div className=" flex   flex-1  w-full">
          <ProductsFilterBar
          // name={name}
          // categoryId={categoryId}
          // productTypeId={productTypeId}
          // productBrandId={productBrandId}
          // isAvailable={isAvailable}
          />
          <section className=" flex-1 ">
            <Suspense
              fallback={<Spinner className=" h-[300px]" size={30} />}
              key={key}
            >
              <CarsList
                pageNumber={pageNumber}
                plateNumber={plateNumber}
                motorNumber={motorNumber}
                chassisNumber={chassisNumber}
                clientId={clientId}
                carInfoId={carInfoId}
                color={color}
              />
            </Suspense>
            {/* <ProductPagenation
              name={name}
              categoryId={categoryId}
              productTypeId={productTypeId}
              productBrandId={productBrandId}
              isAvailable={isAvailable}
            /> */}
          </section>
        </div>
      </IntersectionProvidor>
    </main>
  );
};

export default Page;
