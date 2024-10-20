"use server";

import { AUTH_TOEKN_NAME, PAGE_SIZE } from "@lib/constants";
import { getToken } from "@lib/helper";
import {
  Client,
  ClientWithPhoneNumbers,
  CreateClient,
  CreateProductProps,
  EditProduct,
  PhoneNumber,
  ProductImage,
} from "@lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createPhoneNumAction,
  getPhonesAction,
  getPhonesCountAction,
} from "./phoneActions";

interface GetClientsActionProps {
  name?: string;
  email?: string;
  phone?: string;
  pageNumber: string;
}

export async function getClientsAction({
  pageNumber,
  name,
  email,
  phone,
}: GetClientsActionProps) {
  //Product?PageNumber=1&PageSize=10
  // /api/Product?Name=test&CategoryId=1&ProductTypeId=1&ProductBrandId=1&IsAvailable=true&PageNumber=1&PageSize=10
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const { data: phoneNumbers, error } = await getPhonesAction({});

  let query = `${process.env.API_URL}/api/Clients?PageNumber=${pageNumber}&PageSize=${PAGE_SIZE}`;

  if (name) query = query + `&Name=${name}`;

  if (email) query = query + `&Email=${email}`;

  if (phone) query = query + `&Phone=${phone}`;

  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
    next: {
      // revalidate: 3600,
      tags: [
        "clients",
        // `${pageNumber}`,
        // `${name}`,
        // `${categoryId}`,
        // `${productTypeId}`,
        // `${productBrandId}`,
        // `${isAvailable}`,
      ],
    },
  });

  // console.log(response, "Product Response");
  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = (await response.json()) as Client[];

  // console.log(phoneNumbers, "PHONE NUMBERS");
  let ClientsData: ClientWithPhoneNumbers[] = [];

  if (data.length && phoneNumbers.length) {
    ClientsData = data.map((clientData) => {
      const phoneNumbersData = phoneNumbers.filter(
        (phone: PhoneNumber) => phone.clientId === clientData.id
      );
      return { ...clientData, phoneNumbers: phoneNumbersData };
    });
  }

  return { data: ClientsData, error: "" };
}

export async function getClienttByIdAction(id: number) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(`${process.env.API_URL}/api/Clients/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
  });

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

export async function createClientAction({
  name,
  email,
  phones,
}: CreateClient) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/Clients`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  console.log(response);
  if (!response.ok) throw new Error("Had truble creating a product.");

  const { clientId } = await response.json();

  if (phones.length) {
    const upload = phones.map((phone) =>
      createPhoneNumAction({ number: phone.number, clientId })
    );
    await Promise.all(upload);
  }
  revalidateTag("clients");
}

export async function editClientAction({
  clientToEdit,
}: {
  clientToEdit: Client;
}) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";
  const { id, name, email } = clientToEdit;
  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/Clients/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  console.log(response);
  if (!response.ok) throw new Error("Had truble creating a product.");

  // revalidatePath(`/products/${productToEdit.id}`);
  revalidateTag("clients");

  // const data = await response.json();
  // return data;
}

export async function deleteProductsByIdAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token) throw new Error("You are not authorized to make this action.");

  const response = await fetch(`${process.env.API_URL}/api/Product/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
  });

  if (!response.ok)
    throw new Error(`Failed to delete a product with the id of ${id} `);
  // const data = await response.json();

  // return data;
  revalidatePath("/products");
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

  const token = getToken();

  if (!token)
    return {
      data: null,
      error: "You are not authorized to get the products count data.",
    };

  let query = `${process.env.API_URL}/api/Product/count?`;

  if (name) query = query + `&Name=${name}`;

  if (categoryId) query = query + `&CategoryId=${categoryId}`;

  if (productTypeId) query = query + `&ProductTypeId=${productTypeId}`;

  if (productBrandId) query = query + `&ProductBrandId=${productBrandId}`;

  if (isAvailable) query = query + `&IsAvailable=${isAvailable}`;

  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
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

  return { data, error: "" };
}

/// PRODUCT IMAGES.

export async function getProductsImageAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/${id}`,
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

export async function createProductImageAction(formData: FormData) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  console.log(formData, "Form data");
  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/ProductImages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  console.log(response);
  if (!response.ok) throw new Error("Had truble creating a product.");

  // const data = await response.json();
  // return data;
}

export async function deleteProductsImageAction(imageId: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token) throw new Error("You are not authorized to do this action.");

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
  console.log(response, "DELETE ACITON");

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    throw new Error("Something went wrong while deleting product images.");
  }

  // const data = await response.json();

  // console.log(data, "DATA");
  // return { data, error: "" };
}

/// WTF IS THIS ?

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

  console.log(data, "DATA");
  return { data, error: "" };
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

  console.log(data, "DATA");
  return { data, error: "" };
}
