"use server";
import { Order, OrderSchema, OrderStatus, PaymentMethod } from "@lib/types";
import { createClient } from "@utils/supabase/server";
import { z } from "zod";
import { getCurrentClientAction } from "./clientActions";

interface GetOrdersActionProps {
  id: number;
  createdAt?: Date;
  clientId?: number;
  totalAmount?: number;
  paymentMethod?: z.infer<typeof PaymentMethod>;
  status?: z.infer<typeof OrderStatus>;
  stripePaymentId?: string;
  pickupDate?: Date;
}

export async function getOrdersAction({
  id,
  createdAt,
  clientId,
  totalAmount,
  paymentMethod,
  status,
  stripePaymentId,
  pickupDate,
}: GetOrdersActionProps): Promise<{
  data: Order[] | null;
  error: string | null;
}> {
  const supabase = await createClient();
  try {
    let query = supabase.from("orders").select("*");
    if (createdAt) {
      query = query.eq("created_at", createdAt.toISOString());
    }
    if (id) query = query.eq("id", id);
    if (clientId) {
      query = query.eq("client_id", clientId);
    }
    if (totalAmount) query = query.eq("total_amount", totalAmount);
    if (paymentMethod) query = query.eq("payment_method", paymentMethod);
    if (status) query = query.eq("status", status);
    if (stripePaymentId) query = query.eq("stripe_payment_id", stripePaymentId);
    if (pickupDate) query = query.eq("pickupDate", pickupDate);
    const { data: orders, error } = await query;
    if (error) {
      console.log(`Failed to get order data: ${error.message}`);
      throw new Error(error.message);
    }
    return { data: orders, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function getOrderByIdAction(id: number) {
  try {
    const { data: currentClient, error } = await getCurrentClientAction();

    if (error) throw new Error(error);
    const { data: orderById, error: orderError } = await getOrdersAction({
      id,
    });

    if (orderError) throw new Error(orderError);
    if (!orderById || !orderById.length)
      throw new Error(`No order found with that id #${id}`);

    const isClientOrder =
      orderById[0].client_id === currentClient?.id ||
      currentClient?.role === "admin";

    if (!isClientOrder) throw new Error(`Unauthorized action`);

    return { data: orderById, error: null };
  } catch (error: any) {
    console.log(error.message);
    return { data: null, error: error.message };
  }
}
export async function createOrderAction(
  data: z.infer<typeof OrderSchema>
): Promise<{ data: Order | null; error: string | null }> {
  try {
    const supabase = await createClient();
    // Validate the data on the server!
    const validatedData = OrderSchema.parse(data);
    const { data: createdOrder, error } = await supabase
      .from("orders")
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      console.log(`Failed to create order:${error.message}`);
      throw Error(error.message);
    }
    return { data: createdOrder, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

type UpdateProps = {
  id: number;
  client_id?: number;
  customer_details?: Record<string, any>;
  items?: Record<string, any>;
  total_amount?: number;
  payment_method?: z.infer<typeof PaymentMethod>;
  status?: z.infer<typeof OrderStatus>;
  stripe_payment_id?: string;
  metadata?: Record<string, any>;
  pickupDate?: string;
};

export async function updateOrderAction(
  data: UpdateProps
): Promise<{ data: Order | null; error: string | null }> {
  try {
    const supabase = await createClient();
    // const validatedData = UpdateOrderActionProps.parse(data);
    const { data: updatedOrder, error } = await supabase
      .from("orders")
      .update(data)
      .eq("id", data.id)
      .select()
      .single();

    if (error) {
      console.log(`Failed to create order:${error.message}`);
      throw Error(error.message);
    }
    return { data: updatedOrder, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
