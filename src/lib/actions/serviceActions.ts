"use server";

import { PAGE_SIZE } from "@lib/constants";
import { getToken } from "@lib/helper";
import { CreateService, Service } from "@lib/types";
import { createClient } from "@utils/supabase/server";
import { formatDate, format } from "date-fns";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

interface GetRestockingProps {
  pageNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  carId?: string;
  serviceStatusId?: string;
  minPrice?: string;
  maxPrice?: string;
}

export async function getServicesAction({
  pageNumber,
  dateFrom,
  dateTo,
  clientId,
  carId,
  serviceStatusId,
  minPrice,
  maxPrice,
}: GetRestockingProps) {
  const from = (Number(pageNumber) - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  //  const queryDate = subDays(new Date(), numDays).toISOString();
  // Base query

  let query = `${supabaseUrl}/rest/v1/services?select=*,servicesFee(*),productsToSell(*,product(*,productImages(*))),cars(*,carImages(*)),clients(*),serviceStatuses(*)&order=created_at.desc`;

  // Date filters
  if (dateFrom) query += `&created_at=gte.${new Date(dateFrom).toISOString()}`;
  if (dateTo) query += `&created_at=lte.${new Date(dateTo).toISOString()}`;

  // Other filters
  if (clientId) query += `&clientId=eq.${clientId}`;
  if (carId) query += `&carId=eq.${carId}`;
  if (serviceStatusId) query += `&serviceStatusId=eq.${serviceStatusId}`;
  if (minPrice) query += `&totalPrice=gte.${minPrice}`;
  if (maxPrice) query += `&totalPrice=lte.${maxPrice}`;

  const headers = {
    apikey: `${supabaseKey}`,
    Authorization: `Bearer ${supabaseKey}`,
    Prefer: "count=exact",
  } as Record<string, string>;

  if (!pageNumber) {
    headers.Range = `${from}-${to}`;
  }

  const response = await fetch(query, {
    method: "GET",
    headers,
    next: {
      tags: ["services"],
    },
  });

  if (!response.ok) {
    const error =
      (await response.json()).message ||
      "Something went wrong while trying to fetch Services data.";
    console.log(error);

    return {
      data: null,
      error,
    };
  }
  const count = response.headers.get("content-range")?.split("/")[1] || 0;
  const data: Service[] = await response.json();

  const services = data.map((service) => {
    // Safely sort servicesFee (if it exists)
    service.servicesFee?.sort((a, b) => a.id - b.id);
    service.productsToSell?.sort((a, b) => a.id - b.id);
    // Sorting using Date-fns.
    // service.productsToSell?.sort((a, b) =>
    //   compareAsc(parseISO(a.created_at), parseISO(b.created_at))
    // );
    //Sorting by date.
    // service.productsToSell?.sort(
    //   (a, b) =>
    //     new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    // );

    return {
      ...service,
      created_at: format(new Date(service.created_at), "yyyy-MM-dd"),
    };
  });
  return { data: { data: services, count }, error: "" };
}

interface ByIdProps {
  id: number;
  select?: string;
}
export async function getServiceById(id: number, select = "*") {
  const supabase = await createClient();
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("id", id);
  if (error) return { data: null, error: error.message };
  // if (!services) return { data: null, error: "Failed to grab data." };
  return { data: services[0], error: "" };
}

export async function createServiceAction(
  service: CreateService & { totalPrice: number }
) {
  const serviceData = {
    clientId: service.clientId,
    carId: service.carId,
    serviceStatusId: service.serviceStatusId,
    kmCount: "",
    note: service.note,
    totalPrice: service.totalPrice,
  };
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .insert([serviceData])
    .select();

  if (error) return { data: null, error: error.message };

  const { id } = data[0];

  let soldError = "";
  let feesError = "";
  if (service.productsToSell.length) {
    const soldProducts = service.productsToSell.map((pro) => {
      return {
        ...pro,
        serviceId: id,
        totalPriceAfterDiscount: (pro.pricePerUnit - pro.discount) * pro.count,
      };
    });
    const { error } = await supabase
      .from("productsToSell")
      .insert(soldProducts);

    if (error) soldError = error.message;
  }

  if (service.serviceFees.length) {
    const fees = service.serviceFees.map((fee) => {
      return {
        ...fee,
        serviceId: id,
        totalPriceAfterDiscount: fee.price - fee.discount,
      };
    });
    const { error } = await supabase.from("servicesFee").insert(fees);
    if (error) feesError = error.message;
  }

  revalidateTag("services");
  if (soldError || feesError)
    return { data, error: `${feesError},${soldError}` };
  return { data, error: "" };
}

interface EditProps {
  id: number;
  created_at?: string;
  clientId?: number;
  carId?: number;
  serviceStatusId?: number;
  note?: string;
  totalPrice?: number;
}

export async function editServiceAction(serivceToEdit: EditProps) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .update(serivceToEdit)
    .eq("id", serivceToEdit.id);

  if (error) return { data: null, error: error.message };
  console.log("error", error);
  revalidateTag("service");
  // const data = await response.json();
  // return data;

  return { data: null, error: "" };
}

export async function deleteServiceAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) return { data: null, error: error.message };
  revalidateTag("services");

  return { data: null, error: "" };
}

