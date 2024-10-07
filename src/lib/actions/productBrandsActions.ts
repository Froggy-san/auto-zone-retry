"use server";

import { getToken } from "@lib/helper";

export async function getAllProductBrandsAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/productbrands`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
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
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(`${process.env.API_URL}/api/productbrands`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name: productBrand }),
  });
  if (!response.ok) {
    console.log("Something went wrong while creating the product brand.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return data;
}

export async function editProductBrandAction({
  productBrand,
  id,
}: {
  productBrand: string;
  id: string;
}) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(
    `${process.env.API_URL}/api/productbrands/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(productBrand),
    }
  );
  if (!response.ok) {
    console.log("Something went wrong while creating the product brand.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return data;
}

export async function deleteProductBrandAction(id: string) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(
    `${process.env.API_URL}/api/productbrands/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  if (!response.ok) {
    console.log("Something went wrong while deleting the ProductBrand.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return data;
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
