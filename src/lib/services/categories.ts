import { revalidateCategories } from "@lib/actions/categoriesAction";
import { SUPABASE_URL } from "@lib/constants";
import { Category, categoryResult, Product } from "@lib/types";
import { createClient } from "@utils/supabase/client";
import { deleteImageFromBucket } from "./helper-services";

const supabase = createClient();

export async function createCategory({ name, image }: Category) {
  let path: string | null = null;

  if (image.length) {
    const file = image[0];
    const name = `${Math.random()}-${file.name}`.replace(/\//g, "");

    path = `${SUPABASE_URL}/storage/v1/object/public/category/${name}`;
    const { error } = await supabase.storage
      .from("category")
      .upload(name, file);

    if (error) throw new Error(error.message);
  }

  const { error } = await supabase
    .from("categories")
    .insert([{ name, image: path }]);

  if (error) throw new Error(error.message);
  await revalidateCategories();
}

interface EditProps extends Category {
  id: number;
  imageToDelete: string;
}

export async function editCategory({
  id,
  name,
  image,
  imageToDelete,
}: EditProps) {
  let path: string | null = null;

  if (image.length) {
    const file = image[0];
    const name = `${Math.random()}-${file.name}`.replace(/\//g, "");

    path = `${SUPABASE_URL}/storage/v1/object/public/category/${name}`;
    const { error } = await supabase.storage
      .from("category")
      .upload(name, file);

    if (error) throw new Error(error.message);
    if (imageToDelete) {
      const { error } = await deleteImageFromBucket({
        bucketName: "category",
        imagePaths: [imageToDelete],
      });
      if (error) throw new Error(error.message);
    }
  }

  const insert: { name: string; image?: string } = { name };
  if (path) insert.image = path;

  const { error } = await supabase
    .from("categories")
    .update(insert)
    .eq("id", id);

  if (error) throw new Error(error.message);
  await revalidateCategories();
}

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
