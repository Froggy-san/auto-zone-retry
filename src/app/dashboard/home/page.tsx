import EditFeesManagement from "@components/dashboard/home/edit-fees-management";
import ServiceList from "@components/dashboard/home/service-list";
import ServicePagination from "@components/dashboard/home/service-pagination";
import Spinner from "@components/Spinner";
import React, { Suspense } from "react";
interface SearchParams {
  page?: string;
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  carId?: string;
  minPrice?: string;
  serviceStatusId?: string;
  maxPrice?: string;
  editFee?: string;
}
const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  const pageNumber = searchParams?.page ?? "1";
  const dateTo = searchParams.dateTo ?? "";
  const dateFrom = searchParams.dateFrom ?? "";
  const clientId = searchParams.clientId ?? "";
  const carId = searchParams.carId ?? "";
  const minPrice = searchParams.minPrice ?? "";
  const maxPrice = searchParams.maxPrice ?? "";
  const editFee = searchParams.editFee ?? "";
  const serviceStatusId = searchParams.serviceStatusId ?? "";

  console.log(dateFrom, "AYOOOOO FROM HERE");
  console.log(
    dateTo,
    "AYYYYYYYYYYYYYYYYYYYYYOOOOOOOOOOOOOOOOOOOOOOOOO TO HEREEEE"
  );

  const key =
    pageNumber + dateFrom + dateTo + clientId + carId + minPrice + maxPrice;
  const pageKey = dateFrom + dateTo + clientId + carId + minPrice + maxPrice;
  return (
    <main className=" relative">
      <h2 className="  font-semibold text-4xl">INVENTORY MANAGEMENT.</h2>
      <section className=" sm:pl-4">
        {/* <SearchDialog
          currPage={pageNumber}
          shopName={shopName}
          dateOfOrderFrom={dateOfOrderFrom}
          dateOfOrderTo={dateOfOrderTo}
          minTotalPrice={minTotalPrice}
          maxTotalPrice={maxTotalPrice}
        /> */}

        <Suspense fallback={<Spinner size={30} className=" mt-10" />}>
          <EditFeesManagement feesId={editFee} />
        </Suspense>

        <Suspense fallback={<Spinner size={30} className=" mt-10" key={key} />}>
          <ServiceList
            serviceStatusId={serviceStatusId}
            pageNumber={pageNumber}
            dateTo={dateTo}
            dateFrom={dateFrom}
            clientId={clientId}
            carId={carId}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </Suspense>

        <Suspense
          key={pageKey}
          fallback={<Spinner className=" h-fit" size={15} />}
        >
          <ServicePagination
            pageNumber={pageNumber}
            dateTo={dateTo}
            dateFrom={dateFrom}
            clientId={clientId}
            carId={carId}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
