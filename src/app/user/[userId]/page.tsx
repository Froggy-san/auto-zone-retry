// app/user/[userId]/page.tsx
import EditFeesManagement from "@components/dashboard/home/edit-fees-management";
import ProductSoldManagement from "@components/dashboard/home/product-sold-management";
import ErrorMessage from "@components/error-message";
import Footer from "@components/home/footer";
import Spinner from "@components/Spinner";
import CarCarousel from "@components/user/activity/car-carousel";
import UserServices from "@components/user/activity/user-services";
import { getUserById } from "@lib/actions/authActions";
import { getClientByIdAction } from "@lib/actions/clientActions";
import { ClientById, ClientWithPhoneNumbers } from "@lib/types";
import { Car } from "lucide-react";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { PiEmpty } from "react-icons/pi";

// 1. Update the Props interface to expect a 'params' object
export const metadata: Metadata = {
  title: "Home",
};

interface SearchParams {
  page?: string;
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  serviceStatusId?: string;
  carId?: string;
  minPrice?: string;
  maxPrice?: string;
  editFee?: string;
  addFeeId?: string;
  editSold?: string;
  addSoldId?: string;
}
interface Props {
  searchParams: SearchParams;
  params: {
    userId: string;
  };
}

const Page = async ({ params, searchParams }: Props) => {
  const pageNumber = searchParams?.page ?? "1";
  const dateTo = searchParams.dateTo ?? "";
  const dateFrom = searchParams.dateFrom ?? "";
  // const clientId = searchParams.clientId ?? "";
  const carId = searchParams.carId ?? "";
  const minPrice = searchParams.minPrice ?? "";
  const maxPrice = searchParams.maxPrice ?? "";
  const serviceStatusId = searchParams.serviceStatusId ?? "";
  const editFee = searchParams.editFee ?? "";
  const addFeeId = searchParams.addFeeId ?? "";
  const editSold = searchParams.editSold ?? "";
  const addSoldId = searchParams.addSoldId ?? "";

  const key = pageNumber + dateFrom + dateTo + carId + minPrice + maxPrice;
  const { userId } = params;
  const { data, error } = await getUserById(userId);

  let client: ClientById | null = null;
  let clientError = "";
  if (data?.user) {
    const { data: ClientsData, error } = await getClientByIdAction(
      data.user.id,
      "user_id",
    );

    client = ClientsData;
    if (error) clientError = error;
  }
  const user = data?.user;

  const clientCars = client ? client.cars : [];
  const clientId = client?.id;
  const clientDetails = client
    ? {
        id: client.id,
        email: client.email,
        name: client.name,
        phones: client.phones,
      }
    : null;
  const isAdmin = user?.user_metadata.role;

  return (
    <main className=" relative">
      <h2 className="   font-semibold text-4xl">YOUR ACTIVITIES.</h2>

      <section className=" sm:pl-4 pb-10 space-y-24">
        {error || clientError ? (
          <ErrorMessage>
            {" "}
            <>{error || clientError || "Something went wrong"}</>{" "}
          </ErrorMessage>
        ) : client && user ? (
          <>
            <Suspense
              fallback={
                <Spinner
                  size={30}
                  className=" mt-10"
                  key={editFee + addFeeId}
                />
              }
            >
              <EditFeesManagement feesId={editFee} addFeeId={addFeeId} />
            </Suspense>

            <Suspense
              fallback={
                <Spinner
                  size={30}
                  className=" mt-10"
                  key={editSold + addSoldId}
                />
              }
            >
              <ProductSoldManagement
                editSold={editSold}
                addSoldId={addSoldId}
              />
            </Suspense>

            {clientDetails ? (
              clientCars.length ? (
                <CarCarousel
                  clientDetails={clientDetails}
                  isAdmin={isAdmin === "Admin"}
                  cars={clientCars}
                />
              ) : (
                <p className=" sm:text-xl flex flex-col text-muted-foreground justify-center items-center gap-3">
                  <Car className=" w-[50px] h-[50px]" />
                  <span>No cars found.</span>
                </p>
              )
            ) : (
              <p className=" sm:text-xl flex flex-col text-muted-foreground justify-center items-center gap-3">
                <PiEmpty className=" w-[50px] h-[50px]" />
                <span>Something went wrong.</span>
              </p>
            )}

            <Suspense
              fallback={<Spinner size={30} className=" mt-10" key={key} />}
            >
              <UserServices
                user={user}
                serviceStatusId={serviceStatusId}
                pageNumber={pageNumber}
                dateTo={dateTo}
                dateFrom={dateFrom}
                clientId={String(clientId)}
                carId={carId}
                minPrice={minPrice}
                maxPrice={maxPrice}
                cars={clientCars}
                client={clientDetails as ClientWithPhoneNumbers}
              />
            </Suspense>
          </>
        ) : (
          <ErrorMessage>
            Someting went wrong, please make sure you are logged in.
          </ErrorMessage>
        )}
      </section>

      <Footer className=" mt-44" />
    </main>
  );
};

export default Page;
