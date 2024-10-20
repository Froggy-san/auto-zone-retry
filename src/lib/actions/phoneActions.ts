"use server";

import { AUTH_TOEKN_NAME, PAGE_SIZE } from "@lib/constants";
import { getToken } from "@lib/helper";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface GetPhoneNumbersActionProps {
  number?: string;
  clientId?: number;
  pageNumber: string;
}

export async function getProductsAction({
  pageNumber,
  clientId,
  number,
}: GetPhoneNumbersActionProps) {
  //Product?PageNumber=1&PageSize=10
  // /api/Product?Name=test&CategoryId=1&ProductTypeId=1&ProductBrandId=1&IsAvailable=true&PageNumber=1&PageSize=10
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  let query = `${process.env.API_URL}/api/Clients?PageNumber=${pageNumber}&PageSize=${PAGE_SIZE}`;

  if (number) query = query + `&Number=${number}`;
  if (clientId) query = query + `&CategoryId=${clientId}`;

  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
    next: {
      // revalidate: 3600,
      tags: [
        "phoneNumbers",
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

  const data = await response.json();

  return { data, error: "" };
}

export async function getProductByIdAction(id: number) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(`${process.env.API_URL}/api/Phones/${id}`, {
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

export async function createPhoneNumAction(data: {
  number: string;
  clientId: number;
}) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/Phones`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  console.log(response);
  if (!response.ok) throw new Error("Had truble creating a phone number.");

  revalidateTag("phoneNumbers");
}

export async function editPhoneNumAction({
  id,
  number,
}: {
  id: number;
  number: string;
}) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/Phones/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ number }),
  });

  console.log(response);
  if (!response.ok) throw new Error("Had truble creating a phone number.");
}

export async function deletePhoneNumByIdAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token) throw new Error("You are not authorized to make this action.");

  const response = await fetch(`${process.env.API_URL}/api/Phones/${id}`, {
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
  revalidateTag("phoneNumbers");
}

export async function getPhonesCountAction({
  clientId,
  number,
}: {
  clientId: number;
  number: string;
}) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token)
    return {
      data: null,
      error: "You are not authorized to get the products count data.",
    };

  let query = `${process.env.API_URL}/api/Phones/count?`;

  if (clientId) query = query + `&ClientId=${clientId}`;

  if (number) query = query + `&Number=${number}`;

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