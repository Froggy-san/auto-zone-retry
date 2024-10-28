import { getCarsAction } from "@lib/actions/carsAction";
import { CarItem as CarItemProps } from "@lib/types";
import React from "react";
import CarItem from "./car-item";

interface CarsListProps {
  color: string;
  plateNumber: string;
  chassisNumber: string;
  motorNumber: string;
  clientId: string;
  carInfoId: string;
  pageNumber: string;
}

const CarsList = async ({
  color,
  plateNumber,
  chassisNumber,
  motorNumber,
  clientId,
  carInfoId,
  pageNumber,
}: CarsListProps) => {
  const { data, error } = await getCarsAction({
    pageNumber,
    plateNumber,
    chassisNumber,
    motorNumber,
    clientId,
    carInfoId,
    color,
  });

  if (error) return <p>{error}</p>;
  if (!data) return <p>Something went wrong</p>;
  if (!data.length) return <p>No cars.</p>;

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
