"use server";

import { AUTH_TOEKN_NAME, PAGE_SIZE } from "@lib/constants";
import { getAllCategories } from "@lib/data-service";
import { getToken } from "@lib/helper";
import { deleteImageFromBucketSr } from "@lib/services/server-helpers";

import { CreateProductProps, EditProduct, ProductImage } from "@lib/types";
import { createClient } from "@utils/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

interface GetProdcutsActionProps {
  name?: string;
  categoryId?: string;
  productTypeId?: string;
  productBrandId?: string;
  isAvailable?: string;
  pageNumber?: string;
}
//Product?PageNumber=1&PageSize=10
// /api/Product?Name=test&CategoryId=1&ProductTypeId=1&ProductBrandId=1&IsAvailable=true&PageNumber=1&PageSize=10
// const token = getToken();

// if (!token)
//   return { data: null, error: "You are not authorized to make this action." };
export async function getProductsAction({
  pageNumber,
  name,
  categoryId,
  productTypeId,
  productBrandId,
  isAvailable,
}: GetProdcutsActionProps) {
  const from = (Number(pageNumber) - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = `${supabaseUrl}/rest/v1/product?select=*,productImages(*),categories(name)&order=created_at.asc&productImages.order=created_at.asc`;

  if (name)
    query = query + `&or=(name.ilike.*${name}*,description.ilike.*${name}*)`;

  if (categoryId) query = query + `&categoryId=eq.${categoryId}`;

  if (productTypeId) query = query + `&productTypeId=eq.${productTypeId}`;

  if (productBrandId) query = query + `&productBrandId=eq.${productBrandId}`;

  if (isAvailable) query = query + `&isAvailable=eq.${isAvailable === "true"}`;
  // query = query + `&productImages.order=created_at.asc`;

  const headers = {
    apikey: `${supabaseKey}`,
    Authorization: `Bearer ${supabaseKey}`,
    Prefer: "count=exact",
  } as Record<string, string>;

  if (pageNumber) {
    headers.Range = `${from}-${to}`;
  }

  const response = await fetch(query, {
    method: "GET",
    headers,
    next: {
      tags: ["products"],
    },
  });

  if (!response.ok) {
    const error =
      (await response.json()).message ||
      "Something went wrong whole grabbing the products.";

    return {
      data: null,
      error,
    };
  }

  const data = await response.json();

  return { data, error: "" };
}
// const productsWithCategories = data.map((product) => {
//   const category = categories.find(
//     (cat: Category) => cat.id === product.categoryId
//   ).name;
//   return { ...product, category: category };
// });
export async function getProductByIdAction(id: string) {
  // const token = getToken();

  // if (!token)
  //   return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(
    `${supabaseUrl}/rest/v1/product?id=eq.${id}&select=*,productImages(*),categories(*),productBrands(*),productTypes(*)&productImages.order=created_at.asc`,
    {
      method: "GET",
      headers: {
        apikey: `${supabaseKey}`,
        Authorization: `Bearer ${supabaseKey}`,
      },
    }
  );

  if (!response.ok) {
    const error =
      (await response.json()) ||
      "Something went wrong while getting the product";

    return { data: null, error };
  }

  const data = await response.json();

  return { data: data[0], error: "" };
}

