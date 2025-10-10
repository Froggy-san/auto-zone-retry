import { Badge } from "@components/ui/badge";
import { TicketStatus as TicketStatusType } from "@lib/types";
import React from "react";

const TicketStatus = ({ ticketStatus }: { ticketStatus: TicketStatusType }) => {
  return (
    <li>
      <Badge>{ticketStatus.name}</Badge>
    </li>
  );
};

export default TicketStatus;
