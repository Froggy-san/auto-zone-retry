"use server";

import { getToken } from "@lib/helper";
import { CarGeneration } from "@lib/types";
import { redirect } from "next/navigation";

export async function getAllCarGenerationsAction(page?: number) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  let query = `${process.env.API_URL}/api/CarGenerations`;
  if (page) query = query + `?PageNumber=${page}&PageSize=${10}`;

  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log(
      "Something went wrong while trying to fetch car generations data."
    );
    return {
      data: null,
      error: "Something went wrong while trying to fetch car generations data.",
    };
  }

  const carGenerationsData = await response.json();

  let countData;

  if (page) {
    const count = await getCarGenerationCountAction();
    countData = count.data;
  }

  return { data: { carGenerationsData, count: countData }, error: "" };
}

export async function createCarGenerationAction(generations: CarGeneration) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/cargenerations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(generations),
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the car generation.");
    return { data: null, error: "Something went wrong!" };
  }

  const data = await response.json();
  return { data, error: "" };
}

export async function editCarGenerationAction({
  generation,
  id,
}: {
  generation: { name: string; notes: string };
  id: number;
}) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(
    `${process.env.API_URL}/api/cargenerations/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(generation),
    }
  );
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the car generation.");
    return { data: null, error: "Something went wrong!" };
  }

  // const data = await response.json();
  // return data;

  return { data: null, error: "" };
}

export async function deleteCarGenerationAction(id: number) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(
    `${process.env.API_URL}/api/CarGenerations/${id}`,
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
    console.log("Something went wrong while creating the car generation.");
    return { data: null, error: "Something went wrong!" };
  }

  // const data = await response.json();
  // return data;

  return { data: null, error: "" };
}

export async function getCarGenerationCountAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(
    `${process.env.API_URL}/api/cargenerations/count`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    console.log(
      "Something went wrong while trying to fetch car generations data."
    );
    return {
      data: null,
      error: "Something went wrong while trying to fetch car generations data.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}
