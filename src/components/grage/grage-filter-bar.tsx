import { getAllCategoriesAction } from "@lib/actions/categoriesAction";
import { getAllProductBrandsAction } from "@lib/actions/productBrandsActions";
import { getAllProductTypesAction } from "@lib/actions/productTypeActions";
import React from "react";

import { getAllCarsInfoAction } from "@lib/actions/carInfoActions";
import { getClientsDataAction } from "@lib/actions/clientActions";
import GrageFilter from "./grage-fiter";
interface CarsListProps {
  color: string;
  plateNumber: string;
  chassisNumber: string;
  motorNumber: string;
  clientId: string;
  carInfoId: string;
  pageNumber: string;
}
const GrageFilterbar: React.FC<CarsListProps> = async ({ ...props }) => {
  const [carInfoData, clientsData] = await Promise.all([
    getAllCarsInfoAction(),
    getClientsDataAction(),
  ]);

  const { data: carInfo, error: categoriesError } = carInfoData;
  const { data: clients, error: productBrandsError } = clientsData;

  // if (categoriesError || brandTypesError || productBrandsError) return null;
  return (
    <aside className={`sm:w-[200px]  sm:p-2 sm:border-t sm:border-r `}>
      <GrageFilter
        clietns={clients || []}
        carInfos={carInfo || []}
        {...props}
      />
    </aside>
  );
};

export default GrageFilterbar;
