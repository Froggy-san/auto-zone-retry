import Categories from "@components/dashboard/insert-data/categories";
import ProductBrands from "@components/dashboard/insert-data/product-brands";
import ProductTypes from "@components/dashboard/insert-data/product-types";
import ServiceStatus from "@components/dashboard/insert-data/service-status";
import StatusManagement from "@components/dashboard/insert-data/status-management";
import Spinner from "@components/Spinner";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Insert-Data",
};
const Page = () => {
  return (
    <main className=" relative">
      <h2 className="  font-semibold text-4xl">INSERT RELEVENT DATA.</h2>
      <section className=" sm:pl-4">
        <div className=" space-y-20 mt-12">
          <Categories />
          <ProductTypes />
          <ProductBrands />
          <div className=" space-y-7">
            <StatusManagement />
            <Suspense fallback={<Spinner className=" h-[150px]" />}>
              <ServiceStatus />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
