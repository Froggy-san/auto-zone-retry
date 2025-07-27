import { MAKER_PAGE_SIZE, PAGE_SIZE, SUPABASE_URL } from "@lib/constants";
import { createClient } from "@utils/supabase/client";
import {
  deleteImageFromBucket,
  uploadSingleImgToBucket,
} from "./helper-services";
import { revalidateMakers } from "@lib/actions/carMakerActions";
import { CarBrand, CarMaker } from "@lib/types";
const supabase = createClient();
export async function getCarMakers(page: number) {
  const supabase = createClient();
  const from = (page - 1) * MAKER_PAGE_SIZE; // (1-1) * 10 = 0

  const to = from + MAKER_PAGE_SIZE - 1; // 0 + 10 - 1 = 9
  const {
    data: carMakers,
    count,
    error,
  } = await supabase
    .from("carMakers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  return { data: carMakers, count };
}

export async function getAllCarBrands(
  searchTerm: string
): Promise<CarBrand[] | null> {
  // let { data: carMakers, error } = await

  let query = supabase
    .from("carMakers")
    .select("*,carModels(*,carGenerations(*))");

  if (searchTerm.length) query = query.ilike("name", `%${searchTerm}%`);
  if (!searchTerm.length) query = query.range(0, 7);

  const { data: carMakers, error } = await query;
  if (error) throw new Error(`Car detials error: ${error.message}`);

  return carMakers;
}

interface CreateProps {
  name: string;
  notes: string;
  logo: File | null;
}

export async function createCarMaker({ name, notes, logo }: CreateProps) {
  console.log(name, notes);
  const imageName = logo
    ? `${Math.random()}-${logo.name}`.replace(/\//g, "")
    : null;
  //https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/makerLogos//0.8281897891957859-480551834_933789438872284_7908605222579490180_n.jpg
  const imagePath =
    imageName &&
    `${SUPABASE_URL}/storage/v1/object/public/makerLogos/${imageName}`;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("carMakers")
    .insert([{ name, notes, logo: imagePath }])
    .select();

  if (error) throw new Error(`Car maker creation error: ${error.message}`);
  if (imageName && logo) {
    const imageObj = {
      name: imageName,
      file: logo,
    };
    const { error: bucketError } = await uploadSingleImgToBucket({
      bucketName: "makerLogos",
      image: imageObj,
    });

    if (bucketError) throw new Error(`Bucket error: ${bucketError.message}`);
  }
  await revalidateMakers();
  return data;
}

interface EditCarMakerProps {
  newLogo: File;
  carMakerToEdit: {
    id: number;
    name: string;
    notes: string;
    logo: string | null;
  };
}

export async function editCarMaker({
  carMakerToEdit: { id, name, notes, logo },
  newLogo,
}: EditCarMakerProps) {
  const insertedData = { name, notes, logo };

  if (newLogo) {
    const imgName = `${Math.random()}-${newLogo.name}`;
    const path = `${SUPABASE_URL}/storage/v1/object/public/makerLogos/${imgName}`;

    const { error } = await uploadSingleImgToBucket({
      bucketName: "makerLogos",
      image: {
        name: imgName,
        file: newLogo,
      },
    });

    if (error) throw new Error(`Error from the bucket: ${error.message}`);
    insertedData.logo = path;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("carMakers")
    .update(insertedData)
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);

  console.log(`Logo: ${logo}`);
  if (logo) {
    const { error } = await deleteImageFromBucket({
      bucketName: "makerLogos",
      imagePaths: [logo],
    });

    if (error)
      throw new Error(
        `attempt at deleting an image form the 'carMakers' has failded, Error:${error.message}`
      );
  }
}

interface DeleteProps {
  carMaker: CarMaker;
}

export async function deleteCarMaker(carMaker: CarMaker) {
  const supabase = createClient();
  const { error } = await supabase
    .from("carMakers")
    .delete()
    .eq("id", carMaker.id);

  if (error) {
    console.log(`Unexpected error: ${error.message}`);
    return error;
  }

  if (carMaker.logo) {
    const { error } = await deleteImageFromBucket({
      bucketName: "makerLogos",
      imagePaths: [carMaker.logo],
    });

    if (error) {
      console.log(`Unexpected error: ${error.message}`);
      return error;
    }
  }
}
