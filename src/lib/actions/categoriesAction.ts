"use server";

import { getToken } from "@lib/helper";
import { revalidatePath } from "next/cache";

export async function getAllCategoriesAction() {
  // await new Promise((res) => setTimeout(res, 9000));
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/categories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while trying to fetch categories data.");
    return {
      data: null,
      error: "Something went wrong while trying to fetch categories data.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}

export async function createCategoryAction(category: string) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(`${process.env.API_URL}/api/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name: category }),
  });
  if (!response.ok) {
    console.log("Something went wrong while creating the category.");
    throw new Error("Something went wrong!");
  }
  revalidatePath("/dashboard/insert-data");

  const data = await response.json();
  return data;
}

export async function editCategoryAction({
  category,
  id,
}: {
  category: string;
  id: string;
}) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(`${process.env.API_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(category),
  });
  if (!response.ok) {
    console.log("Something went wrong while creating the category.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return data;
}

export async function deleteCarAction(id: string) {
  const token = getToken();
  if (!token) throw new Error("You are not Authorized to make this action.");
  const response = await fetch(`${process.env.API_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    console.log("Something went wrong while deleting the category.");
    throw new Error("Something went wrong!");
  }

  const data = await response.json();
  return data;
}

export async function getCategoriesCountAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/categories/count`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while trying to fetch categories count.");
    return {
      data: null,
      error: "Something went wrong while trying to fetch categories count.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
}
