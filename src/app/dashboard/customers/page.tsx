import ClientManagement from "@components/dashboard/clients/client-management";
import ClientSearch from "@components/dashboard/clients/client-search";
import ClientsList from "@components/dashboard/clients/clients-list";
import ClientsPagination from "@components/dashboard/clients/clients-pagination";
import Spinner from "@components/Spinner";
import React, { Suspense } from "react";
interface SearchParams {
  page?: string;
  name?: string;
  phone?: string;
  email?: string;
}
const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  const pageNumber = searchParams?.page ?? "1";
  const name = searchParams.name ?? "";
  const phone = searchParams.phone ?? "";
  const email = searchParams.email ?? "";

  const key = pageNumber + name + phone + email;
  const pageKey = name + email + phone;
  return (
    <main>
      <h2 className="  font-semibold text-4xl">MANAGE CLIENTS.</h2>

      <section className=" sm:pl-4 mt-12">
        <ClientManagement />

        <div className=" max-w-[97%]  mx-auto mt-10  ">
          <ClientSearch
            currPage={pageNumber}
            name={name}
            phone={phone}
            email={email}
          />
          <Suspense
            fallback={<Spinner className=" h-[300px]" size={30} />}
            key={key}
          >
            <ClientsList
              pageNumber={pageNumber}
              name={name}
              email={email}
              phone={phone}
            />
          </Suspense>

          <Suspense
            key={pageKey}
            fallback={<Spinner className=" h-fit" size={15} />}
          >
            <ClientsPagination
              pageNumber={pageNumber}
              name={name}
              email={email}
              phone={phone}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default Page;