export async function createProductAction({
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
  // 1. Create the product.
  const supabase = await createClient();
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

  if (error) return { data: null, error: error.message };

  // 2. Upload the related images to the product created.

  if (!images.length) return { data, error: "" };

  const product = data[0];

  const imageObjs = images.map((image) => {
    const img = image.get("image") as File;
    const isMain = image.get("isMain");

    const name = `${Math.random()}-${img.name}`.replace(/\//g, "");

    return {
      path: `${supabaseUrl}/storage/v1/object/public/product/${name}`,
      name,
      isMain: isMain === "true",
      file: img,
    };
  });

  const dataForImagesTable = imageObjs.map((obj) => {
    return { productId: product.id, imageUrl: obj.path, isMain: obj.isMain };
  });

  const { data: imagesData, error: imagesError } = await supabase
    .from("productImages")
    .insert(dataForImagesTable)
    .select();

  if (imagesError)
    return {
      data: product,
      error: `Error from the Table: ${imagesError.message}`,
    };

  // 3. Handle image uploads to the bucket.
  let finalError = "";

  // Use Promise.all to handle concurrent uploads.
  const uploadPromises = imageObjs.map(async (img) => {
    try {
      const { data, error } = await supabase.storage
        .from("product")
        .upload(img.name, img.file);

      if (error) {
        console.log("ERROR:", error.message);
        throw new Error(error.message);
      }

      console.log("UPLOAD SUCCESS:", data);
      return data;
    } catch (err: any) {
      console.log("UPLOAD ERROR:", err);
      finalError = err.message;
    }
  });

  await Promise.all(uploadPromises);

  if (finalError) {
    return {
      data: product,
      error: `Image upload error: ${finalError}`,
    };
  }

  revalidateTag("products");
  return { data: product, error: "" };
}

export async function revalidateProducts() {
  revalidateTag("products");
}

export async function revalidateProductById(id: number) {
  revalidatePath(`/products/${id}`);
  revalidateTag("products");
}
// export async function createProductAction({
//   name,
//   categoryId,
//   productTypeId,
//   productBrandId,
//   description,
//   listPrice,
//   carinfoId,
//   salePrice,
//   stock,
//   isAvailable,
//   images,
// }: CreateProductProps) {
//   // 1. Create the product.

//   const supabase = await createClient();
//   const { data, error } = await supabase
//     .from("product")
//     .insert([
//       {
//         name,
//         categoryId,
//         productTypeId,
//         productBrandId,
//         description,
//         listPrice,
//         salePrice,
//         stock,
//         isAvailable,
//       },
//     ])
//     .select();

//   if (error) return { data: null, error: error.message };

//   // 2. Upload the related images to the product created.

//   //  An example of an image url: https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/product//473017616_908603508057544_5962038006304143388_n.jpg

//   if (!images.length) return { data, error: "" };

//   const product = data[0];

//   const imageObjs = images.map((image) => {
//     const img = image.get("image") as File;
//     const isMain = image.get("isMain");

//     const name = `${Math.random()}-${img.name}`.replace(/\//g, "");

//     return {
//       path: `${supabaseUrl}/storage/v1/object/public/product/${name}`,
//       name,
//       isMain: isMain === "true",
//       file: img,
//     };
//   });

//   const dataForImagesTable = imageObjs.map((obj) => {
//     return { productId: product.id, imageUrl: obj.path, isMain: obj.isMain };
//   });

//   const { data: imagesData, error: imagesError } = await supabase
//     .from("productImages")
//     .insert(dataForImagesTable)
//     .select();

//   if (imagesError)
//     return {
//       data: product,
//       error: `Error from the Tabe: ${imagesError.message}`,
//     };

//   // The problem come after this point in the code.

//   let finalError = "";

//   for (let i = 0; i < imageObjs.length; i++) {
//     const img = imageObjs[i];

//     const { data, error } = await supabase.storage
//       .from("product")
//       .upload(img.name, img.file);

//     if (error) {
//       console.log("ERROR:", error.message);
//       finalError = error.message;
//     }
//   }
//   console.log("ERROR:", finalError);

//   revalidateTag("products");
//   return { data: product, error: finalError };
// }

export async function editProductAction({
  productToEdit,
  imagesToUpload,
  imagesToDelete,
  isMain,
  isEqual,
}: {
  productToEdit: EditProduct;
  imagesToUpload: FormData[];
  imagesToDelete: ProductImage[];
  isEqual: boolean;
  isMain?: ProductImage | null;
}) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) redirect("/login");

  if (!isEqual) {
    const response = await fetch(
      `${process.env.API_URL}/api/Product/${productToEdit.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToEdit),
      }
    );

    if (!response.ok) {
      if (response.status === 409) {
        return { data: null, error: (await response.json()).message };
      }
      return { data: null, error: "Had truble creating a product." };
    }
  }

  if (imagesToUpload.length) {
    const upload = imagesToUpload.map((image) =>
      createProductImageAction(image)
    );
    await Promise.all(upload);
  }

  if (imagesToDelete.length) {
    const deleteImages = imagesToDelete.map((deletedImage) =>
      deleteProductsImageAction(deletedImage.id)
    );

    await Promise.all(deleteImages);
  }

  if (isMain) {
    await setProductImageAsMain(isMain.id);
  }

  revalidatePath(`/products/${productToEdit.id}`);
  revalidateTag("products");

  return { data: null, error: "" };
}

export async function deleteProductsByIdAction(
  id: number,
  imagePaths: string[]
) {
  //Product?PageNumber=1&PageSize=10

  // const token = getToken();

  // if (!token) redirect("/login");
  const supabase = await createClient();
  const { error } = await supabase.from("product").delete().eq("id", id);

  if (error) return { data: null, error: error.message };

  const { error: bucketError } = await deleteImageFromBucketSr({
    bucketName: "product",
    imagePaths,
  });

  if (bucketError) return { data: null, error: bucketError.message };
  revalidatePath("/products");

  return { data: null, error: "" };
}

interface GetProdcutsCountActionProps {
  name?: string;
  categoryId?: string;
  productTypeId?: string;
  productBrandId?: string;
  isAvailable?: string;
}

export async function getProductsCountAction({
  name,
  categoryId,
  productTypeId,
  productBrandId,
  isAvailable,
}: GetProdcutsCountActionProps) {
  //Product?PageNumber=1&PageSize=10

  // const token = getToken();

  // if (!token)
  //   return {
  //     data: null,
  //     error: "You are not authorized to get the products count data.",
  //   };
  let query = `${supabaseUrl}/rest/v1/product?select=count`;

  if (name)
    query = query + `&or=(name.ilike.*${name}*,description.ilike.*${name}*)`;

  if (categoryId) query = query + `&categoryId=eq.${categoryId}`;

  if (productTypeId) query = query + `&productTypeId=eq.${productTypeId}`;

  if (productBrandId) query = query + `&productBrandId=eq.${productBrandId}`;

  if (isAvailable) query = query + `&isAvailable=eq.${isAvailable === "true"}`;

  const response = await fetch(query, {
    method: "GET",
    cache: "no-cache",
    headers: {
      apikey: `${supabaseKey}`,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products count.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products count.",
    };
  }
  const data = await response.json();

  return { data: data[0].count, error: "" };
}

/// PRODUCT IMAGES.

export async function getProductsImageAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  // const token = getToken();

  // if (!token)
  //   return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/${id}`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      //   // "Content-type": "application/json",
      // },
    }
  );

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = await response.json();

  return { data, error: "" };
}

