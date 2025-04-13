import React from "react";

import { getClientsAction } from "@lib/actions/clientActions";

import ServiceTable from "./service-table";
import { getServicesAction } from "@lib/actions/serviceActions";
import { getServiceStatusAction } from "@lib/actions/serviceStatusAction";
import { getAllCategoriesAction } from "@lib/actions/categoriesAction";
import { getCarsAction } from "@lib/actions/carsAction";
import SearchDialog from "./search-dialog";
import { createClient } from "@utils/supabase/server";
import PaginationControl from "@components/pagination-controls";

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
  const supabase = await createClient();
  // const { data, error } = await getServicesAction({
  //   pageNumber,
  //   dateFrom,
  //   dateTo,
  //   clientId,
  //   carId,
  //   serviceStatusId,
  //   minPrice,
  //   maxPrice,
  // });

  const [servicesData, statusData, categoriesData, clientsData, carsData] =
    await Promise.all([
      getServicesAction({
        pageNumber,
        dateFrom,
        dateTo,
        clientId,
        carId,
        serviceStatusId,
        minPrice,
        maxPrice,
      }),
      getServiceStatusAction(),
      getAllCategoriesAction(),
      getClientsAction({}),
      getCarsAction({ supabase }),
    ]);
  const { data: status, error: statusError } = statusData;
  const { data: categories, error: categoriesError } = categoriesData;
  const { data: clients, error: clientsError } = clientsData;
  const { data: cars, error: carsError } = carsData;
  const { data, error } = servicesData;

  return (
    <div className=" mt-10">
      <SearchDialog
        cars={cars?.cars || []}
        clients={clients?.clients || []}
        status={status || []}
        carId={carId}
        clientId={clientId}
        dateTo={dateTo}
        dateFrom={dateFrom}
        serviceStatusId={serviceStatusId}
        maxPrice={maxPrice}
        minPrice={minPrice}
        currPage={pageNumber}
      />
      {!servicesData.error ? (
        <>
          <ServiceTable
            cars={cars?.cars || []}
            clients={clients?.clients || []}
            categories={categories || []}
            currPage={pageNumber}
            services={data?.data || []}
            status={status || []}
          />
          <PaginationControl
            count={data ? Number(data.count) : 0}
            currPage={pageNumber}
          />
        </>
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
};

export default ServiceList;
