import { Client, User } from "@lib/types";
import { createClient } from "@utils/supabase/client";

export async function getCurrUser(): Promise<{
  user: User | null;
  client: Client | null;
}> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clientById, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user?.id)
    .single();
  if (error) {
    console.log(
      `Something went wrong while grabbing the client's detais: ${error.message}`,
    );
  }

  return { user, client: clientById };
}
