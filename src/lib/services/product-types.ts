import { ProductType } from "@lib/types";
import { createClient } from "@utils/supabase/client";

const supabase = createClient();
export async function searchProductTypes(searchTerm: string): Promise<{
  productTypes: ProductType[] | null;
  error: string;
}> {
  let query = supabase.from("productTypes").select("*");

  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
  } else {
    query = query.range(0, 10);
  }

  const { data: productTypes, error } = await query;

  return { productTypes, error: error?.message || "" };
}
