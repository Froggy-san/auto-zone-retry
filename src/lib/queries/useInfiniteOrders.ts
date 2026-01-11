import { getInfiniteOrders } from "@lib/services/orders";
import { OrderStatus, PaymentMethod } from "@lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { z } from "zod";

interface GetInfiniteOrdersProps {
  id?: number;
  createdAt?: Date;
  totalAmount?: number;
  paymentMethod?: z.infer<typeof PaymentMethod>;
  status?: z.infer<typeof OrderStatus>;
  stripePaymentId?: string;
  pickupDate?: Date;
  orderFulfilledAt?: Date;
  sort?: "asc" | "desc" | string;
}
export default function useInfiniteOrders(filters: GetInfiniteOrdersProps) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["orders", filters],
    queryFn: ({ pageParam, queryKey }) =>
      getInfiniteOrders({
        pageParam: pageParam as number,

        queryKey: queryKey as [string, GetInfiniteOrdersProps],
      }),

    getNextPageParam: (lastPage) => {
      return lastPage.nextPageParam;
    },
  });
  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
}
