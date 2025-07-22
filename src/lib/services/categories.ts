import { categoryResult, Product } from "@lib/types";
import { createClient } from "@utils/supabase/client";

const supabase = createClient();
export async function searchCategories(searchTerm: string): Promise<{
  categories: categoryResult[] | null;
  products: Product[] | null;
  error: string;
}> {
  let query = supabase.from("categories").select("*");

  let products: Product[] | null = [];
  let errors = "";
  // ,product.name.ilike.%${searchTerm}%,product.description.ilike.%${searchTerm}%,product.productBrands.name.ilike.%${searchTerm}%
  if (searchTerm) {
    query = query.ilike("name", `%${searchTerm}%`);
    const { data: product, error } = await supabase
      .from("product")
      .select("*,productImages(isMain,imageUrl),productBrands(name)")
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .range(0, 5);
    if (error) errors = error.message;
    products = product;
  } else {
    query = query.range(0, 10);
  }

  const { data: categories, error } = await query;
  if (error) errors = error.message;

  return { categories, products, error: errors || "" };
}
