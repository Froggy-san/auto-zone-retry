import InventoryList from "@components/dashboard/inventory/inventory-list";
import InventoryManagement from "@components/dashboard/inventory/inventory-management";
import RestockingForm from "@components/dashboard/inventory/restocking-form";
import Spinner from "@components/Spinner";
import React, { Suspense } from "react";
interface SearchParams {
  page?: string;
  name?: string;
  shopName?: string;
  dateOfOrderFrom?: string;
  dateOfOrderTo?: string;
  minTotalPrice?: string;
  maxTotalPrice?: string;
  edit?: string;
}
const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  const pageNumber = searchParams?.page ?? "1";
  const name = searchParams.name ?? "";
  const shopName = searchParams.shopName ?? "";
  const dateOfOrderFrom = searchParams.dateOfOrderFrom ?? "";
  const dateOfOrderTo = searchParams.dateOfOrderTo ?? "";
  const minTotalPrice = searchParams.minTotalPrice ?? "";
  const maxTotalPrice = searchParams.maxTotalPrice ?? "";
  const edit = searchParams.edit ?? "";
  return (
    <main className=" relative">
      <h2 className="  font-semibold text-4xl">INVENTORY MANAGEMENT.</h2>
      <section className=" pl-4">
        <div className=" space-y-5 mt-12">
          {/* <RestockingForm /> */}
          <Suspense
            key={edit}
            fallback={<Spinner size={30} className=" mt-10" />}
          >
            <InventoryManagement edit={edit} />
          </Suspense>
        </div>

        <Suspense fallback={<Spinner size={30} className=" mt-10" />}>
          <InventoryList
            pageNumber={pageNumber}
            name={name}
            shopName={shopName}
            dateOfOrderFrom={dateOfOrderFrom}
            dateOfOrderTo={dateOfOrderTo}
            minTotalPrice={minTotalPrice}
            maxTotalPrice={maxTotalPrice}
          />
        </Suspense>

        {/* <CarGenerationList /> */}
      </section>
    </main>
  );
};

export default Page;
