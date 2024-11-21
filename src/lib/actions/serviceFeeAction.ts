"use server";

import { PAGE_SIZE } from "@lib/constants";
import { getToken } from "@lib/helper";
import { EditServiceFee } from "@lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface GetProps {
  pageNumber?: string;
  price?: string;
  discount?: string;
  isReturned?: string;
  notes?: string;
  categoryId?: string;
  serviceId?: string;
}

export async function getServiceFeesAction({
  pageNumber,
  price,
  discount,
  isReturned,
  notes,
  categoryId,
  serviceId,
}: GetProps) {
  //   await new Promise((res) => setTimeout(res, 9000));
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  let query = `${process.env.API_URL}/api/ServicesFee?&PageSize=${PAGE_SIZE}`;

  if (pageNumber) query = query + `&PageNumber=${pageNumber}`;

  if (price) query = query + `&price=${price}`;

  if (discount) query = query + `&discount=${discount}`;

  if (isReturned) query = query + `&isReturned=${isReturned}`;

  if (notes) query = query + `&notes=${notes}`;

  if (categoryId) query = query + `&categoryId=${categoryId}`;

  if (serviceId) query = query + `&serviceId=${serviceId}`;

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
    console.log(
      "Something went wrong while trying to fetch Service fees data."
    );
    return {
      data: null,
      error: "Something went wrong while trying to fetch Service fees data.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}

// The service fees are created in the service actions.

interface CreateProps {
  categoryId: number;
  price: number;
  discount: number;
  notes: string;
  serviceId: number;
}

export async function createServiceFeeAction(newFee: CreateProps) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/ServicesFee`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(newFee),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error((await response.json()).message);
    }
    console.log("Something went wrong while creating the a restocking bill.");
    throw new Error("Something went wrong while create restocking bill");
  }

  //   revalidatePath("/dashboard/insert-data");
  revalidateTag("services");
}

export async function getServiceFeesById(id: string) {
  const token = getToken();
  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/ServicesFee/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    console.log("Something went wrong while deleting the a restocking bill.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();

  return { data: data, error: "" };
}

export async function editServiceFeeAction({
  serviceFee,
  id,
}: {
  serviceFee: EditServiceFee;
  id: number;
}) {
  const token = getToken();
  if (!token) {
    return redirect("/login");

    // throw new Error("You are not Authorized to make this action.");
  }
  const response = await fetch(`${process.env.API_URL}/api/ServicesFee/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(serviceFee),
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error((await response.json()).message);
    }
    console.log("Something went wrong while editing the service fee.");
    throw new Error("Something went wrong while editing the service fee.");
  }

  revalidateTag("services");
  // const data = await response.json();
  // return data;
}

export async function deleteServiceFeeAction(id: string) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/ServicesFee/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error((await response.json()).message);
    }
    console.log("Something went wrong while deleting the a restocking bill.");
    throw new Error("Something went wrong!");
  }
  revalidateTag("services");
}

export async function getServiceFeesCountAction({
  price,
  discount,
  isReturned,
  notes,
  categoryId,
  serviceId,
}: {
  price?: string;
  discount?: string;
  isReturned?: string;
  notes?: string;
  categoryId?: string;
  serviceId?: string;
}) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  let query = `${process.env.API_URL}/api/ServicesFee?&PageSize=${PAGE_SIZE}`;

  if (price) query = query + `&price=${price}`;

  if (discount) query = query + `&discount=${discount}`;

  if (isReturned) query = query + `&isReturned=${isReturned}`;

  if (notes) query = query + `&notes=${notes}`;

  if (categoryId) query = query + `&categoryId=${categoryId}`;

  if (serviceId) query = query + `&serviceId=${serviceId}`;

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
