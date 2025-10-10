import { CreateTicket, Ticket } from "@lib/types";
import { createClient } from "@utils/supabase/client";

const supabase = createClient();

export async function getTickets(userId?: string): Promise<{
  tickets: Ticket[] | null;
  error: any; // Use a more specific Supabase error type if available
  count: number | null;
  status: number;
  statusText: string;
}> {
  let query = supabase
    .from("tickets")
    .select(
      "*,ticketPriority_id(*),ticketPriority_id(*),ticketCategory_id(*)",
      { count: "exact" }
    );

  if (userId) query = query.eq("user_id", userId);

  const { data: tickets, error, status, statusText, count } = await query;

  return { tickets, count, status, statusText, error };
}

interface CreateProps extends CreateTicket {
  user_id: string;
  updated_at: string;
  admin_assigned_to: string;
}

export async function createTicket(data: CreateProps) {
  const { error } = await supabase.from("tickets").insert([data]);

  if (error) throw new Error(error.message);
}

export async function editTicket(data: CreateProps) {
  const { error } = await supabase.from("tickets").update({ data });

  if (error) throw new Error(error.message);
}

export async function deleteTicket(id: number) {
  const { error } = await supabase.from("tickets").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
