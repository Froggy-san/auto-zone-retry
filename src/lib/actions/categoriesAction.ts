"use server";

import { getToken } from "@lib/helper";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getAllCategoriesAction() {
  // await new Promise((res) => setTimeout(res, 9000));
  // const token = getToken();

  // if (!token)
  //   return { data: null, error: "You are not authorized to make this action." };
  const response = await fetch(`${process.env.API_URL}/api/Categories`, {
    method: "GET",
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
    next: {
      tags: ["categories"],
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
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name: category }),
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }

    console.log("Something went wrong while updating the category.");
    return {
      data: null,
      error: "Something went wrong while updating the category.",
    };
  }
  // revalidatePath("/dashboard/insert-data");
  revalidateTag("categories");
  const data = await response.json();
  return { data, error: "" };
}

export async function editCategoryAction({
  category,
  id,
}: {
  category: string;
  id: number;
}) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/Categories/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name: category }),
  });

  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }

    return {
      data: null,
      error: "Something went wrong while updating the category.",
    };
  }

  // const data = await response.json();
  revalidateTag("categories");
  return { data: null, error: "" };
}

export async function deleteCategoryAction(id: number) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while updating the category.");
    return {
      data: null,
      error: "Something went wrong while updating the category.",
    };
  }
  revalidateTag("categories");
  // const data = await response.json();
  return { data: null, error: "" };
}

export async function deleteCarAction(id: string) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/categories/${id}`, {
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
    console.log("Something went wrong while deleting the category.");
    return {
      data: null,
      error: "Something went wrong while deleting the category.",
    };
  }

  const data = await response.json();
  return { data, error: "" };
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