export async function createProductImageAction(formData: FormData) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/ProductImages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  console.log(response);

  if (!response.ok) {
    const error =
      response.status === 409
        ? (await response.json()).message
        : "Hat truble posting an image.";
    // throw new Error(error);
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    return { data: null, error: "Had truble creating a product." };
  }

  return { data: null, error: "" };
}

export async function createMultipleProImages(formData: FormData, id: number) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) redirect("/login");

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/AddMulty/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorMessage =
      response.status === 409
        ? (await response.json()).message
        : "Something went wrong while uploading images.";
    return { data: null, error: errorMessage };
  }

  return { data: null, error: "" };
}

export async function deleteProductsImageAction(imageId: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token) redirect("/login");

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/${imageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  return { data: null, error: "" };
}

export async function getProductsImagesMainAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/main/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = await response.json();

  return { data, error: "" };
}

export async function setProductImageAsMain(id: number) {
  const token = getToken();

  if (!token) redirect("/login");

  await fetch(`${process.env.API_URL}/api/ProductImages/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
  });
}

export async function deleteProductsImageMainAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/main/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = await response.json();

  return { data, error: "" };
}

/*

"use server";

import { AUTH_TOEKN_NAME, PAGE_SIZE } from "@lib/constants";
import { getAllCategories } from "@lib/data-service";
import { getToken } from "@lib/helper";
import {
  Category,
  CreateProductProps,
  EditProduct,
  Product,
  ProductImage,
} from "@lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface GetProdcutsActionProps {
  name?: string;
  categoryId?: string;
  productTypeId?: string;
  productBrandId?: string;
  isAvailable?: string;
  pageNumber?: string;
}

export async function getProductsAction({
  pageNumber,
  name,
  categoryId,
  productTypeId,
  productBrandId,
  isAvailable,
}: GetProdcutsActionProps) {
  //Product?PageNumber=1&PageSize=10
  // /api/Product?Name=test&CategoryId=1&ProductTypeId=1&ProductBrandId=1&IsAvailable=true&PageNumber=1&PageSize=10
  // const token = getToken();

  // if (!token)
  //   return { data: null, error: "You are not authorized to make this action." };

  let query = `${process.env.API_URL}/api/Product?`;

  if (name) query = query + `&Name=${name}`;
  if (pageNumber)
    query = query + `&PageSize=${PAGE_SIZE}&PageNumber=${pageNumber}`;

  if (categoryId) query = query + `&CategoryId=${categoryId}`;

  if (productTypeId) query = query + `&ProductTypeId=${productTypeId}`;

  if (productBrandId) query = query + `&ProductBrandId=${productBrandId}`;

  if (isAvailable) query = query + `&IsAvailable=${isAvailable}`;

  const response = await fetch(query, {
    method: "GET",
    // headers: {
    //   Authorization: `Bearer ${token}`,
    //   "Content-type": "application/json",
    // },
    next: {
      // revalidate: 3600,
      tags: ["products"],
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const categories = await getAllCategories();

  const data = (await response.json()) as Product[];

  const productsWithCategories = data.map((product) => {
    const category = categories.find(
      (cat: Category) => cat.id === product.categoryId
    ).name;
    return { ...product, category: category };
  });

  return { data: productsWithCategories, error: "" };
}

export async function getProductByIdAction(id: string) {
  // const token = getToken();

  // if (!token)
  //   return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(`${process.env.API_URL}/api/Product/${id}`);

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = await response.json();

  return { data, error: "" };
}

export async function createProductAction({
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
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/Product`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    return { data: null, error: "Had truble creating a product." };
  }

  const { prodcutId } = await response.json();

  if (images.length) {
    const upload = images.map((image) => {
      image.append("productId", String(prodcutId));
      return createProductImageAction(image);
    });
    const result = await Promise.all(upload);

    const item = result.find((item) => item.error.length > 0);
    if (item) {
      return { data: null, error: item.error };
    }
  }
  revalidateTag("products");

  return { data: null, error: "" };
}

