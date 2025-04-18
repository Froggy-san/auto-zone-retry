import CarGenAndModelManagement from "@components/dashboard/cars-data/car-generation-management";
import CarMakerManagement from "@components/dashboard/car-makers-managment";
import CarMakerList from "@components/dashboard/cars-data/car-makers-list";
import { Metadata } from "next";

import React from "react";
export const metadata: Metadata = {
  title: "Cars Data",
};
const Page = () => {
  return (
    <main>
      <h2 className="  font-semibold text-4xl">CARS DATA.</h2>
      <section className=" sm:pl-4">
        <div className="  space-y-40   mt-12">
          <div className=" space-y-3 ">
            <CarMakerManagement />
            <CarMakerList />
          </div>
          {/* <CarModelsList /> */}
          <CarGenAndModelManagement />
        </div>
      </section>
    </main>
  );
};

export default Page;
