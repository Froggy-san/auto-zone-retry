import ClientManagement from "@components/dashboard/client-management";
import ClientsList from "@components/dashboard/clients-list";
import Spinner from "@components/Spinner";
import React, { Suspense } from "react";
interface SearchParams {
  // Add the properties you expect in searchParam
  query: string;

  page?: string;
  name?: string;
  categoryId?: string;
  productTypeId?: string;
  productBrandId?: string;
  isAvailable?: string;
}
const Page = ({ searchParams }: { searchParams: SearchParams }) => {
  const pageNumber = searchParams?.page ?? "1";
  return (
    <main>
      <h2 className="  font-semibold text-4xl">MANAGE CLIENTS.</h2>

      <section className=" pl-4 mt-12">
        <ClientManagement />
        <Suspense fallback={<Spinner className=" h-[300px]" size={30} />}>
          <ClientsList pageNumber={pageNumber} />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
