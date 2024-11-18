import React from "react";

import {
  getClientsAction,
  getClientsDataAction,
} from "@lib/actions/clientActions";

import ServiceTable from "./service-table";
import { getServicesAction } from "@lib/actions/serviceActions";
import { getServiceStatusAction } from "@lib/actions/serviceStatusAction";
import { getAllCategoriesAction } from "@lib/actions/categoriesAction";
import { getCarsAction } from "@lib/actions/carsAction";
import SearchDialog from "./search-dialog";

interface Props {
  pageNumber: string;
  dateFrom: string;
  dateTo: string;
  clientId: string;
  carId: string;
  serviceStatusId: string;
  minPrice: string;
  maxPrice: string;
}
const ServiceList = async ({
  pageNumber,
  dateFrom,
  dateTo,
  clientId,
  carId,
  serviceStatusId,
  minPrice,
  maxPrice,
}: Props) => {
  
  const { data, error } = await getServicesAction({
    pageNumber,
    dateFrom,
    dateTo,
    clientId,
    carId,
    serviceStatusId,
    minPrice,
    maxPrice,
  });

  const [statusData, categoriesData, clientsData, carsData] = await Promise.all(
    [
      getServiceStatusAction(),
      getAllCategoriesAction(),
      getClientsDataAction(),
      getCarsAction({}),
    ]
  );
  const { data: status, error: statusError } = statusData;
  const { data: categories, error: categoriesError } = categoriesData;
  const { data: clients, error: clientsError } = clientsData;
  const { data: cars, error: carsError } = carsData;

  return (
    <div>
      <SearchDialog
        cars={cars}
        clients={clients || []}
        status={status}
        carId={carId}
        clientId={clientId}
        dateTo={dateTo}
        dateFrom={dateFrom}
        serviceStatusId={serviceStatusId}
        maxPrice={maxPrice}
        minPrice={minPrice}
        currPage={pageNumber}
      />
      {!error ? (
        <ServiceTable
          cars={cars}
          clients={clients || []}
          categories={categories}
          currPage={pageNumber}
          services={data || []}
          status={status}
        />
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
};

export default ServiceList;
