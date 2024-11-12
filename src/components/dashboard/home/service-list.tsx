import React from "react";

import { getClientsAction } from "@lib/actions/clientActions";

import { getProductsBoughtAction } from "@lib/actions/productBoughtActions";
import { getRestockingBillsAction } from "@lib/actions/restockingBillActions";
import ServiceTable from "./service-table";
import { getServicesAction } from "@lib/actions/serviceActions";

interface Props {
  pageNumber: string;
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  carId?: string;
  minPrice?: string;
  maxPrice?: string;
}
const ServiceList = async ({
  pageNumber,
  dateFrom,
  dateTo,
  clientId,
  carId,
  minPrice,
  maxPrice,
}: Props) => {
  const { data, error } = await getServicesAction({
    pageNumber,
    dateFrom,
    dateTo,
    clientId,
    carId,
    minPrice,
    maxPrice,
  });

  if (error) return <p>{error}</p>;

  return (
    <div>
      <ServiceTable currPage={pageNumber} services={data || []} />
    </div>
  );
};

export default ServiceList;
