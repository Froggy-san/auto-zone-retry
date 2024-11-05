import ProductImages from "@components/products/product-images";
import { Card } from "@components/ui/card";
import { STATIC_IMAGES } from "@lib/constants";
import { CarItem as CarItemProps } from "@lib/types";
import React, { useMemo } from "react";
import CarAction from "./car-item-actions";
import Link from "next/link";

const CarItem = ({
  car,
  pageSize,
}: {
  pageSize?: number;
  car: CarItemProps;
}) => {
  const carImages = car.carImages.map((image) => image.imagePath);

  const viewedImages = carImages.length ? carImages : STATIC_IMAGES;
  return (
    <Card className="   border    min-h-[250px]">
      <Link
        href={`/grage/${car.id}`}
        className="  flex  flex-col  md:flex-row h-full w-full relative "
      >
        <div className="  min-h-[250px] lg:min-h-[300px]  md:min-w-[270px] flex-1">
          <ProductImages
            imageUrls={viewedImages}
            className=" h-full  rounded-tl-xl rounded-tr-xl md:rounded-tr-none  md:rounded-bl-xl  overflow-hidden"
          />
        </div>
        <section className="  w-full  xl:pl-14   text-xs  grid grid-cols-1 items-center xs:grid-cols-2   md:grid-cols-1 lg:grid-cols-2  md:w-[65%] gap-y-2 gap-x-3 md:gap-0  p-3 lg:max-w-[900px]   md:pr-10">
          {/* top */}
          <div className=" flex items-center gap-2  ">
            <span className="">- Make: </span>{" "}
            <span className=" text-muted-foreground  break-all">
              {car.carInfo.carMaker.name}
            </span>
            {car.carInfo.carMaker.logo ? (
              <img
                src={car.carInfo.carMaker.logo}
                className=" h-7 w-7 rounded-md  object-cover"
              />
            ) : null}
          </div>{" "}
          <div className="">
            <span>- Model: </span>{" "}
            <span className=" text-muted-foreground  break-all">
              {car.carInfo.carModel.name}
            </span>
          </div>
          <div className="">
            <span>- Generation: </span>{" "}
            <span className=" text-muted-foreground  break-all">
              {car.carInfo.carGeneration.name}
            </span>
          </div>{" "}
          <div className="">
            <span>- Plate number: </span>{" "}
            <span className=" text-muted-foreground  break-all">
              {car.plateNumber}
            </span>
          </div>
          <div className="">
            <span>- Motor number: </span>{" "}
            <span className=" text-muted-foreground  break-all">
              {car.motorNumber}
            </span>
          </div>{" "}
          <div className="">
            <span>- Chassie number: </span>{" "}
            <span className=" text-muted-foreground  break-all">
              {car.chassisNumber}
            </span>
          </div>{" "}
          <div className=" flex items-center gap-1 ">
            <span>- Color: </span>{" "}
            <div
              style={{
                backgroundColor: `${car.color ? car.color : "black"}`,
              }}
              className=" w-5 h-5 border rounded-md"
            />
          </div>
          <CarAction pageSize={pageSize} carId={car.id} />
        </section>
      </Link>
    </Card>
  );
};

export default CarItem;
