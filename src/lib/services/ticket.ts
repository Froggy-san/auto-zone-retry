import { Message, MessageSchema, Ticket } from "@lib/types";
import { PostgrestError } from "@supabase/supabase-js";
import supabase from "@utils/supabase";
import { z } from "zod";

interface GetTicketByIdProps {
  id: string;
}

export async function getTicketById(
  id: string
): Promise<{ ticket: Ticket[] | null; error: PostgrestError | null }> {
  const { data: ticket, error } = await supabase
    .from("tickets")
    .select(
      "*,ticketStatus_id(*),ticketPriority_id(*),ticketCategory_id(*),client_id(*)"
    )
    .eq("id", id);

  return { ticket, error };
}
export async function getMessages(
  id: string
): Promise<{ messages: Message[] | null; error: PostgrestError | null }> {
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*,sender_id(*)")
    .eq("ticket_id", id);

  return { messages, error };
}

export async function createMessage(data: z.infer<typeof MessageSchema>) {
  const { error } = await supabase.from("messages").insert([data]);

  if (error) throw new Error(error.message);
}
