import { Badge } from "@components/ui/badge";
import { cn } from "@lib/utils";
import React from "react";

type Status =
  | "Pending"
  | "InProgress"
  | "Done"
  | "Canceled"
  | string
  | undefined;
const StatusBadge = ({
  className,
  status,
}: {
  className?: string;
  status: Status;
}) => {
  if (status === "Pending")
    return (
      <div
        className={cn(
          "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap bg-dashboard-orange text-dashboard-text-orange text-center rounded-lg",
          className
        )}
      >
        Pending
      </div>
    );
  if (status === "InProgress")
    return (
      <div
        className={cn(
          "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap bg-dashboard-blue text-dashboard-text-blue text-center rounded-lg",
          className
        )}
      >
        In Progress
      </div>
    );
  if (status === "Canceled")
    return (
      <div
        className={cn(
          "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap  text-red-800  dark:text-red-200  bg-destructive/70 text-center rounded-lg",
          className
        )}
      >
        Canceled
      </div>
    );
  if (status === "Done")
    return (
      <div
        className={cn(
          "text-xs select-none w-fit font-semibold  px-2 py-1  whitespace-nowrap bg-dashboard-green text-dashboard-text-green text-center rounded-lg",
          className
        )}
      >
        Done
      </div>
    );
  return <Badge>{status || ""}</Badge>;
};

export default StatusBadge;
