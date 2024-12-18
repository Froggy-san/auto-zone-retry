import Categories from "@components/dashboard/insert-data/categories";
import ProductBrands from "@components/dashboard/insert-data/product-brands";
import ProductTypes from "@components/dashboard/insert-data/product-types";
import ServiceStatus from "@components/dashboard/insert-data/service-status";
import StatusManagement from "@components/dashboard/insert-data/status-management";
import { Metadata } from "next";

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
            <ServiceStatus />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
