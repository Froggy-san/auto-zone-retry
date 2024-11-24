import { getAllCategoriesAction } from "@lib/actions/categoriesAction";
import { getAllProductBrandsAction } from "@lib/actions/productBrandsActions";
import { getAllProductTypesAction } from "@lib/actions/productTypeActions";
import React from "react";

import { getAllCarsInfoAction } from "@lib/actions/carInfoActions";
import { getClientsDataAction } from "@lib/actions/clientActions";
import GrageFilter from "./grage-fiter";
import { CarGenerationProps, ClientWithPhoneNumbers } from "@lib/types";
interface CarsListProps {
  color: string;
  plateNumber: string;
  chassisNumber: string;
  motorNumber: string;
  clientId: string;
  carGenerationId: string;
  carGenerations: CarGenerationProps[] | null;
  clients: ClientWithPhoneNumbers[] | null;
  pageNumber: string;
}
const GrageFilterbar: React.FC<CarsListProps> = async ({
  clients,
  carGenerations,
  ...props
}) => {
  // const [carInfoData, clientsData] = await Promise.all([
  //   getAllCarsInfoAction(),
  //   getClientsDataAction(),
  // ]);

  // const { data: carInfo, error: categoriesError } = carInfoData;
  // const { data: clients, error: productBrandsError } = clientsData;

  // if (categoriesError || brandTypesError || productBrandsError) return null;
  return (
    <aside className={`sm:w-[200px]  sm:p-2 sm:border-t sm:border-r `}>
      <GrageFilter
        clietns={clients || []}
        carGeneration={carGenerations || []}
        {...props}
      />
    </aside>
  );
};

export default GrageFilterbar;
