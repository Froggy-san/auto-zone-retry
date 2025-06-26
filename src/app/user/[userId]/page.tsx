// app/user/[userId]/page.tsx
import ErrorMessage from "@components/error-message";
import Spinner from "@components/Spinner";
import UserServices from "@components/user/activity/user-services";
import { getUserById } from "@lib/actions/authActions";
import { getClientByIdAction } from "@lib/actions/clientActions";
import { ClientById, ClientWithPhoneNumbers } from "@lib/types";
import { Metadata } from "next";
import React, { Suspense } from "react";

// 1. Update the Props interface to expect a 'params' object
export const metadata: Metadata = {
  title: "Home",
};

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
interface Props {
  searchParams: SearchParams;
  params: {
    userId: string;
  };
}

// 2. Destructure 'params' from the props
const Page = async ({ params, searchParams }: Props) => {
  // 3. (Optional but good practice) Extract userId from params
  const pageNumber = searchParams?.page ?? "1";
  const dateTo = searchParams.dateTo ?? "";
  const dateFrom = searchParams.dateFrom ?? "";
  // const clientId = searchParams.clientId ?? "";
  const carId = searchParams.carId ?? "";
  const minPrice = searchParams.minPrice ?? "";
  const maxPrice = searchParams.maxPrice ?? "";
  const editFee = searchParams.editFee ?? "";
  const serviceStatusId = searchParams.serviceStatusId ?? "";
  const key = pageNumber + dateFrom + dateTo + carId + minPrice + maxPrice;
  const { userId } = params;
  const { data, error } = await getUserById(userId);

  let client: ClientById | null = null;
  let clientError = "";
  if (data?.user) {
    const { data: ClientsData, error } = await getClientByIdAction(
      data.user.id,
      "user_id"
    );

    client = ClientsData;
    if (error) clientError = error;
  }

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

  console.log(clientId, "CLIENT ID");

  return (
    <main className=" relative">
      <h2 className="   font-semibold text-4xl">YOUR ACTIVITIES.</h2>

      <section className=" sm:pl-4">
        {error || clientError ? (
          <ErrorMessage>
            {" "}
            <>{error || clientError || "Something went wrong"}</>{" "}
          </ErrorMessage>
        ) : (
          <>
            {client ? (
              <Suspense
                fallback={<Spinner size={30} className=" mt-10" key={key} />}
              >
                <UserServices
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
            ) : null}
          </>
        )}
      </section>
    </main>
  );
};

export default Page;
