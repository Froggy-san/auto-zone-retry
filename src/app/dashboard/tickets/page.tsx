import InventoryList from "@components/dashboard/inventory/inventory-list";
import InventoryManagement from "@components/dashboard/inventory/inventory-management";
import InventoryPagination from "@components/dashboard/inventory/inventory-pagination";

import SearchDialog from "@components/dashboard/inventory/search-dialong";
import StatusForm from "@components/dashboard/tickets/status-form";
import Statuses from "@components/dashboard/tickets/statuses";

import Spinner from "@components/Spinner";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tickets",
};

const Page = () => {
  return (
    <main className=" relative">
      <h2 className="  font-semibold text-4xl">TICKETS.</h2>
      <section className=" mt-12 sm:pl-4 pb-24">
        <div className="flex  flex-col  gap-y-2 xs:flex-row xs:items-center justify-between rounded-lg border p-3 shadow-sm gap-x-7">
          <div className="space-y-0.5   ">
            <label className=" font-semibold">Ticket statuses</label>
            <p className=" text-muted-foreground text-sm">
              Create new ticket statuses.
            </p>
          </div>
          <div className=" sm:pr-2">
            <StatusForm />
          </div>
        </div>

        <Suspense fallback={<Spinner size={25} className=" h-fit my-10" />}>
          <Statuses />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