export async function getServicesCountAction({
  dateFrom,
  dateTo,
  clientId,
  carId,
  minPrice,
  maxPrice,
  serviceStatusId,
}: {
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  carId?: string;
  minPrice?: string;
  maxPrice?: string;
  serviceStatusId?: string;
}) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  let query = `${process.env.API_URL}/api/Services/count?`;

  if (dateFrom) query = query + `&dateFrom=${dateFrom}`;

  if (dateTo) query = query + `&dateTo=${dateTo}`;

  if (clientId) query = query + `&clientId=${clientId}`;

  if (carId) query = query + `&carId=${carId}`;

  if (serviceStatusId) query = query + `&serviceStatusId=${serviceStatusId}`;

  if (minPrice) query = query + `&minPrice=${minPrice}`;

  if (maxPrice) query = query + `&maxPrice=${maxPrice}`;

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

export async function serviceDownloadPdf(id: number) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const res = await fetch(`${process.env.API_URL}/api/Services/pdf/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorMessage =
      res.status === 409
        ? (await res.json()).message
        : "Faild to download service receipt as a PDF";

    return { data: null, error: errorMessage };
  }

  const data = await res.body?.getReader().read();
  // const blob = await res.blob();
  // console.log(blob, "PDFFFF");
  const pdf = data ? JSON.stringify([data.value]) : null;

  // console.log(pdf, "AAAAWWWWWWWWW ");
  return { data: pdf, error: null };
}

/*

"use server";

import { PAGE_SIZE } from "@lib/constants";
import { getToken } from "@lib/helper";
import { CreateService } from "@lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

interface GetRestockingProps {
  pageNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  carId?: string;
  serviceStatusId?: string;
  minPrice?: string;
  maxPrice?: string;
}

export async function getServicesAction({
  pageNumber,
  dateFrom,
  dateTo,
  clientId,
  carId,
  serviceStatusId,
  minPrice,
  maxPrice,
}: GetRestockingProps) {
  //   await new Promise((res) => setTimeout(res, 9000));
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };
  let query = `${process.env.API_URL}/api/Services?`;

  if (pageNumber)
    query = query + `&PageSize=${PAGE_SIZE}&PageNumber=${pageNumber}`;

  if (dateFrom) query = query + `&dateFrom=${dateFrom}`;

  if (dateTo) query = query + `&dateTo=${dateTo}`;

  if (clientId) query = query + `&clientId=${clientId}`;

  if (carId) query = query + `&carId=${carId}`;

  if (serviceStatusId) query = query + `&serviceStatusId=${serviceStatusId}`;

  if (minPrice) query = query + `&minPrice=${minPrice}`;

  if (maxPrice) query = query + `&maxPrice=${maxPrice}`;

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
    console.log("Something went wrong while trying to fetch Services data.");

    return {
      data: null,
      error: "Something went wrong while trying to fetch Services data.",
    };
  }

  const data = await response.json();

  return { data, error: "" };
}

export async function createServiceAction(service: CreateService) {
  const token = getToken();
  if (!token) redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/Services`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(service),
  });
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the a restocking bill.");
    return { data: null, error: "Something went wrong!" };
  }

  revalidateTag("services");

  return { data: null, error: "" };
}

interface EditProps {
  id: number;
  date?: string;
  clientId?: number;
  carId?: number;
  serviceStatusId?: number;
  note?: string;
}

export async function editServiceAction(serivceToEdit: EditProps) {
  const token = getToken();
  if (!token) redirect("/login");
  const response = await fetch(
    `${process.env.API_URL}/api/Services/${serivceToEdit.id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(serivceToEdit),
    }
  );
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    console.log("Something went wrong while creating the a restocking bill.");
    return { data: null, error: "Something went wrong!" };
  }

  revalidateTag("service");
  // const data = await response.json();
  // return data;

  return { data: null, error: "" };
}

export async function deleteServiceAction(id: string) {
  const token = getToken();
  if (!token) redirect("/login");
  const response = await fetch(`${process.env.API_URL}/api/Services/${id}`, {
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
    console.log("Something went wrong while deleting the a restocking bill.");
    return { data: null, error: "Something went wrong!" };
  }
  revalidateTag("services");

  return { data: null, error: "" };
}

export async function getServicesCountAction({
  dateFrom,
  dateTo,
  clientId,
  carId,
  minPrice,
  maxPrice,
  serviceStatusId,
}: {
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  carId?: string;
  minPrice?: string;
  maxPrice?: string;
  serviceStatusId?: string;
}) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  let query = `${process.env.API_URL}/api/Services/count?`;

  if (dateFrom) query = query + `&dateFrom=${dateFrom}`;

  if (dateTo) query = query + `&dateTo=${dateTo}`;

  if (clientId) query = query + `&clientId=${clientId}`;

  if (carId) query = query + `&carId=${carId}`;

  if (serviceStatusId) query = query + `&serviceStatusId=${serviceStatusId}`;

  if (minPrice) query = query + `&minPrice=${minPrice}`;

  if (maxPrice) query = query + `&maxPrice=${maxPrice}`;

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

export async function serviceDownloadPdf(id: number) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const res = await fetch(`${process.env.API_URL}/api/Services/pdf/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorMessage =
      res.status === 409
        ? (await res.json()).message
        : "Faild to download service receipt as a PDF";

    return { data: null, error: errorMessage };
  }

  const data = await res.body?.getReader().read();
  // const blob = await res.blob();
  // console.log(blob, "PDFFFF");
  const pdf = data ? JSON.stringify([data.value]) : null;

  // console.log(pdf, "AAAAWWWWWWWWW ");
  return { data: pdf, error: null };
}
*/
