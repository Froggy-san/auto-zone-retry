"use client";

import useInfiniteTicketHistory from "@lib/queries/tickets/useInfiniteTicketHistory";
import React, { useCallback, useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import TicketHistory from "./ticket-history";
import ErrorMessage from "@components/error-message";
import {
  Message,
  TicketHistory as TicketHistoryType,
  TicketPriority,
  TicketStatus,
} from "@lib/types";
import Spinner from "@components/Spinner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  selectedMessage?: Message | undefined;
  ticketStatuses: TicketStatus[];
  ticketPriorities: TicketPriority[];
}
const TicketHistoryList = ({
  ticketPriorities,
  ticketStatuses,
  selectedMessage,
}: Props) => {
  const {
    data,
    error,
    fetchNextPage,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
  } = useInfiniteTicketHistory({});
  // dashboard/tickets?ticket=41
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { ref, inView } = useInView({
    // 👈 This is the key setting to isolate the observer instance
    root: null,
    // You might also want to combine this with:
    triggerOnce: true,
    threshold: 0,
  });

  const handleViewDetails = useCallback(
    (ticketId: number, messageId?: number) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("ticket", String(ticketId));
      if (messageId) newSearchParams.set("messageId", `${messageId}`);
      router.push(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    },
    [router, searchParams, pathname]
  );

  useEffect(() => {
    if (!isFetchingNextPage && hasNextPage) fetchNextPage();
  }, [inView]);

  const ticketHistories: TicketHistoryType[] = useMemo(() => {
    return data ? data?.pages.flatMap((item) => item.items) : [];
  }, [data]);
  if (error) return <ErrorMessage>{`${error}`}</ErrorMessage>;

  return (
    <>
      <ul className=" grid items-start  grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-5">
        {ticketHistories.map((ticketHistory) => (
          <TicketHistory
            key={ticketHistory.id}
            selectedMessage={selectedMessage}
            handleViewDetails={handleViewDetails}
            ticketStatuses={ticketStatuses}
            ticketPriorities={ticketPriorities}
            ticketHistory={ticketHistory}
          />
        ))}
      </ul>

      <div ref={ref} className=" h-32">
        {isFetchingNextPage && <Spinner size={30} />}
      </div>
    </>
  );
};

export default React.memo(TicketHistoryList);
