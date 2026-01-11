import { PAGE_SIZE } from "@lib/constants";
import { Order, OrderStatus, PaymentMethod } from "@lib/types";
import supabase from "@utils/supabase";
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

export async function getInfiniteOrders({
  pageParam = 1,
  queryKey,
}: {
  pageParam: number;
  queryKey: [string, GetInfiniteOrdersProps];
}): Promise<{
  items: Order[];
  nextPageParam: number | null;
}> {
  const [_, filters] = queryKey;
  let query = supabase
    .from("orders")
    .select("*,clients(*)", { count: "exact" });

  if (filters.id) query = query.eq("id", filters.id);
  if (filters.createdAt) {
    const date = filters.createdAt.toISOString();
    query = query.eq("created_at", date);
  }
  if (filters.totalAmount)
    query = query.eq("total_amount", filters.totalAmount);
  if (filters.paymentMethod)
    query = query.eq("payment_method", filters.paymentMethod);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.stripePaymentId)
    query = query.eq("stripe_payment_id", filters.stripePaymentId);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.pickupDate) {
    const date = filters.pickupDate.toISOString();
    query = query.eq("pickupDate", date);
  }
  if (filters.orderFulfilledAt) {
    const date = filters.orderFulfilledAt.toISOString();
    query = query.eq("order_fulfilled_at", date);
  }
  const sortBy = filters.sort ? filters.sort === "asc" : true;

  const from = (pageParam - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const {
    data: orders,
    error,
    count,
  } = await query.range(from, to).order("created_at", { ascending: sortBy });

  if (error) {
    console.log(`Failed to get orders data: ${error.message}`);
  }
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const nextPageParam = pageParam < totalPages ? pageParam + 1 : null;

  return {
    items: orders || [],
    nextPageParam,
  };
}

export async function updateOrder() {}
