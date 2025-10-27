import TicketForm from "@components/dashboard/tickets/ticket-form";
import Footer from "@components/home/footer";
import Spinner from "@components/Spinner";
import UserTickets from "@components/user/complaints/user-tickets";
import { getCurrentUser } from "@lib/actions/authActions";
import { getTicketCategoriesAction } from "@lib/actions/ticket-category-action";
import { getTickettPrioritiesAction } from "@lib/actions/ticket-priority-action";
import { getTicketStatusesAction } from "@lib/actions/ticket-status-actions";
import { createClient } from "@utils/supabase/server";
import { Metadata } from "next";
import React, { Suspense } from "react";
export const metadata: Metadata = {
  title: "Your Tickets",
};
interface SearchParams {
  page?: string;
  dateTo?: string;
  dateFrom?: string;
  name?: string;
  ticketStatusId?: string;
  sort?: "asc" | "desc" | string;
}

interface Params {
  userId: string;
}
const Page = async ({
  searchParams,
  params,
}: {
  searchParams: SearchParams;
  params: Params;
}) => {
  const pageNumber = searchParams.page ?? "1";
  const ticketStatusId = searchParams.ticketStatusId ?? "";
  const { userId } = params;
  const supabase = await createClient();

  const [categoriesData, statusData, prioritiesData, currUserData] =
    await Promise.all([
      getTicketCategoriesAction(supabase),
      getTicketStatusesAction(supabase),
      getTickettPrioritiesAction(supabase),
      getCurrentUser(),
    ]);
  const user = currUserData;

  const { ticketCategories, error } = categoriesData;
  const { ticketStatus, error: statusError } = statusData;
  const { ticketPriorities, error: prioritiesError } = prioritiesData;

  const key = `${pageNumber}-${ticketStatusId}`;
  return (
    <main className=" relative">
      <h2 className="  font-semibold text-4xl">YOUR COMPLAINTS.</h2>
      <section className=" sm:pl-4 pb-10">
        <div className="flex  flex-col  gap-y-2 xs:flex-row xs:items-center justify-between rounded-lg border p-3 shadow-sm gap-x-7 mt-6">
          <div className="space-y-0.5   ">
            <label className=" font-semibold">Ticket a ticket</label>
            <p className=" text-muted-foreground text-sm">Create new ticket.</p>
          </div>
          <div className=" sm:pr-2">
            <TicketForm
              ticketCategories={ticketCategories || []}
              ticketStatus={ticketStatus || []}
              ticketPriorities={ticketPriorities || []}
            />
          </div>
        </div>
        <Suspense
          key={key}
          fallback={<Spinner size={25} className=" h-fit my-10" />}
        >
          <UserTickets
            supabase={supabase}
            pageNumber={pageNumber}
            userId={userId}
            currUser={user}
            ticketStatusId={ticketStatusId}
            ticketCategories={ticketCategories || []}
            ticketPriorities={ticketPriorities || []}
            ticketStatuses={ticketStatus || []}
          />
        </Suspense>
      </section>
      <Footer className=" mt-36" />
    </main>
  );
};

export default Page;
