import {
  EditProduct,
  FilesWithPreview,
  ImgData,
  ProductImage,
} from "@lib/types";
import { createClient } from "@utils/supabase/client";
import {
  deleteImageFromBucket,
  deleteMultipleImageFromTable,
  uploadImageToBucket,
} from "./helper-services";

interface CreateProductProps {
  name: string;
  categoryId: number;
  productTypeId: number;
  productBrandId: number;
  description: string;
  listPrice: number;
  carinfoId: number;
  salePrice: number;
  stock: number;
  isAvailable: boolean;
  images: ImgData[];
}

export async function createProduct({
  name,
  categoryId,
  productTypeId,
  productBrandId,
  description,
  listPrice,
  carinfoId,
  salePrice,
  stock,
  isAvailable,
  images,
}: CreateProductProps) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("product")
    .insert([
      {
        name,
        categoryId,
        productTypeId,
        productBrandId,
        description,
        listPrice,
        salePrice,
        stock,
        isAvailable,
      },
    ])
    .select();

  if (error) throw new Error(error.message);

  const product = data[0];
  // 2. Upload the related images to the product created.

  if (!images.length) return product;

  const dataForImagesTable = images.map((obj) => {
    return { productId: product.id, imageUrl: obj.path, isMain: obj.isMain };
  });

  const { data: imagesData, error: imagesError } = await supabase
    .from("productImages")
    .insert(dataForImagesTable)
    .select();

  if (imagesError) throw new Error(`Image Table Error: ${imagesError.message}`);

  await uploadImageToBucket({ bucketName: "product", images });

  return product;
}

export async function editProdcut({
  productToEdit,
  imagesToUpload,
  imagesToDelete,
  isMain,
  isEqual,
  prevIsMian,
}: {
  productToEdit: EditProduct;
  imagesToUpload: ImgData[];
  imagesToDelete: ProductImage[];
  isEqual: boolean;
  isMain?: ProductImage | null;
  prevIsMian: ProductImage | null;
}) {
  const supabase = createClient();

  if (!isEqual) {
    const { data, error } = await supabase
      .from("product")
      .update(productToEdit)
      .eq("id", productToEdit.id)
      .select();
    if (error) throw new Error(error.message);
  }

  /// Upload new images added by the user.

  if (imagesToUpload.length) {
    // Check if the user marked any of the new images as a main image
    const isThereMianImage = imagesToUpload.some((img) => img.isMain);
    // Check if the user changed or marked any of the new images as a main image , and see if there was a previus main images or not, becasue if there wasn't a main image then there is no need to unmark any previus images before markingthe new one as main.
    if (isThereMianImage && prevIsMian) {
      const { error } = await supabase
        .from("productImages")
        .update({ isMain: false })
        .eq("id", prevIsMian.id)
        .select();

      if (error) throw new Error(error.message);
    }

    const dataForImagesTable = imagesToUpload.map((obj) => {
      return {
        productId: productToEdit.id,
        imageUrl: obj.path,
        isMain: obj.isMain,
      };
    });

    const { data: imagesData, error: imagesError } = await supabase
      .from("productImages")
      .insert(dataForImagesTable)
      .select();

    if (imagesError)
      throw new Error(`Image Table Error: ${imagesError.message}`);

    await uploadImageToBucket({
      bucketName: "product",
      images: imagesToUpload,
    });
  }

  // Delete any images removed by the user.

  if (imagesToDelete.length) {
    const ids: number[] = [];
    const imagePaths: string[] = [];
    imagesToDelete.forEach((image) => {
      ids.push(image.id);
      imagePaths.push(image.imageUrl);
    });

    const { error: imageTableError } = await deleteMultipleImageFromTable(
      "productImages",
      ids
    );

    if (imageTableError)
      throw new Error(
        `Error from trying to delete images from the table: ${imageTableError.message}`
      );

    const { error } = await deleteImageFromBucket({
      bucketName: "products",
      imagePaths,
    });
    console.log("error from bucket.");
    if (error) throw new Error(error.message);
  }

  // Edit the main image if the user selected/chose a different main image to the product.
  if (isMain) {
    if (prevIsMian) {
      const { error } = await supabase
        .from("productImages")
        .update({ isMain: false })
        .eq("id", prevIsMian.id)
        .select();

      if (error) throw new Error(error.message);
    }

    const { data, error } = await supabase
      .from("productImages")
      .update({ isMain: true })
      .eq("id", isMain.id)
      .select();

    if (error) {
      console.log("ERROR IS MAIN:", error.message);
      throw new Error(error.message);
    }
  }
}

/// To delete images form a bucket
// export async function deleteImageFromBucket({
//   bucketName,
//   imagePaths,
// }: {
//   bucketName: string;
//   imagePaths: string[];
// }) {
//   const supabase = createClient();
//   const { error } = await supabase.storage.from(bucketName).remove(imagePaths);

//   return error;
// }
