import { revalidateCarGenerations } from "@lib/actions/carGenerationsActions";
import { revalidateModels } from "@lib/actions/carModelsActions";
import { PILL_SIZE } from "@lib/constants";
import { CarGeneration } from "@lib/types";
import { createClient } from "@utils/supabase/client";

const supabase = createClient();
export async function getCarGenerations(page: number) {
  const from = (page - 1) * PILL_SIZE;
  const to = from + PILL_SIZE - 1;
  const {
    data: carGenerations,
    count,
    error,
  } = await supabase
    .from("carGenerations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  return { carGenerations, count };
}

export async function createCarGeneration(generation: CarGeneration) {
  const { error } = await supabase.from("carGenerations").insert([generation]);

  if (error) throw new Error(error.message);
  // await revalidateCarGenerations();
  // await revalidateModels();
}

export async function editCarGeneration({
  generation,
  id,
}: {
  generation: CarGeneration;
  id: number;
}) {
  const { error } = await supabase
    .from("carGenerations")
    .update(generation)
    .eq("id", id);

  if (error) throw new Error(error.message);
  // await revalidateCarGenerations();
  // await revalidateModels();
}

export async function deleteCarGenerations(id: number) {
  const { error } = await supabase.from("carGenerations").delete().eq("id", id);
  if (error) throw new Error(error.message);
  // await revalidateCarGenerations();
  // await revalidateModels();
}
