import SearchDialog from "@components/dashboard/home/search-dialog";
import ServiceTable from "@components/dashboard/home/service-table";
import PaginationControl from "@components/pagination-controls";
import { getAllCategoriesAction } from "@lib/actions/categoriesAction";
import { getServicesAction } from "@lib/actions/serviceActions";
import { getServiceStatusAction } from "@lib/actions/serviceStatusAction";
import { CarItem, ClientWithPhoneNumbers, User } from "@lib/types";

import React from "react";
interface Props {
  pageNumber: string;
  dateFrom: string;
  dateTo: string;
  clientId: string;
  carId: string;
  serviceStatusId: string;
  minPrice: string;
  maxPrice: string;
  cars: CarItem[];
  client: ClientWithPhoneNumbers;
  user: User;
}
const UserServices = async ({
  pageNumber,
  dateFrom,
  dateTo,
  clientId,
  carId,
  serviceStatusId,
  minPrice,
  maxPrice,
  cars,
  client,
  user,
}: Props) => {
  const [servicesData, statusData, categoriesData] = await Promise.all([
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
  ]);

  const { data: status, error: statusError } = statusData;
  const { data: categories, error: categoriesError } = categoriesData;
  const { data, error } = servicesData;
  const isAdmin = user.user_metadata.role === "Admin";
  return (
    <div className=" mt-10">
      <SearchDialog
        isAdmin={isAdmin}
        cars={cars}
        clients={[client]}
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
            isAdmin={isAdmin}
            cars={cars}
            clients={[client]}
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

export default UserServices;
