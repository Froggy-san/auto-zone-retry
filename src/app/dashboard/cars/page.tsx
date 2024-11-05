import CarManagement from "@components/grage/car-management";
import CarsList from "@components/grage/cars-list";
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
const page = ({ searchParams }: { searchParams: SearchParams }) => {
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
    <main>
      <h2 className="  font-semibold text-4xl">MANAGE GRAGE.</h2>

      <section className=" sm:pl-4 mt-12">
        {/* <CarManagement />
        <div className=" max-w-[97%]  mx-auto mt-10  ">
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
        </div> */}
      </section>
    </main>
  );
};

export default page;
