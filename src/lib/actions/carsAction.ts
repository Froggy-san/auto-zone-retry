"use server";
import { getToken } from "@lib/helper";
import { Car, CarImage, CarItem } from "@lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getClienttByIdAction } from "./clientActions";
import { PAGE_SIZE } from "@lib/constants";
import { red } from "@mui/material/colors";

interface GetCarsProps {
  color?: string;
  plateNumber?: string;
  chassisNumber?: string;
  motorNumber?: string;
  clientId?: string;
  carInfoId?: string;
  pageNumber?: string;
}

export async function getCarsAction({
  color,
  chassisNumber,
  motorNumber,
  clientId,
  carInfoId,
  plateNumber,
  pageNumber,
}: GetCarsProps) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  let query = `${process.env.API_URL}/api/Cars?&PageSize=${PAGE_SIZE}`;

  if (pageNumber) query = query + `&pageNumber=${pageNumber}`;
  if (color) query = query + `&color=${color}`;
  if (plateNumber) query = query + `&PlateNumber=${plateNumber}`;
  if (chassisNumber) query = query + `&ChassisNumber=${chassisNumber}`;
  if (motorNumber) query = query + `&MotorNumber=${motorNumber}`;
  if (carInfoId) query = query + `&carGenerationId=${carInfoId}`;
  if (clientId) query = query + `&clientId=${clientId}`;

  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {
      tags: ["cars"],
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

interface CarCreatedProps {
  color: string;
  plateNumber: string;
  chassisNumber: string;
  motorNumber: string;
  notes: string;
  clientId: number;
  carGenerationId: number;
}

export async function createCarAction({
  car,
  images,
}: {
  car: CarCreatedProps;
  images: FormData[];
}) {
  const token = getToken();

  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/cars`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(car),
  });

  if (!response.ok) {
    console.log("Something went wrong while creating the car.");
    return {
      data: null,
      error: "Something went wrong while creating the car.",
    };
  }

  const { id } = await response.json();

  console.log(id, "CAR IDDD");

  if (images.length) {
    const upload = images.map((image) => {
      image.append("carId", id);

      return createCarImageAction(image);
    });

    await Promise.all(upload);
  }

  revalidateTag("cars");
  // revalidateTag("carCount");
  return { data: id, error: "" };
}

export async function getCarByIdAction(id: string) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  // const response = await fetch(`${process.env.API_URL}/api/Cars/${id}`, {
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //     // "Content-type": "application/json",
  //   },
  // });

  // if (!response.ok) {
  //   console.log("Something went wrong while grabbing the car.");

  //   return {
  //     data: null,
  //     error: "Something went wrong while grabbing the car.",
  //   };
  // }

  // const car = (await response.json()) as CarItem;

  const { data, error } = await getClienttByIdAction(Number(id));

  return { data, error: "" };
}

export async function editCarAction({
  car,
  id,
  imagesToUpload,
  imagesToDelete,
  isEqual,
}: {
  car: Car;
  id: string;
  imagesToUpload: FormData[];
  imagesToDelete: CarImage[];
  isEqual: boolean;
}) {
  const {
    plateNumber,
    motorNumber,
    chassisNumber,
    carGenerationId,
    notes,
    color,
  } = car;
  const token = getToken();
  if (!token) return redirect("/login");

  if (!isEqual) {
    const response = await fetch(`${process.env.API_URL}/api/cars/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        plateNumber,
        motorNumber,
        chassisNumber,
        carGenerationId,
        notes,
        color,
      }),
    });
    if (!response.ok) {
      if (response.status === 409) {
        return { data: null, error: (await response.json()).message };
      }
      console.log("Something went wrong while creating the car.");
      return {
        data: null,
        error: "Something went wrong while creating the car.",
      };
    }
  }

  if (imagesToUpload.length) {
    const upload = imagesToUpload.map((image) => {
      image.append("carId", id);

      return createCarImageAction(image);
    });

    await Promise.all(upload);
  }

  if (imagesToDelete.length) {
    const deleteImages = imagesToDelete.map((deletedImage) =>
      deleteCarImageAction(deletedImage.id)
    );

    await Promise.all(deleteImages);
  }

  revalidateTag("cars");
  revalidatePath(`/grage/${id}`);

  return { data: null, error: "" };
}

export async function deleteCarAction(id: string) {
  const token = getToken();
  if (!token) return redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/cars/${id}`, {
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
    console.log("Something went wrong while deleting the car.");
    return {
      data: null,
      error: "Something went wrong while deleting the car.",
    };
  }

  revalidateTag("cars");
  // revalidateTag("carCount");

  return { data: null, error: "" };
}
interface GragePaginationProps {
  color?: string;
  plateNumber?: string;
  chassisNumber?: string;
  motorNumber?: string;
  clientId?: string;
  carInfoId?: string;
}

export async function getCarsCountAction({
  color,
  plateNumber,
  motorNumber,
  chassisNumber,
  clientId,
  carInfoId,
}: GragePaginationProps) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  let query = `${process.env.API_URL}/api/Cars/count?`;

  if (color) query = query + `&color=${color}`;
  if (plateNumber) query = query + `&PlateNumber=${plateNumber}`;
  if (chassisNumber) query = query + `&ChassisNumber=${chassisNumber}`;
  if (motorNumber) query = query + `&MotorNumber=${motorNumber}`;
  if (carInfoId) query = query + `&CarInfoId=${carInfoId}`;
  if (clientId) query = query + `&ClientId=${clientId}`;

  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // next: {
    //   tags: ["carCount"],
    // },
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

/// PRODUCT IMAGES.

export async function getProductsImageAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = await response.json();

  return { data, error: "" };
}

export async function createCarImageAction(formData: FormData) {
  const token = getToken();

  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/CarImages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    console.log("Had truble creating a product.");
    throw new Error("Had truble creating a product.");
  }
}

export async function deleteCarImageAction(imageId: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token) return redirect("/login");

  const response = await fetch(
    `${process.env.API_URL}/api/CarImages/${imageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  return { data: null, error: "" };
}

/// WTF IS THIS ?

export async function getProductsImagesMainAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/main/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = await response.json();

  console.log(data, "DATA");
  return { data, error: "" };
}

export async function deleteProductsImageMainAction(id: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/main/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = await response.json();

  console.log(data, "DATA");
  return { data, error: "" };
}
