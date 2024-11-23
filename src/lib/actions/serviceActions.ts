"use server";

import { PAGE_SIZE } from "@lib/constants";
import { getToken } from "@lib/helper";
import { CreateService } from "@lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

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

export async function getServicesAction({
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
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/Services`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(service),
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the a restocking bill.");
    return { data: null, error: "Something went wrong!" };
  }

  revalidateTag("services");

  return { data: null, error: "" };
}

interface EditProps {
  id: number;
  date?: string;
  clientId?: number;
  carId?: number;
  serviceStatusId?: number;
  note?: string;
}

export async function editServiceAction(serivceToEdit: EditProps) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(
    `${process.env.API_URL}/api/Services/${serivceToEdit.id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(serivceToEdit),
    }
  );
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the a restocking bill.");
    return { data: null, error: "Something went wrong!" };
  }

  revalidateTag("service");
  // const data = await response.json();
  // return data;

  return { data: null, error: "" };
}

export async function deleteServiceAction(id: string) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/Services/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while deleting the a restocking bill.");
    return { data: null, error: "Something went wrong!" };
  }
  revalidateTag("services");

  return { data: null, error: "" };
}

export async function getServicesCountAction({
  dateFrom,
  dateTo,
  clientId,
  carId,
  minPrice,
  maxPrice,
  serviceStatusId,
}: {
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  carId?: string;
  minPrice?: string;
  maxPrice?: string;
  serviceStatusId?: string;
}) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  let query = `${process.env.API_URL}/api/Services/count?`;

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

export async function serviceDownloadPdf(id: number) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const res = await fetch(`${process.env.API_URL}/api/Services/pdf/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorMessage =
      res.status === 409
        ? (await res.json()).message
        : "Faild to download service receipt as a PDF";

    return { data: null, error: errorMessage };
  }

  const data = await res.body?.getReader().read();
  // const blob = await res.blob();
  // console.log(blob, "PDFFFF");
  const pdf = data ? JSON.stringify([data.value]) : null;

  // console.log(pdf, "AAAAWWWWWWWWW ");
  return { data: pdf, error: null };
}
