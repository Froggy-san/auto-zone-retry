"use server";

import { getToken } from "@lib/helper";
import { CarModel, CreateCarModel } from "@lib/types";
import { redirect } from "next/navigation";

export async function getAllCarModelsAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/carmodels`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while trying to fetch cars info data.");
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
  if (!token) return redirect("/login");
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
      throw new Error((await response.json()).message);
    }
    console.log("Something went wrong while creating the car model.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return data;
}

export async function editCarModelAction({
  carModel,
  id,
}: {
  carModel: CarModel;
  id: string;
}) {
  const token = getToken();
  if (!token) return redirect("/login");
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
      throw new Error((await response.json()).message);
    }
    console.log("Something went wrong while creating the car model.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return data;
}

export async function deleteCarModelAction(id: string) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/carmodels/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    if (response.status === 409) {
      throw new Error((await response.json()).message);
    }
    console.log("Something went wrong while creating the car model.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return data;
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
    console.log("Something went wrong while trying to fetch car models count.");
    return {
      data: null,
      error: "Something went wrong while trying to fetch car models count.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}
