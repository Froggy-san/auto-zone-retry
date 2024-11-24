import { getCarsAction } from "@lib/actions/carsAction";
import { CarItem as CarItemProps } from "@lib/types";
import React from "react";
import CarItem from "./car-item";
import { Car } from "lucide-react";

interface CarsListProps {
  color: string;
  plateNumber: string;
  chassisNumber: string;
  motorNumber: string;
  clientId: string;
  carGenerationId: string;
  pageNumber: string;
}

const CarsList = async ({
  color,
  plateNumber,
  chassisNumber,
  motorNumber,
  clientId,
  carGenerationId,
  pageNumber,
}: CarsListProps) => {
  const { data, error } = await getCarsAction({
    pageNumber,
    plateNumber,
    chassisNumber,
    motorNumber,
    clientId,
    carInfoId: carGenerationId,
    color,
  });

  if (error) return <p>{error}</p>;
  if (!data) return <p>Something went wrong</p>;
  if (!data.length)
    return (
      <div className=" h-32  text-center  flex flex-col-reverse   font-semibold  items-center gap-2 justify-center">
        No cars. <Car className=" w-10 h-10  " />
      </div>
    );

  return (
    <ul className="  gap-3 border-t  px-2 pt-2 grid grid-cols-1">
      {data &&
        data.map((car: CarItemProps) => (
          <CarItem pageSize={data.length} key={car.id} car={car} />
        ))}
    </ul>
  );
};

export default CarsList;
