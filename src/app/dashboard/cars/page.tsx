import CarManagement from "@components/dashboard/cars/car-management";
import React from "react";

const page = () => {
  return (
    <main>
      <h2 className="  font-semibold text-4xl">MANAGE GRAGE.</h2>

      <section className=" pl-4 mt-12">
        <CarManagement />
        <div className=" max-w-[97%]  mx-auto mt-10  "></div>
      </section>
    </main>
  );
};

export default page;
