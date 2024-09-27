"use server";

import { AUTH_TOEKN_NAME } from "@lib/constants";
import { Product } from "@lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getProductsAction() {
  //Product?PageNumber=1&PageSize=10
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) return null;

  console.log(token, "token");
  const response = await fetch(`${process.env.API_URL}/api/Product`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return null;
  }

  const data = await response.json();
  console.log(data, "RESPONSE DATA");
  return data;
}

export async function createProductAction(product: Product) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/Product`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) throw new Error("Had truble creating a product.");

  console.log(response);
  const data = await response.json();
  return data;
}
