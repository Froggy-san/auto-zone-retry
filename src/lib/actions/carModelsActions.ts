"use server";

import { PILL_SIZE } from "@lib/constants";
import { getToken } from "@lib/helper";
import { CarModel, CreateCarModel } from "@lib/types";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getAllCarModelsAction(pageNumber?: number) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  let query = `${process.env.API_URL}/api/carmodels`;
  if (pageNumber)
    query = query + `?PageSize=${PILL_SIZE}&PageNumber=${pageNumber}`;
  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ["carModels"] },
  });

  if (!response.ok) {
    return {
      data: null,
      error: "Something went wrong while trying to fetch cars info data.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}

export async function createCarModelAction(carModel: CreateCarModel) {
  const token = getToken();
  if (!token) redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/carmodels`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(carModel),
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }

    return {
      data: null,
      error: "Something went wrong while creating the car model.",
    };
  }

  revalidateTag("carModels");

  return { data: null, error: "" };
}

export async function editCarModelAction({
  carModel,
  id,
}: {
  carModel: { name: string; notes: string };
  id: number;
}) {
  const token = getToken();
  if (!token) redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/carmodels/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(carModel),
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }

    return {
      data: null,
      error: "Something went wrong while creating the car model.",
    };
  }

  revalidateTag("carModels");
}

export async function deleteCarModelAction(id: number) {
  const token = getToken();
  if (!token) redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/carmodels/${id}`, {
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

    return {
      data: null,
      error: "Something went wrong while creating the car model.",
    };
  }

  // const data = await response.json();
  // return data;
  revalidateTag("carModels");
}

export async function getCarModelsCountAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/carmodels/count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return {
      data: null,
      error: "Something went wrong while trying to fetch car models count.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}
