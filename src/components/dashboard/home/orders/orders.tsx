"use client";
import Spinner from "@components/Spinner";
import useInfiniteOrders from "@lib/queries/useInfiniteOrders";
import { Order as OrderType } from "@lib/types";
import { cn } from "@lib/utils";
import { formatDate } from "date-fns";
import React, { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

const Orders = () => {
  const { ref, inView } = useInView();
  const {
    isFetching,
    isFetchingNextPage,
    data,
    error,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteOrders({});

  const orders: OrderType[] = useMemo(() => {
    return data ? data.pages.flatMap((item) => item.items) : [];
  }, [data?.pages]);
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, isFetchingNextPage]);
  return (
    <ul className=" max-h-[70vh] space-y-6  overflow-y-auto">
      {orders.map((order, index) => (
        <Order key={order.id} order={order} />
      ))}

      <div ref={ref}>
        {isFetchingNextPage ? (
          <Spinner size={20} className="static " />
        ) : hasNextPage ? null : (
          <span className=" text-muted-foreground text-xs">
            You have reached the end.
          </span>
        )}
      </div>
    </ul>
  );
};

export default Orders;

interface OrderProps {
  order: OrderType;
  className?: string;
}
const Order = React.forwardRef<HTMLLIElement, OrderProps>(
  ({ order, className, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn(
          " flex items-center gap-3 px-3 py-1.5 text-sm",
          className
        )}
        {...props}
      >
        <span>{order.id}</span>{" "}
        <span>{formatDate(new Date(order.created_at), "MMM d, yyyy")}</span>
      </li>
    );
  }
);
