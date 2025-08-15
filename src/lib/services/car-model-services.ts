import { CreateCarModel } from "@lib/types";
import { createClient } from "@utils/supabase/client";

const supabase = createClient();

export async function createModel(carModel: CreateCarModel) {
  const { data, error } = await supabase
    .from("carModels")
    .insert([carModel])
    .select();

  if (error) throw new Error(error.message);

  //   revalidateTag("carModels");

  return data;
}

export async function editModel({
  carModel,
  id,
}: {
  carModel: { name: string; notes: string };
  id: number;
}) {
  const { data, error } = await supabase
    .from("carModels")
    .update(carModel)
    .eq("id", id);

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteModel(id: number) {
  const { error } = await supabase.from("carModels").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
