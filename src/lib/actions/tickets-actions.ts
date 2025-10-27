"use server";

import { PAGE_SIZE } from "@lib/constants";
import {
  CreateTicket,
  CreateTicketProps,
  CreateTicketSchema,
  CreateTicketStatus,
  Ticket,
  TicketStatus,
} from "@lib/types";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@utils/supabase/server";

import { revalidateTag, unstable_cache } from "next/cache";
import { z } from "zod";

export async function revalidateTickets() {
  revalidateTag("tickets");
}

interface GetTickets {
  pageNumber: string;
  sort?: string;
  name?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  clientId?: number;
}

async function getTickets(
  {
    pageNumber,
    sort = "asc",
    name,
    dateFrom,
    dateTo,
    status,
    clientId,
  }: GetTickets,
  supabase: SupabaseClient
): Promise<{
  tickets: Ticket[] | null;
  count: number | null;
  error: PostgrestError | null;
}> {
  const from = (Number(pageNumber) - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("tickets")
    .select(
      "*,client_id!inner(*),ticketStatus_id(*),ticketPriority_id(*),ticketCategory_id(*)",
      { count: "exact" }
    );

  if (name) query = query.ilike("client_id.name", `%${name}%`);
  if (status) query = query.eq("ticketStatus_id", status);
  if (dateFrom) query = query.gte("created_at", dateFrom);
  if (dateTo) query = query.lte("created_at", dateTo);
  if (clientId) query = query.eq("client_id", clientId);

  const {
    data: tickets,
    count,
    error,
  } = await query.order("id", { ascending: sort === "asc" }).range(from, to);

  return { tickets, count, error };
}

export const getTicketsAction = unstable_cache(getTickets, ["tickets"], {
  tags: ["tickets"],
});

export async function createTicketAction(
  insert: z.infer<typeof CreateTicketSchema>
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tickets")
      .insert([insert])
      .select();

    if (error) {
      throw new Error(error.message);
    }
    revalidateTag("tickets");

    return { data, error: "" };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

interface EditProps {
  id: number;
  subject?: string;
  description?: string;
  client_id?: number;
  updated_at?: string;
  admin_assigned_to?: string | null;
  ticketStatus_id?: number;
  ticketPriority_id?: number;
  ticketCategory_id?: number;
}
export async function editTicketAction(data: EditProps) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("tickets")
      .update(data)
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    revalidateTag("tickets");

    return { error: "" };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteTicketAction(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("tickets").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidateTag("tickets");
  return { error: "" };
}
