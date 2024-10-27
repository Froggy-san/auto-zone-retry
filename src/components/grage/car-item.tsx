import ProductImages from "@components/products/product-images";
import { Card } from "@components/ui/card";
import { STATIC_IMAGES } from "@lib/constants";
import { CarItem as CarItemProps } from "@lib/types";
import React, { useMemo } from "react";
import CarAction from "./car-item-actions";
import Link from "next/link";

const CarItem = ({ car }: { car: CarItemProps }) => {
  const carImages = car.carImages.map((image) => image.imagePath);

  const viewedImages = carImages.length ? carImages : STATIC_IMAGES;
  return (
    <li className="   border  rounded-xl  min-h-[250px]">
      <Link
        href={`/grage/${car.id}`}
        className="  flex  flex-col  md:flex-row h-full w-full relative "
      >
        <div className="  min-h-[250px] flex-1">
          <ProductImages
            imageUrls={viewedImages}
            className=" h-full  rounded-tl-xl rounded-tr-xl md:rounded-tr-none  md:rounded-bl-xl  overflow-hidden"
          />
        </div>
        <section className="  w-full  text-xs md:text-base  md:w-[65%] space-y-6  p-3   md:pr-10">
          {/* top */}

          <div className=" flex items-center gap-3 ">
            <div className=" flex items-center gap-2">
              <span className="">Make: </span>{" "}
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
            <div>
              <span>Model: </span>{" "}
              <span className=" text-muted-foreground  break-all">
                {car.carInfo.carModel.name}
              </span>
            </div>
          </div>

          {/* top */}
          <div className=" flex items-center gap-3 ">
            <div>
              <span>Generation: </span>{" "}
              <span className=" text-muted-foreground  break-all">
                {car.carInfo.carGeneration.name}
              </span>
            </div>{" "}
            <div>
              <span>Plate number: </span>{" "}
              <span className=" text-muted-foreground  break-all">
                {car.plateNumber}
              </span>
            </div>
          </div>

          <div className=" flex gap-3 flex-wrap">
            <div>
              <span>Motor number: </span>{" "}
              <span className=" text-muted-foreground  break-all">
                {car.motorNumber}
              </span>
            </div>{" "}
            <div>
              <span>Chassie number: </span>{" "}
              <span className=" text-muted-foreground  break-all">
                {car.chassisNumber}
              </span>
            </div>{" "}
            <div className=" flex items-center gap-1">
              <span>Color: </span>{" "}
              <div
                style={{
                  backgroundColor: `${car.color ? car.color : "black"}`,
                }}
                className=" w-5 h-5 border rounded-md"
              ></div>
            </div>
            <CarAction />
          </div>
        </section>
      </Link>
    </li>
  );
};

export default CarItem;
