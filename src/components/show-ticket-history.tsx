import { cn } from "@lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, History } from "lucide-react";
import { Button } from "./ui/button";
import {
  Message,
  Ticket,
  TicketHistory as TicketHistoryType,
  TicketPriority,
  TicketStatus,
} from "@lib/types";
import useInfiniteTicketHistory from "@lib/queries/tickets/useInfiniteTicketHistory";
import { useInView } from "react-intersection-observer";
import ErrorMessage from "./error-message";
import TicketHistory from "./dashboard/tickets/ticket-history";
import { GiTumbleweed } from "react-icons/gi";
import Spinner from "./Spinner";
import { TbMoodEmptyFilled } from "react-icons/tb";
import { useScrollFade } from "@hooks/use-scroll-fade";
interface Props {
  isOpen: boolean;
  ticket: Ticket;
  ticketStatuses: TicketStatus[];
  ticketPriorities: TicketPriority[];
  internalActivity?: boolean;
  className?: string;
  selectedMessage: Message | undefined;
  setIsOpen: () => void;
  handleViewDetails: (ticketId: number, messageId?: number | undefined) => void;
  handleFocusMessage: (messageId: number | null) => void;
  handleSelectMessage: (id: number | null) => void;
}
const ShowTicketHistory = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      className,
      ticket,
      ticketPriorities,
      ticketStatuses,
      isOpen,
      setIsOpen,
      selectedMessage,
      internalActivity,
      handleFocusMessage,
      handleViewDetails,
      handleSelectMessage,
    }: Props,
    ref
  ) => {
    const {
      data,
      isFetching,
      fetchNextPage,
      isFetchingNextPage,
      hasNextPage,
      error,
    } = useInfiniteTicketHistory({ ticketId: ticket.id });

    const { ref: inViewElement, inView } = useInView();

    const internalRef = useRef<HTMLDivElement>(null);

    const sliderRef = ref ?? internalRef;

    const ticketHistoryById: TicketHistoryType[] = useMemo(() => {
      return data ? data.pages.flatMap((page) => page.items) : [];
    }, [data?.pages]);

    useEffect(() => {
      if (!isFetchingNextPage && hasNextPage && inView) fetchNextPage();
    }, [inView, hasNextPage]);

    if (error) return <ErrorMessage>{`${error}`}</ErrorMessage>;

    return (
      <motion.div
        ref={sliderRef}
        className={cn(
          " w-0     sticky  transition-all  ease-in   rounded-l-3xl  border-l border-y shadow-lg top-1      h-[99vh] ",
          { " w-[400px]": isOpen },
          className
        )}
      >
        <div className=" w-full  relative h-full  ">
          <Button
            onClick={setIsOpen}
            variant="secondary"
            className="  absolute top-1/2 bottom-1/2  border z-50  p-0 -left-8  w-7 h-7 rounded-full"
          >
            <ArrowLeft
              className={cn(" w-4 h-4 transition-all  ease-in duration-300", {
                " rotate-180": isOpen,
              })}
            />
          </Button>
          {isOpen && (
            <div
              className={cn(
                " h-full overflow-y-auto px-4 py-6 space-y-6 show-hide-scrollbar"
              )}
            >
              {ticketHistoryById.length ? (
                <ul className="   space-y-4">
                  {ticketHistoryById.map((history) => (
                    <TicketHistory
                      key={history.id}
                      internalActivity={internalActivity}
                      selectedMessage={selectedMessage}
                      handleFocusMessage={handleFocusMessage}
                      handleSelectMessage={handleSelectMessage}
                      handleViewDetails={handleViewDetails}
                      ticketHistory={history}
                      ticketStatuses={ticketStatuses}
                      ticketPriorities={ticketPriorities}
                    />
                  ))}
                </ul>
              ) : (
                <motion.div className=" text-xs my-auto w-full text-center text-muted-foreground flex flex-col justify-center items-center gap-2">
                  <p className="  text-sm sm:text-lg">No history found.</p>
                  <History className="  w-5 h-5   sm:w-9 sm:h-9" />
                </motion.div>
              )}

              <div
                ref={inViewElement}
                className=" flex items-center justify-center"
              >
                {isFetching && <Spinner className="  h-5 w-5 static" />}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);
export default ShowTicketHistory;

ShowTicketHistory.displayName = "ShowTicketHistory";
