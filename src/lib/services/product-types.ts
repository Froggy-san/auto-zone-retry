import { SUPABASE_URL } from "@lib/constants";
import { ProductType, ProductTypeSchema } from "@lib/types";
import { createClient } from "@utils/supabase/client";
import { z } from "zod";
import { deleteImageFromBucket } from "./helper-services";
import { revalidateCategories } from "@lib/actions/categoriesAction";
//https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/productType/just-wanted-to-flex-my-prismo-tattoos-2023-to-now-3-v0-mi2kjvmko2mf1.webp
const supabase = createClient();

export async function createProductType({
  name,
  categoryId,
  image,
}: z.infer<typeof ProductTypeSchema>) {
  let path: string | null = null;

  if (image.length) {
    const file = image[0];
    const name = `${Math.random()}-${file.name}`.replace(/\//g, "");
    path = `${SUPABASE_URL}/storage/v1/object/public/productType/${name}`;

    const { error } = await supabase.storage
      .from("productType")
      .upload(name, file);

    if (error) throw new Error(error.message);
  }

  const { error } = await supabase
    .from("productTypes")
    .insert([
      { name, categoryId: categoryId ? categoryId : null, image: path },
    ]);

  if (error) throw new Error(error.message);
  await revalidateCategories();
}

interface EditProps extends z.infer<typeof ProductTypeSchema> {
  id: number;
  imageToDelete: string | null;
}

export async function editProductType({
  id,
  name,
  categoryId,
  image,
  imageToDelete,
}: EditProps) {
  let path: string | null = null;

  if (image.length) {
    const file = image[0];
    const name = `${Math.random()}-${file.name}`.replace(/\//g, "");

    path = `${SUPABASE_URL}/storage/v1/object/public/productType/${name}`;
    const { error } = await supabase.storage
      .from("productType")
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

  const insert: { name: string; categoryId: number; image?: string } = {
    name,
    categoryId,
  };
  if (path) insert.image = path;

  const { error } = await supabase
    .from("productTypes")
    .update(insert)
    .eq("id", id);

  if (error) throw new Error(error.message);
  await revalidateCategories();
}

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
