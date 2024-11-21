import React from "react";
import CarGenerationForm from "./car-generation-form";
import { getAllCarModelsAction } from "@lib/actions/carModelsActions";
import { getAllCarMakersAction } from "@lib/actions/carMakerActions";
import CarModelForm from "@components/car-model-form";

const CarGenAndModelManagement = async () => {
  const [carGenerations, carMakers] = await Promise.all([
    getAllCarModelsAction(),
    getAllCarMakersAction(),
    // getAllCarGenerationsAction(),
  ]);
  const { data: carGenerationsData, error: carGenerationsError } =
    carGenerations;
  //   const { data: carModelsData, error: carModelsError } = carModels;
  const { data: carMakersData, error: carMakersError } = carMakers;

  if (carGenerationsError || carMakersError)
    return <p>{carGenerationsError}</p>;

  return (
    <>
      <div className="flex  flex-col  gap-y-2 xs:flex-row xs:items-center justify-between rounded-lg border p-3 shadow-sm gap-x-7">
        <div className="space-y-0.5   ">
          <label className=" font-semibold">Car models</label>
          <p className=" text-muted-foreground text-sm">Add car models.</p>
        </div>
        <div className="  sm:pr-2">
          <CarModelForm carMakers={carMakersData} />
        </div>
      </div>

      <div className="flex  flex-col  gap-y-2 xs:flex-row xs:items-center justify-between rounded-lg border p-3 shadow-sm gap-x-7">
        <div className="space-y-0.5   ">
          <label className=" font-semibold">Car generation</label>
          <p className=" text-muted-foreground text-sm">
            Create a new car generation.
          </p>
        </div>
        <div className=" sm:pr-2">
          <CarGenerationForm
            carMakers={carMakersData}
            carModels={carGenerationsData}
          />
          {/* <CarInfoForm
          carGenerations={carGenerationsData}
          carMakers={carMakersData}
          carModels={carModelsData}
          /> */}
        </div>
      </div>
    </>
  );
};

export default CarGenAndModelManagement;
