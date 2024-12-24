"use server";

import { getToken } from "@lib/helper";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getAllProductBrandsAction() {
  // const token = getToken();

  // if (!token)
  //   return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/productbrands`, {
    method: "GET",

    next: {
      tags: ["productBrands"],
    },
  });

  if (!response.ok) {
    console.log(
      "Something went wrong while trying to fetch product brands data."
    );
    return {
      data: null,
      error: "Something went wrong while trying to fetch product brands data.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}

export async function createProductBrandAction(productBrand: string) {
  const token = getToken();
  if (!token) redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/productbrands`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name: productBrand }),
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the product brand.");
    return { data: null, error: "Something went wrong!" };
  }

  revalidateTag("productBrands");
  const data = await response.json();
  return { data, error: "" };
}

export async function editProductBrandAction({
  productBrand,
  id,
}: {
  productBrand: string;
  id: number;
}) {
  const token = getToken();
  if (!token) redirect("/login");
  const response = await fetch(
    `${process.env.API_URL}/api/productbrands/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name: productBrand }),
    }
  );
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the product brand.");
    return { data: null, error: "Something went wrong!" };
  }
  revalidateTag("productBrands");
  // const data = await response.json();
  return { data: null, error: "" };
}

export async function deleteProductBrandAction(id: number) {
  const token = getToken();
  if (!token) redirect("/login");
  const response = await fetch(
    `${process.env.API_URL}/api/productbrands/${id}`,
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
    console.log("Something went wrong while deleting the ProductBrand.");
    return { data: null, error: "Something went wrong!" };
  }

  revalidateTag("productBrands");
  return { data: null, error: "" };
}

export async function getProductBrandsCountAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(
    `${process.env.API_URL}/api/productbrands/count`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    console.log(
      "Something went wrong while trying to fetch product brands count."
    );
    return {
      data: null,
      error: "Something went wrong while trying to fetch product brands count.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}
