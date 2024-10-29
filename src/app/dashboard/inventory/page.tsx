import InventoryManagement from "@components/dashboard/inventory/inventory-management";
import RestockingForm from "@components/dashboard/inventory/restocking-form";
import React from "react";

const page = () => {
  return (
    <main>
      <h2 className="  font-semibold text-4xl">INSERT RELEVENT DATA.</h2>
      <section className=" pl-4">
        <div className=" space-y-5 mt-12">
          <RestockingForm />
          <InventoryManagement />
        </div>

        {/* <Suspense fallback={<Spinner size={30} className=" mt-10" />}>
      <CategoryList />
    </Suspense> */}

        {/* <CarGenerationList /> */}
      </section>
    </main>
  );
};

export default page;
