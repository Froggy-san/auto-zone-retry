import CategoryManagement from "@components/dashboard/tickets/category-management";
import StatusForm from "@components/dashboard/tickets/status-form";
import Statuses from "@components/dashboard/tickets/statuses";
import TicketCategoryForm from "@components/dashboard/tickets/ticket-category-form";
import TicketForm from "@components/dashboard/tickets/ticket-form";
import TicketHistoryList from "@components/dashboard/tickets/ticket-history-list";
import PrioManagement from "@components/dashboard/tickets/ticket-prio-management";
import TicketPriorityForm from "@components/dashboard/tickets/ticket-priority-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Spinner from "@components/Spinner";
import Tickets from "@components/tickets";
import { getTicketCategoriesAction } from "@lib/actions/ticket-category-action";
import { getTickettPrioritiesAction } from "@lib/actions/ticket-priority-action";
import { getTicketStatusesAction } from "@lib/actions/ticket-status-actions";
import { createClient } from "@utils/supabase/server";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Tickets",
};
interface SearchParams {
  page?: string;
  dateTo?: string;
  dateFrom?: string;
  name?: string;
  ticketStatusId?: string;
  sort?: "asc" | "desc" | string;
}
const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const dateTo = searchParams.dateTo ?? "";
  const dateFrom = searchParams.dateFrom ?? "";
  const ticketStatusId = searchParams.ticketStatusId ?? "";
  const sort = searchParams.sort ?? "";
  const name = searchParams.name ?? "";
  const supabase = await createClient(false, false);
  const [categoriesData, statusData, prioritiesData] = await Promise.all([
    getTicketCategoriesAction(supabase),
    getTicketStatusesAction(supabase),
    getTickettPrioritiesAction(supabase),
  ]);

  const { ticketCategories, error } = categoriesData;
  const { ticketStatus, error: statusError } = statusData;
  const { ticketPriorities, error: prioritiesError } = prioritiesData;

  const key = `${
    searchParams.page || ""
  }-${dateFrom}-${dateTo}-${ticketStatusId}-${name}`;
  return (
    <main className=" relative">
      <h2 className="  font-semibold text-4xl">TICKETS.</h2>
      <section className=" mt-12 sm:pl-4 pb-24   space-y-52">
        <div className="  space-y-4">
          <div>
            <div className="flex  flex-col  gap-y-2 xs:flex-row xs:items-center justify-between rounded-lg border p-3 shadow-sm gap-x-7">
              <div className="space-y-0.5   ">
                <label className=" font-semibold">Ticket a ticket</label>
                <p className=" text-muted-foreground text-sm">
                  Create new ticket.
                </p>
              </div>

              <div className=" sm:pr-2">
                <TicketForm
                  ticketCategories={ticketCategories || []}
                  ticketStatus={ticketStatus || []}
                  ticketPriorities={ticketPriorities || []}
                />
              </div>
            </div>
          </div>

          <Suspense
            key={key}
            fallback={<Spinner size={25} className=" h-fit my-10" />}
          >
            <Tickets
              dateFrom={dateFrom}
              dateTo={dateTo}
              name={name}
              ticketStatusId={ticketStatusId}
              page={searchParams.page}
              sort={sort}
              ticketCategories={ticketCategories || []}
              ticketPriorities={ticketPriorities || []}
              ticketStatuses={ticketStatus || []}
            />
          </Suspense>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className=" bg-accent hover:bg-accent/80 mb-9 px-4 rounded-xl">
              Ticket Actions
            </AccordionTrigger>
            <AccordionContent className=" space-y-32 bg-accent/40 mb-5 p-8 rounded-xl">
              <div>
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

                <Suspense
                  fallback={<Spinner size={25} className=" h-fit my-10" />}
                >
                  <Statuses />
                </Suspense>
              </div>

              <div>
                <div className="flex  flex-col  gap-y-2 xs:flex-row xs:items-center justify-between rounded-lg border p-3 shadow-sm gap-x-7">
                  <div className="space-y-0.5   ">
                    <label className=" font-semibold">Ticket statuses</label>
                    <p className=" text-muted-foreground text-sm">
                      Create new ticket category.
                    </p>
                  </div>
                  <div className=" sm:pr-2">
                    <TicketCategoryForm />
                  </div>
                </div>

                <Suspense
                  fallback={<Spinner size={25} className=" h-fit my-10" />}
                >
                  <CategoryManagement />
                </Suspense>
              </div>

              <div>
                <div className="flex  flex-col  gap-y-2 xs:flex-row xs:items-center justify-between rounded-lg border p-3 shadow-sm gap-x-7">
                  <div className="space-y-0.5   ">
                    <label className=" font-semibold">Ticket statuses</label>
                    <p className=" text-muted-foreground text-sm">
                      Create new ticket category.
                    </p>
                  </div>
                  <div className=" sm:pr-2">
                    <TicketPriorityForm />
                  </div>
                </div>

                <Suspense
                  fallback={<Spinner size={25} className=" h-fit my-10" />}
                >
                  <PrioManagement />
                </Suspense>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <section className="   space-y-12  pb-32">
          <TicketHistoryList
            ticketCategory={ticketCategories || []}
            ticketPriorities={ticketPriorities || []}
            ticketStatuses={ticketStatus || []}
          />
        </section>
      </section>
    </main>
  );
};

export default Page;
