"use server";

import { PAGE_SIZE } from "@lib/constants";
import { getToken } from "@lib/helper";
import { CreateService } from "@lib/types";
import { revalidatePath, revalidateTag } from "next/cache";

interface GetRestockingProps {
  pageNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  carId?: string;
  serviceStatusId?: string;
  minPrice?: string;
  maxPrice?: string;
}

export async function getRestockingBillsAction({
  pageNumber,
  dateFrom,
  dateTo,
  clientId,
  carId,
  serviceStatusId,
  minPrice,
  maxPrice,
}: GetRestockingProps) {
  //   await new Promise((res) => setTimeout(res, 9000));
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  let query = `${process.env.API_URL}/api/Services?&PageSize=${PAGE_SIZE}`;

  if (pageNumber) query = query + `&PageNumber=${pageNumber}`;

  if (dateFrom) query = query + `&dateFrom=${dateFrom}`;

  if (dateTo) query = query + `&dateTo=${dateTo}`;

  if (clientId) query = query + `&clientId=${clientId}`;

  if (carId) query = query + `&carId=${carId}`;

  if (serviceStatusId) query = query + `&serviceStatusId=${serviceStatusId}`;

  if (minPrice) query = query + `&minPrice=${minPrice}`;

  if (maxPrice) query = query + `&maxPrice=${maxPrice}`;

  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {
      tags: ["services"],
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while trying to fetch Services data.");
    return {
      data: null,
      error: "Something went wrong while trying to fetch Services data.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}

export async function createServiceAction(service: CreateService) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(`${process.env.API_URL}/api/Services`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(service),
  });
  if (!response.ok) {
    console.log("Something went wrong while creating the a restocking bill.");
    throw new Error("Something went wrong while create restocking bill");
  }

  //   revalidatePath("/dashboard/insert-data");
  revalidateTag("services");

  //   const data = await response.json();
  //   return data;
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
  const response = await fetch(`${process.env.API_URL}/api/Services/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(restockingToEdit),
  });
  if (!response.ok) {
    console.log("Something went wrong while creating the a restocking bill.");
    throw new Error("Something went wrong!");
  }

  revalidateTag("restockingBills");
  // const data = await response.json();
  // return data;
}

export async function deleteRestockingBillAction(id: string) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(`${process.env.API_URL}/api/Services/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    console.log("Something went wrong while deleting the a restocking bill.");
    throw new Error("Something went wrong!");
  }
  revalidateTag("restockingBills");
  // const data = await response.json();
  // return data;
}

export async function getServicesCountAction({
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

  let query = `${process.env.API_URL}/api/Services/count?`;

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
    console.log("Something went wrong while trying to fetch Services count.");
    return {
      data: null,
      error: "Something went wrong while trying to fetch Services count.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}
