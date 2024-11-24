"use server";

import { AUTH_TOEKN_NAME, PAGE_SIZE } from "@lib/constants";
import { getToken } from "@lib/helper";
import {
  Client,
  ClientById,
  ClientWithPhoneNumbers,
  CreateClient,
  CreateProductProps,
  EditProduct,
  PhoneNumber,
  ProductImage,
} from "@lib/types";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createPhoneNumAction,
  createPhoneNumsBulkAction,
  deletePhoneNumByIdAction,
  editPhoneNumAction,
  getPhonesAction,
  getPhonesCountAction,
} from "./phoneActions";

interface GetClientsActionProps {
  name?: string;
  email?: string;
  phone?: string;
  pageNumber: string;
}

export async function getClientsAction({
  pageNumber,
  name,
  email,
  phone,
}: GetClientsActionProps) {
  //Product?PageNumber=1&PageSize=10
  // /api/Product?Name=test&CategoryId=1&ProductTypeId=1&ProductBrandId=1&IsAvailable=true&PageNumber=1&PageSize=10
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const { data: phoneNumbers, error } = await getPhonesAction({});

  let query = `${process.env.API_URL}/api/Clients?PageNumber=${pageNumber}&PageSize=${PAGE_SIZE}`;

  if (name) query = query + `&Name=${name}`;

  if (email) query = query + `&Email=${email}`;

  if (phone) query = query + `&Phone=${phone}`;

  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
    next: {
      tags: ["clients"],
    },
  });

  // console.log(response, "Product Response");
  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = (await response.json()) as Client[];

  // console.log(phoneNumbers, "PHONE NUMBERS");
  let ClientsData: ClientWithPhoneNumbers[] = [];

  if (data.length) {
    ClientsData = data.map((clientData) => {
      const phoneNumbersData = phoneNumbers.filter(
        (phone: PhoneNumber) => phone.clientId === clientData.id
      );
      return { ...clientData, phoneNumbers: phoneNumbersData };
    });
  }

  return { data: ClientsData, error: "" };
}

export async function getClientsDataAction() {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const { data: phoneNumbers, error } = await getPhonesAction({});

  const response = await fetch(`${process.env.API_URL}/api/Clients`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = (await response.json()) as Client[];

  let ClientsData: ClientWithPhoneNumbers[] = [];

  if (data.length) {
    ClientsData = data.map((clientData) => {
      const phoneNumbersData = phoneNumbers.filter(
        (phone: PhoneNumber) => phone.clientId === clientData.id
      );
      return { ...clientData, phoneNumbers: phoneNumbersData };
    });
  }

  return { data: ClientsData, error: "" };
}

export async function getClienttByIdAction(id: number) {
  const token = getToken();

  if (!token)
    return { data: null, error: "You are not authorized to make this action." };

  const response = await fetch(`${process.env.API_URL}/api/Clients/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products.",
    };
  }

  const data = (await response.json()) as ClientById;

  return { data, error: "" };
}

export async function createClientAction({
  name,
  email,
  phones,
}: CreateClient) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/Clients`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  console.log(response);

  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }

    return {
      data: null,
      error: "Something went wrong while creating the client.",
    };
  }
  const { clientId } = await response.json();

  if (phones.length) {
    // const upload = phones.map((phone) =>
    //   createPhoneNumAction({ number: phone.number, clientId })
    // );
    // try {
    //   await Promise.all(upload);
    // } catch (error: any) {
    //   if (error) return { data: null, error: error?.message };
    // }

    // Add the clientId to each phone number.

    const upload = phones.map((phone) => {
      return { number: phone.number, clientId };
    });

    // Sent the phone numbers array to the back-end.

    const { error } = await createPhoneNumsBulkAction(upload);
    // In case of an error, delete the client we created above.

    if (error) {
      const { error: deleteError } = await deleteClientByIdAction(
        clientId,
        false
      );

      return {
        data: null,
        error: `${error} ${deleteError && `& ${deleteError} `}`,
      };
    }
  }
  revalidateTag("clients");

  return { data: null, error: "" };
}

export async function editClientAction({
  clientToEdit,
  phonesToEdit,
  phonesToAdd,
  phonesToDelete,
}: {
  phonesToEdit: PhoneNumber[];
  phonesToDelete: PhoneNumber[];
  clientToEdit: Client;
  phonesToAdd: { number: string }[];
}) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";
  const { id, name, email } = clientToEdit;
  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/Clients/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email }),
  });

  console.log(response);
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }

    return {
      data: null,
      error: "Something went wrong while creating the client.",
    };
  }

  // Adding new phone numbers
  if (phonesToAdd.length) {
    const upload = phonesToAdd.map((phone) => {
      return { number: phone.number, clientId: id };
    });
    const { error } = await createPhoneNumsBulkAction(upload);
    if (error) return { data: null, error: error };
  }

  // Handling the editing of phone numbers
  if (phonesToEdit.length) {
    const editPhones = phonesToEdit.map((phone) =>
      editPhoneNumAction({ id: phone.id, number: phone.number })
    );

    try {
      await Promise.all(editPhones);
    } catch (error: any) {
      return { data: null, error: error };
    }
  }

  // Handling the deleting of phone numbers.

  if (phonesToDelete.length) {
    const deletePhones = phonesToDelete.map((phone) =>
      deletePhoneNumByIdAction(phone.id)
    );

    await Promise.all(deletePhones);
  }

  revalidateTag("clients");
  // revalidatePath("/dashboard/customers");

  return { data: null, error: "" };
}

export async function deleteClientByIdAction(id: number, revalidate = true) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/Clients/${id}`, {
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
    return {
      data: null,
      error: "Something went wrong while deleting the client.",
    };
  }
  // const data = await response.json();

  // return data;
  // revalidatePath("/products");
  if (revalidate) revalidateTag("clients");

  return { data: null, error: "" };
}

interface GetClientsCountActionProps {
  name?: string;
  email?: string;
  phone?: string;
}

export async function getClientsCountAction({
  name,
  email,
  phone,
}: GetClientsCountActionProps) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token)
    return {
      data: null,
      error: "You are not authorized to get the products count data.",
    };

  let query = `${process.env.API_URL}/api/Clients/count?`;

  if (name) query = query + `&Name=${name}`;

  if (phone) query = query + `&phone=${phone}`;

  if (email) query = query + `&email=${email}`;

  const response = await fetch(query, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    console.log("Something went wrong while grabbing the products count.");
    return {
      data: null,
      error: "Something went wrong while grabbing the products count.",
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

export async function createProductImageAction(formData: FormData) {
  const cookie = cookies();
  const token = cookie.get(AUTH_TOEKN_NAME)?.value || "";

  console.log(formData, "Form data");
  if (!token) return redirect("/login");

  const response = await fetch(`${process.env.API_URL}/api/ProductImages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  console.log(response);
  if (!response.ok) {
    if (response.status === 409) {
      return { data: null, error: (await response.json()).message };
    }
    return {
      data: null,
      error: "Something went wrong while creating the product.",
    };
  }

  // const data = await response.json();
  // return data;

  return { data: null, error: "" };
}

export async function deleteProductsImageAction(imageId: number) {
  //Product?PageNumber=1&PageSize=10

  const token = getToken();

  if (!token) return redirect("/login");

  const response = await fetch(
    `${process.env.API_URL}/api/ProductImages/${imageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        // "Content-type": "application/json",
      },
    }
  );
  console.log(response, "DELETE ACITON");

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

  // const data = await response.json();

  // console.log(data, "DATA");
  // return { data, error: "" };

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
