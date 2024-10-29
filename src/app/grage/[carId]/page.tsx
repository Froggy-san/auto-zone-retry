import CarItem from "@components/grage/car-item";
import FullImagesGallery from "@components/full-images-gallery";
import { getCarByIdAction } from "@lib/actions/carsAction";
import { STATIC_IMAGES } from "@lib/constants";
import { ClientWithPhoneNumbers } from "@lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import CarManagement from "@components/grage/car-management";
import DeleteCar from "@components/grage/delete-car";

interface Params {
  carId: string;
}

const Page = async ({ params }: { params: Params }) => {
  const { data, error } = await getCarByIdAction(params.carId);

  console.log(data, "CAR BY ID");
  if (error) return <p>{error}</p>;
  if (!data) return <p>Couldn&apos;t find a car with that id {params.carId}</p>;

  const car = data.cars.find((car) => car.id === Number(params.carId));
  const images = car?.carImages.map((image) => image.imagePath);
  const carInfo = car?.carInfo;
  const client = { name: data.name, email: data.email };
  const clinetPhones = data.phones;

  const clientOtherCars = data.cars.filter(
    (car) => car.id !== Number(params.carId)
  );
  // const client: ClientWithPhoneNumbers = data.client;
  return (
    <main className=" min-h-screen ">
      <FullImagesGallery images={images?.length ? images : STATIC_IMAGES} />

      <section className="mt-10  space-y-40 px-2 sm:px-4 pb-10">
        {/* ---- */}
        <div className=" flex text-sm justify-between items-center">
          <div>
            Plate number:{" "}
            <span className=" text-xs text-muted-foreground">
              {car?.plateNumber}
            </span>
          </div>

          <div className=" flex items-center gap-3">
            Mark:{" "}
            {carInfo?.carMaker.logo ? (
              <img
                src={carInfo.carMaker.logo}
                className="  object-contain max-w-12 max-h-12"
              />
            ) : (
              <span className=" text-xs text-muted-foreground">Logo</span>
            )}
          </div>
        </div>{" "}
        {/* ---- */}
        {/* Client */}
        <div className=" space-y-7">
          <h2 className=" font-semibold text-xl">Clinet:</h2>
          <div>
            <div className=" ">
              <span>Name:</span>{" "}
              <span className=" text-sm text-muted-foreground break-all">
                {client.name}
              </span>
            </div>

            <div>
              <span>Email: </span>{" "}
              <span className=" text-sm text-muted-foreground break-all">
                {client.email}
              </span>
            </div>

            <div className=" flex items-center   flex-wrap">
              <span>Phones: </span>
              <div className="">
                {clinetPhones.length ? (
                  clinetPhones.map((phone, i) => (
                    <span
                      key={i}
                      className=" text-xs  ml-3 text-muted-foreground"
                    >
                      {i + 1}: {phone.number}
                    </span>
                  ))
                ) : (
                  <span> - </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Client */}
        {/* Car Information starts*/}
        <div className="space-y-7">
          <h2 className=" text-xl font-semibold">Car Information:</h2>

          <div className=" text-sm ">
            <div className=" flex flex-wrap items-center gap-5  ">
              <div>
                <span>Plate number: </span>
                <span className=" text-xs text-muted-foreground break-all">
                  {car?.plateNumber}
                </span>
              </div>

              <div>
                <span>Chassis number: </span>
                <span className=" text-xs text-muted-foreground break-all">
                  {car?.motorNumber}
                </span>
              </div>

              <div>
                <span>Motor number: </span>
                <span className=" text-xs text-muted-foreground break-all">
                  {car?.motorNumber}
                </span>
              </div>

              <div className=" flex items-center gap-3 ">
                <span>Color: </span>
                <span
                  className=" h-7 w-7 rounded-lg border"
                  style={{ backgroundColor: `${car?.color}` }}
                />
              </div>
            </div>

            <div className=" mt-7">
              <h3 className=" font-semibold text-lg">Notes:</h3>
              <p className=" break-all">{car?.notes}</p>
            </div>
          </div>
          {/* Maker Starts */}
          <div className=" space-y-5 ">
            <h3 className="  font-semibold">Car maker:</h3>

            <div className=" text-sm">
              Name:{" "}
              <span className=" text-xs text-muted-foreground break-all">
                {carInfo?.carMaker.name}
              </span>
            </div>

            <div className=" text-sm">
              Notes:{" "}
              <span className=" text-xs text-muted-foreground break-all">
                {carInfo?.carMaker.notes}
              </span>
            </div>
          </div>
          {/* Maker Ends */}

          {/* Model Starts */}
          <div className=" space-y-5 ">
            <h3 className=" font-semibold">Car model:</h3>

            <div className=" text-sm">
              Name:{" "}
              <span className=" text-xs text-muted-foreground break-all">
                {carInfo?.carModel.name}
              </span>
            </div>

            <div className=" text-sm">
              Notes:{" "}
              <span className=" text-xs text-muted-foreground break-all">
                {carInfo?.carModel.notes}
              </span>
            </div>
          </div>
          {/* Model Ends */}

          {/* Generation Starts */}
          <div className=" space-y-5 ">
            <h3 className=" font-semibold">Car generation:</h3>

            <div className=" text-sm">
              Name:{" "}
              <span className=" text-xs text-muted-foreground break-all">
                {carInfo?.carGeneration.name}
              </span>
            </div>

            <div className=" text-sm">
              Notes:{" "}
              <span className=" text-xs text-muted-foreground break-all">
                {carInfo?.carGeneration.notes}
              </span>
            </div>
          </div>
          {/* Generation Ends */}
        </div>
        {/* Car Information  ends*/}
        <div className=" space-y-5   ">
          <h2 className=" text-xl font-semibold">Actions</h2>

          <DeleteCar carId={car?.id.toString()} />
          <CarManagement useParams carToEdit={car} />
        </div>
        {/* Related */}
        {clientOtherCars.length ? (
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-semibold  text-xl">
                  Related cars:
                </AccordionTrigger>
                <AccordionContent>
                  <ul className=" grid  px-4  mt-10 gap-3">
                    {clientOtherCars.map((car, i) => (
                      <CarItem car={car} key={i} />
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : null}
        {/* Related */}
      </section>
    </main>
  );
};

export default Page;
