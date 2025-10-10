import ErrorMessage from "@components/error-message";
import { getTicketStatusesAction } from "@lib/actions/ticketActions";
import React from "react";
import TicketStatus from "./ticket-status";
import { createClient } from "@utils/supabase/server";

const Statuses = async () => {
  const supabase = await createClient();
  const { ticketStatus, error } = await getTicketStatusesAction(supabase);

  if (error) return <ErrorMessage>{error.message}</ErrorMessage>;
  return (
    <ul className=" flex  gap-2  my-10 flex-wrap">
      {ticketStatus?.length ? (
        ticketStatus.map((ticket) => (
          <TicketStatus key={ticket.id} ticketStatus={ticket} />
        ))
      ) : (
        <p className=" text-2xl my-20 w-full text-center font-semibold text-muted-foreground">
          No ticket status were posted.
        </p>
      )}
    </ul>
  );
};

export default Statuses;
