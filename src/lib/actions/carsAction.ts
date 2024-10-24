"use server";

import { getToken } from "@lib/helper";
import { Car, CreateCar } from "@lib/types";

interface GetCarsProps {
  color?: string;
  plateNumber?: string;
  chassisNumber?: string;
  motorNumber?: string;
  clientId?: number;
  carInfoId?: number;
  pageNumber?: number;
}

export async function getAllCarsAction({
  color,
  chassisNumber,
  motorNumber,
  clientId,
  carInfoId,
  pageNumber,
}: GetCarsProps) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  let query = `${process.env.API_URL}/api/cars`;

  if (pageNumber) query = query + `pageNumber=${pageNumber}`;
  if (color) query = query + `color=${color}`;
  if (chassisNumber) query = query + `ChassisNumber=${chassisNumber}`;
  if (motorNumber) query = query + `MotorNumber=${motorNumber}`;
  if (carInfoId) query = query + `CarInfoId=${carInfoId}`;
  if (clientId) query = query + `clientId=${clientId}`;

  const response = await fetch(query, {
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

export async function createCarAction(Car: CreateCar) {
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
