"use server";

import { getToken } from "@lib/helper";
import { revalidatePath, revalidateTag } from "next/cache";

interface GetRestockingProps {
  pageNumber?: string;
  minPricePerUnit?: string;
  maxPricePerUnit?: string;
  discount?: string;
  count?: string;
  isReturned?: boolean;
  productId?: number;
  productsRestockingBillId?: number;
}

export async function getRestockingBillsAction({
  pageNumber,
  minPricePerUnit,
  maxPricePerUnit,
  discount,
  count,
  isReturned,
  productId,
  productsRestockingBillId,
}: GetRestockingProps) {
  //   await new Promise((res) => setTimeout(res, 9000));
  const token = getToken();

  let query = `${process.env.API_URL}/api/ProductsRestockingBills?`;

  if (pageNumber) query = query + `&pageNumber=${pageNumber}`;
  if (minPricePerUnit) query = query + `&minPricePerUnit=${minPricePerUnit}`;
  if (maxPricePerUnit) query = query + `&maxPricePerUnit=${maxPricePerUnit}`;
  if (discount) query = query + `&discount=${discount}`;
  if (count) query = query + `&count=${count}`;
  if (isReturned) query = query + `&isReturned=${isReturned}`;
  if (productId) query = query + `&productId=${productId}`;
  if (productsRestockingBillId)
    query = query + `&productsRestockingBillId=${productsRestockingBillId}`;

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {
      tags: ["restockingBills"],
    },
  });

  if (!response.ok) {
    console.log(
      "Something went wrong while trying to fetch ProductsRestockingBills data."
    );
    return {
      data: null,
      error:
        "Something went wrong while trying to fetch ProductsRestockingBills data.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}

export async function createRestockingBillAction(shopName: string) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(
    `${process.env.API_URL}/api/ProductsRestockingBills`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({ shopName }),
    }
  );
  if (!response.ok) {
    console.log("Something went wrong while creating the category.");
    throw new Error("Something went wrong!");
  }
  //   revalidatePath("/dashboard/insert-data");
  revalidateTag("restockingBills");

  const data = await response.json();
  return data;
}

interface EditProps {
  restockingToEdit: { shopName: string; dateOfOrder: string };
  id: string;
}

export async function editRestockingBillAction({
  restockingToEdit,
  id,
}: EditProps) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(
    `${process.env.API_URL}/api/ProductsRestockingBills/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(restockingToEdit),
    }
  );
  if (!response.ok) {
    console.log("Something went wrong while creating the category.");
    throw new Error("Something went wrong!");
  }

  revalidateTag("restockingBills");
  const data = await response.json();
  return data;
}

export async function deleteRestockingBillAction(id: string) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(
    `${process.env.API_URL}/api/ProductsRestockingBills/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  if (!response.ok) {
    console.log("Something went wrong while deleting the category.");
    throw new Error("Something went wrong!");
  }
  revalidateTag("restockingBills");
  const data = await response.json();
  return data;
}

export async function getProductsRestockingBillsCountAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(
    `${process.env.API_URL}/api/ProductsRestockingBills/count`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    console.log(
      "Something went wrong while trying to fetch ProductsRestockingBills count."
    );
    return {
      data: null,
      error:
        "Something went wrong while trying to fetch ProductsRestockingBills count.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}
