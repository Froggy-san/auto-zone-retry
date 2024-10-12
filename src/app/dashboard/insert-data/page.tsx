import CarGenerationList from "@components/dashboard/car-generation-list";
import CarGenerationManagement from "@components/dashboard/car-generation-management";
import CarInfoManagement from "@components/dashboard/car-info-management";
import CarMakerManagement from "@components/dashboard/car-makers-managment";
import CarModelManagement from "@components/dashboard/car-model-management";
import CategroyForm from "@components/dashboard/category-from";
import CategoryList from "@components/dashboard/cetgory-list";
import ProductBrandForm from "@components/dashboard/product-brand-form";
import ProductTypeForm from "@components/dashboard/product-type-form";
import ProductManagement from "@components/dashboard/products-management";
import Spinner from "@components/Spinner";
import Link from "next/link";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <main>
      <h2 className="  font-semibold text-4xl">INSERT RELEVENT DATA.</h2>
      <section className=" pl-4">
        <div className=" space-y-5 mt-12">
          <CategroyForm />
          <ProductTypeForm />
          <ProductBrandForm />
          <CarMakerManagement />
          <CarModelManagement />
          <CarGenerationManagement />
          <CarInfoManagement />
          <ProductManagement />
        </div>
        <Link href="/products">Products</Link>
        {/* <Suspense fallback={<Spinner size={30} className=" mt-10" />}>
          <CategoryList />
        </Suspense> */}

        <CarGenerationList />
      </section>
    </main>
  );
};

export default Page;
