"use server";
import { getToken } from "@lib/helper";
import { CreateCarMaker } from "@lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getAllCarMakersAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/carmakers`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while trying to fetch cars maker data.");
    return {
      data: null,
      error: "Something went wrong while trying to fetch cars maker data.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}

export async function createCarMakerAction(formData: FormData) {
  const token = getToken();
  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/carmakers`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    // console.log("Something went wrong while creating the car maker.");
    return {
      data: null,
      error: "Something went wrong while creating the car maker.",
    };
  }

  revalidatePath("/dashboard/insert-data");
  const data = await response.json();
  return { data, error: "" };
}

export async function editCarMakerAction({
  carMaker,
  id,
}: {
  carMaker: CreateCarMaker;
  id: string;
}) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/carmakers/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(carMaker),
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the car maker.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return { data, error: "" };
}

export async function deleteCarMakerAction(id: string) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/carmakers/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the car maker.");
    return { data: null, error: "Something went wrong!" };
  }

  const data = await response.json();
  return { data, error: "" };
}

export async function getCarMakerCountAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/carmakers/count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while trying to fetch car makers count.");
    return {
      data: null,
      error: "Something went wrong while trying to fetch car makers count.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}
