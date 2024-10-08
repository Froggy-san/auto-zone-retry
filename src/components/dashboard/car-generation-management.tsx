import React from "react";
import CarGenerationForm from "./car-generation-form";
import { getAllCarModelsAction } from "@lib/actions/carModelsActions";


const CarGenerationManagement = async () => {
  const { data, error } = await getAllCarModelsAction();
  //   const [carGenerations, carModels, carMakers] = await Promise.all([
  //     getAllCarModelsAction(),
  //     getAllCarMakersAction(),
  //     getAllCarGenerationsAction(),
  //   ]);
  //   const { data: carGenerationsData, error: carGenerationsError } =
  //     carGenerations;
  //   const { data: carModelsData, error: carModelsError } = carModels;
  //   const { data: carMakersData, error: carMakersError } = carMakers;

  if (error) return <p>{error}</p>;

  return (
    <div className="flex  flex-col  gap-y-2 xs:flex-row xs:items-center justify-between rounded-lg border p-3 shadow-sm gap-x-7">
      <div className="space-y-0.5   ">
        <label className=" font-semibold">Car generation</label>
        <p className=" text-muted-foreground text-sm">
          Create a new car generation.
        </p>
      </div>
      <div className=" flex items-center  gap-3">
        <CarGenerationForm carModels={data} />
        {/* <CarInfoForm
          carGenerations={carGenerationsData}
          carMakers={carMakersData}
          carModels={carModelsData}
        /> */}
      </div>
    </div>
  );
};

export default CarGenerationManagement;
