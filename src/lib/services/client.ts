import { Client } from "@lib/types";
import { PostgrestError } from "@supabase/supabase-js";
import supabase from "@utils/supabase";

type GetBy = "id" | "user_id";

export async function getClinetById({
  id,
  getBy = "id",
}: {
  id?: number | string;
  getBy?: GetBy;
}): Promise<{ clientById: Client[] | null; error: PostgrestError | null }> {
  const { data: clientById, error } = await supabase
    .from("clients")
    .select("*")
    .eq(getBy, id);

  return { clientById, error };
}
