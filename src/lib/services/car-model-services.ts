import { SUPABASE_URL } from "@lib/constants";
import { CreateCarModel } from "@lib/types";
import { createClient } from "@utils/supabase/client";
import {
  deleteImageFromBucket,
  uploadSingleImgToBucket,
} from "./helper-services";

const supabase = createClient();

export async function createModel({
  name,
  notes,
  carMakerId,
  image,
}: CreateCarModel) {
  // https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/models/528979728_1178979040928583_6949790451747041757_n.jpg
  let path: string | null = null;

  if (image.length) {
    const file = image[0];
    const name = `${Math.random()}-${file.name}`.replace(/\//g, "");
    path = `${SUPABASE_URL}/storage/v1/object/public/models/${name}`;

    const { error } = await uploadSingleImgToBucket({
      bucketName: "models",
      image: { name, file },
    });
    if (error) throw new Error(error.message);
  }

  const { data, error } = await supabase
    .from("carModels")
    .insert([{ name, notes, carMakerId, image: path }])
    .select();

  if (error) throw new Error(error.message);

  //   revalidateTag("carModels");

  return data;
}

export async function editModel({
  carModel: { name, notes, image, id },
  imageToDelete,
}: {
  carModel: { name: string; image: File[]; notes: string; id: number };
  imageToDelete: string;
}) {
  let path: string | null = null;
  if (image.length) {
    const file = image[0];
    const name = `${Math.random()}-${file.name}`.replace(/\//g, "");
    path = `${SUPABASE_URL}/storage/v1/object/public/models/${name}`;

    const { error } = await uploadSingleImgToBucket({
      bucketName: "models",
      image: { name, file },
    });
    if (error) throw new Error(error.message);

    // Delete existing image.
    if (imageToDelete) {
      const { error } = await deleteImageFromBucket({
        bucketName: "models",
        imagePaths: [imageToDelete],
      });
      if (error)
        console.error(`Failed to delete existing image: ${error.message}`);
    }
  }

  const insert: { name: string; notes: string; image?: string } = {
    name,
    notes,
  };
  if (path) insert.image = path;
  const { data, error } = await supabase
    .from("carModels")
    .update(insert)
    .eq("id", id);

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteModel({
  id,
  imageToDelete,
}: {
  id: number;
  imageToDelete: string;
}) {
  if (imageToDelete) {
    const { error } = await deleteImageFromBucket({
      bucketName: "models",
      imagePaths: [imageToDelete],
    });
    if (error)
      throw new Error(`Failed to delete existing image: ${error.message}`);
  }
  const { error } = await supabase.from("carModels").delete().eq("id", id);

  if (error) throw new Error(error.message);
}
