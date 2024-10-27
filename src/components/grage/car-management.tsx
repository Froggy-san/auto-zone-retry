import { getAllCarsInfoAction } from "@lib/actions/carInfoActions";
import { getClientsDataAction } from "@lib/actions/clientActions";
import React from "react";
import CarForm from "./car-form";
import { CarItem } from "@lib/types";

const CarManagement = async ({
  carToEdit,
  useParams,
}: {
  useParams?: boolean;
  carToEdit?: CarItem;
}) => {
  const [carInfos, clients] = await Promise.all([
    getAllCarsInfoAction(),
    getClientsDataAction(),
  ]);

  const { data: clientsData, error: clientsDataError } = clients;
  const { data: carInfosData, error: carInfosError } = carInfos;

  if (clientsDataError || carInfosError)
    return <p>{clientsDataError || carInfosError}</p>;
  return (
    <div className="flex  flex-col  gap-y-2 xs:flex-row xs:items-center justify-between rounded-lg border p-3 shadow-sm gap-x-7">
      <div className="space-y-0.5   ">
        <label className=" font-semibold">Cars</label>
        <p className=" text-muted-foreground text-sm">
          {carToEdit ? "Edit car" : "Create a new car."}
        </p>
      </div>
      <div className=" sm:pr-2">
        <CarForm
          useParams={useParams}
          carToEdit={carToEdit}
          clients={clientsData || []}
          carinfos={carInfosData}
        />
      </div>
    </div>
  );
};

export default CarManagement;
