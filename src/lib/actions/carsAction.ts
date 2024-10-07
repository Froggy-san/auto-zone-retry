"use server";

import { getToken } from "@lib/helper";
import { Car } from "@lib/types";

export async function getAllCarsAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/cars`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while trying to fetch cars data.");
    return {
      data: null,
      error: "Something went wrong while trying to fetch cars data.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}

export async function createCarAction(Car: Car) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(`${process.env.API_URL}/api/cars`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(Car),
  });
  if (!response.ok) {
    console.log("Something went wrong while creating the car.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return data;
}

export async function editCarAction({ Car, id }: { Car: Car; id: string }) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(`${process.env.API_URL}/api/cars/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(Car),
  });
  if (!response.ok) {
    console.log("Something went wrong while creating the car.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return data;
}

export async function deleteCarAction(id: string) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(`${process.env.API_URL}/api/cars/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    console.log("Something went wrong while deleting the car.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return data;
}

export async function getCarsCountAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/cars/count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while trying to fetch cars count.");
    return {
      data: null,
      error: "Something went wrong while trying to fetch cars count.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}