export async function editProductAction({
  productToEdit,
  imagesToUpload,
  imagesToDelete,
  isMain,
  isEqual,
}: {
  productToEdit: EditProduct;
  imagesToUpload: FormData[];
  imagesToDelete: ProductImage[];
  isEqual: boolean;
  isMain?: ProductImage | null;
}) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) redirect("/login");

  if (!isEqual) {
    const response = await fetch(
      `${process.env.API_URL}/api/Product/${productToEdit.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToEdit),
      }
    );

    if (!response.ok) {
      if (response.status === 409) {
        return { data: null, error: (await response.json()).message };
      }
      return { data: null, error: "Had truble creating a product." };
    }
  }

  if (imagesToUpload.length) {
    const upload = imagesToUpload.map((image) =>
      createProductImageAction(image)
    );
    await Promise.all(upload);
  }

  if (imagesToDelete.length) {
    const deleteImages = imagesToDelete.map((deletedImage) =>
      deleteProductsImageAction(deletedImage.id)
    );

    await Promise.all(deleteImages);
  }

  if (isMain) {
    await setProductImageAsMain(isMain.id);
  }

  revalidatePath(`/products/${productToEdit.id}`);
  revalidateTag("products");

  return { data: null, error: "" };
}

export async function deleteProductsByIdAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token) redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/Product/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    return { data: null, error: "Had truble creating a product." };
  }

  revalidatePath("/products");

  return { data: null, error: "" };
}

interface GetProdcutsCountActionProps {
  name?: string;
  categoryId?: string;
  productTypeId?: string;
  productBrandId?: string;
  isAvailable?: string;
}

export async function getProductsCountAction({
  name,
  categoryId,
  productTypeId,
  productBrandId,
  isAvailable,
}: GetProdcutsCountActionProps) {
  //Product?PageNumber=1&PageSize=10

  // const token = getToken();

  // if (!token)
  //   return {
  //     data: null,
  //     error: "You are not authorized to get the products count data.",
  //   };

  let query = `${process.env.API_URL}/api/Product/count?`;

  if (name) query = query + `&Name=${name}`;

  if (categoryId) query = query + `&CategoryId=${categoryId}`;

  if (productTypeId) query = query + `&ProductTypeId=${productTypeId}`;

  if (productBrandId) query = query + `&ProductBrandId=${productBrandId}`;

  if (isAvailable) query = query + `&IsAvailable=${isAvailable}`;

  const response = await fetch(query, {
    method: "GET",
    cache: "no-cache",
  });

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products count.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products count.",
    };
  }
  const data = await response.json();

  return { data, error: "" };
}

/// PRODUCT IMAGES.

export async function getProductsImageAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  // const token = getToken();

  // if (!token)
  //   return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/${id}`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${token}`,
      //   // "Content-type": "application/json",
      // },
    }
  );

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = await response.json();

  return { data, error: "" };
}

export async function createProductImageAction(formData: FormData) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/ProductImages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  console.log(response);

  if (!response.ok) {
    const error =
      response.status === 409
        ? (await response.json()).message
        : "Hat truble posting an image.";
    // throw new Error(error);
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    return { data: null, error: "Had truble creating a product." };
  }

  return { data: null, error: "" };
}

export async function createMultipleProImages(formData: FormData, id: number) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) redirect("/login");

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/AddMulty/${id}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorMessage =
      response.status === 409
        ? (await response.json()).message
        : "Something went wrong while uploading images.";
    return { data: null, error: errorMessage };
  }

  return { data: null, error: "" };
}

export async function deleteProductsImageAction(imageId: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token) redirect("/login");

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/${imageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  return { data: null, error: "" };
}

export async function getProductsImagesMainAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/main/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = await response.json();

  return { data, error: "" };
}

export async function setProductImageAsMain(id: number) {
  const token = getToken();

  if (!token) redirect("/login");

  await fetch(`${process.env.API_URL}/api/ProductImages/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
  });
}

export async function deleteProductsImageMainAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/main/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = await response.json();

  return { data, error: "" };
}

*/
