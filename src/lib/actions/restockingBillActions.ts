"use server";

import { PAGE_SIZE } from "@lib/constants";
import { getToken } from "@lib/helper";
import { red } from "@mui/material/colors";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface GetRestockingProps {
  pageNumber?: string;
  name?: string;
  shopName?: string;
  dateOfOrderFrom?: string;
  dateOfOrderTo?: string;
  minTotalPrice?: string;
  maxTotalPrice?: string;
}

export async function getRestockingBillsAction({
  pageNumber,
  name,
  shopName,
  dateOfOrderFrom,
  dateOfOrderTo,
  minTotalPrice,
  maxTotalPrice,
}: GetRestockingProps) {
  //   await new Promise((res) => setTimeout(res, 9000));
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  let query = `${process.env.API_URL}/api/ProductsRestockingBills?&PageSize=${PAGE_SIZE}`;

  if (pageNumber) query = query + `&PageNumber=${pageNumber}`;

  if (shopName) query = query + `&shopName=${shopName}`;

  if (dateOfOrderFrom) query = query + `&dateOfOrderFrom=${dateOfOrderFrom}`;

  if (dateOfOrderTo) query = query + `&dateOfOrderTo=${dateOfOrderTo}`;

  if (minTotalPrice) query = query + `&minTotalPrice=${minTotalPrice}`;

  if (maxTotalPrice) query = query + `&maxTotalPrice=${maxTotalPrice}`;

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
  if (!token) return redirect("/login");
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
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the a restocking bill.");
    return { data: null, error: "Something went wrong!" };
  }

  //   revalidatePath("/dashboard/insert-data");

  const data = await response.json();
  revalidateTag("restockingBills");

  return { data, error: "" };
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
  if (!token) return redirect("/login");
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
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the a restocking bill.");
    return { data: null, error: "Something went wrong!" };
  }

  revalidateTag("restockingBills");
  // const data = await response.json();
  // return data;

  return { data: null, error: "" };
}

export async function deleteRestockingBillAction(id: string) {
  const token = getToken();
  if (!token) return redirect("/login");
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
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while deleting the a restocking bill.");
    return { data: null, error: "Something went wrong!" };
  }
  revalidateTag("restockingBills");
  // const data = await response.json();
  // return data;

  return { data: null, error: "" };
}

export async function getProductsRestockingBillsCountAction({
  shopName,
  dateOfOrderFrom,
  dateOfOrderTo,
  maxTotalPrice,
  minTotalPrice,
}: {
  shopName?: string;
  dateOfOrderFrom?: string;
  dateOfOrderTo?: string;
  minTotalPrice?: string;
  maxTotalPrice?: string;
}) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  let query = `${process.env.API_URL}/api/ProductsRestockingBills/count?`;

  if (shopName) query = query + `&shopName=${shopName}`;

  if (dateOfOrderFrom) query = query + `&dateOfOrderFrom=${dateOfOrderFrom}`;

  if (dateOfOrderTo) query = query + `&dateOfOrderTo=${dateOfOrderTo}`;

  if (minTotalPrice) query = query + `&minTotalPrice=${minTotalPrice}`;

  if (maxTotalPrice) query = query + `&maxTotalPrice=${maxTotalPrice}`;
  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
