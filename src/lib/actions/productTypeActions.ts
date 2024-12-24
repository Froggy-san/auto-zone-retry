"use server";
import { getToken } from "@lib/helper";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
export async function getAllProductTypesAction() {
  // const token = getToken();

  // if (!token)
  //   return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/producttypes`, {
    method: "GET",
    next: {
      tags: ["productTyps"],
    },
  });

  if (!response.ok) {
    console.log(
      "Something went wrong while trying to fetch product types data."
    );
    return {
      data: null,
      error: "Something went wrong while trying to fetch product types data.",
    };
  }

  const data = await response.json();

  return { data, error: "" };
}

export async function createProductTypeAction(productType: string) {
  const token = getToken();
  if (!token) redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/producttypes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name: productType }),
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the product type.");
    return { data: null, error: "Something went wrong!" };
  }

  revalidateTag("productTyps");
  const data = await response.json();
  return { data, error: "" };
}

export async function editProductTypeAction({
  productType,
  id,
}: {
  productType: string;
  id: number;
}) {
  const token = getToken();
  if (!token) redirect("/login");
  const response = await fetch(
    `${process.env.API_URL}/api/producttypes/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name: productType }),
    }
  );
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the product type.");
    return { data: null, error: "Something went wrong!" };
  }
  revalidateTag("productTyps");
  // const data = await response.json();
  return { data: null, error: "" };
}

export async function deleteProductTypeAction(id: number) {
  const token = getToken();
  if (!token) redirect("/login");
  const response = await fetch(
    `${process.env.API_URL}/api/producttypes/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while deleting the ProductType.");
    return { data: null, error: "Something went wrong!" };
  }
  revalidateTag("productTyps");
  return { data: null, error: "" };
}

export async function getproducttypesCountAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(
    `${process.env.API_URL}/api/producttypes/count`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    console.log(
      "Something went wrong while trying to fetch product types count."
    );
    return {
      data: null,
      error: "Something went wrong while trying to fetch product types count.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}
