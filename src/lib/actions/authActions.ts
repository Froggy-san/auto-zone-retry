"use server";

import { z } from "zod";
import { LoginFormSchema, signUpProps, TokenData, User } from "../types";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@utils/supabase/server";
import { createClientAction } from "./clientActions";

export async function revalidateHomePage() {
  revalidatePath("/", "layout");
}

export async function loginUser(
  loginData: z.infer<typeof LoginFormSchema>,
  direct: string
) {
  const supabase = await createClient();

  console.log("AYOO?", loginData, direct);

  const { error } = await supabase.auth.signInWithPassword({
    email: loginData.username,
    password: loginData.password,
  });

  if (error) {
    console.log(error.message);

    return error.message;
  }

  revalidatePath("/", "layout");

  if (direct) redirect(direct);
  redirect("/");

  /// this is another way of which you can get the data from token.
  // const [header, payload, signature] = token.token.split(".");
  // const decodedHeader = atob(header);
  // const parsedHeader = JSON.parse(decodedHeader);

  // const decodedPayload = atob(payload);
  // const parsedPayload = JSON.parse(decodedPayload);

  // console.log("Algorithm:", parsedHeader.alg, " AAAAA");
  // console.log("Type:", parsedHeader.typ, "A&AAA");
  // console.log("Claims:", parsedPayload);
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getUserData(userId: string) {
  const user = await getCurrentUser();
  notFound();
  // user.
  //  if()
}

export async function signinWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // This parameter tells Supabase where to redirect the user after a successful login.
      // Even though the OAuth callback happens at your Supabase project URL,
      // this "redirectTo" parameter sends the user back to your app.
      redirectTo: `${process.env.SITE_URL}/api/auth/callback`,
    },
  });

  if (error) {
    console.log("GOOGLE ERROR", error.message);
    // return { data, error: error.message };
  }
  console.log("RETURNED DATA FORM GGOGLE", data);

  if (data.url) redirect(data.url);
  // return { data, error };
}

export async function signUp(
  { email, full_name, password, role, token }: signUpProps,
  direct?: string
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name,
        },
      },
    });

    if (error) throw new Error(error.message);

    console.log("DATA:", data);

    if (role !== "Admin" && data.user) {
      const { error: clientActionError } = await createClientAction({
        name: full_name,
        email,
        phones: [],
        provider: "email",
        user_id: data.user.id,
      });

      if (clientActionError) throw new Error(clientActionError);
    }

    // if (direct) redirect(direct);
    // else redirect("/login");

    return { data, error: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error: "Unknown error occurred" };
  }
}

export async function logoutUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) return error.message;

  revalidatePath("/", "layout");
  redirect("/login");
}

interface UpdateProps {
  id: string;
  username?: string;
  password?: string;
  avatar_url: string;
  role?: "User" | "Admin";
}

export async function getUserById(userId: string) {
  try {
    if (!userId) throw new Error(`invaild user id.`);
    const supabase = await createClient(true);
    const currUser = await getCurrentUser();

    if (!currUser) throw new Error("You are not logged in."); // if there is no current user throw an error.
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error(`No user found with the id of ${userId}`);

    const userById = data.user;
    const isAdmin = userById.user_metadata?.role === "Admin";
    const sameLoggedUser = currUser.id === userById.id;

    if (!isAdmin && !sameLoggedUser)
      throw new Error(`You are not authorized to do this action.`);

    const returnedData: {
      user: User;
      isAdmin: boolean;
      isCurrUser: boolean;
    } = {
      user: currUser,
      isAdmin: isAdmin,
      isCurrUser: userById.id === currUser.id,
    };

    return { data: returnedData, error: "" };
  } catch (error) {
    if (error instanceof Error) return { data: null, error: error.message };
    else return { data: null, error };
  }
}

export async function updateUserAction(formData: FormData) {
  // https://umkyoinqpknmedkowqva.supabase.co/storage/v1/object/public/avatars//499916568_1268010505331789_2764471559810878394_n.jpg

  const id = formData.get("id") as string;
  const username = formData.get("username");
  const password = formData.get("password") as string; // Assert it as string or null
  const avatar_url = formData.get("avatar_url");
  const role = formData.get("role");
  const isCurrUser = formData.get("isCurrUser");
  try {
    const supabase = await createClient(true);

    if (isCurrUser) {
      const { data, error } = await supabase.auth.updateUser({
        password: password ? password : undefined,
        data: { role, avatar_url, full_name: username },
      });

      if (error) throw new Error(error.message);
      revalidatePath(`/user/${id}`, "layout");
      return { data, error };
    } else {
      // Don't allow and admin account to change the password of another user.
      const { data, error } = await supabase.auth.admin.updateUserById(id, {
        user_metadata: {
          role,
          avatar_url,
          full_name: username,
        },
      });
      if (error) throw new Error(error.message);
      revalidatePath(`/user/${id}`, "layout");
      return { data, error };
    }
  } catch (error) {
    if (error instanceof Error) return { data: null, error: error.message };
    else
      return {
        data: null,
        error: "Something went wrong while updating the user's details.",
      };
  }
}

// export async function loginUser(
//   loginData: z.infer<typeof LoginFormSchema>,
//   direct: string
// ) {
//   const response = await fetch(`${process.env.API_URL}/api/Account/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(loginData),
//   });

//   if (!response.ok) return { data: null, error: "Invalid login credentials." };

//   const token = await response.json();

//   // localStorage.setItem("auto-zone-token", token);

//   const getCookies = cookies();
//   getCookies.set("auto-zone-token", token.token);

//   // const decoded = jwtDecode(token.token);

//   if (direct) redirect(direct);
//   redirect("/");

//   /// this is another way of which you can get the data from token.
//   // const [header, payload, signature] = token.token.split(".");
//   // const decodedHeader = atob(header);
//   // const parsedHeader = JSON.parse(decodedHeader);

//   // const decodedPayload = atob(payload);
//   // const parsedPayload = JSON.parse(decodedPayload);

//   // console.log("Algorithm:", parsedHeader.alg, " AAAAA");
//   // console.log("Type:", parsedHeader.typ, "A&AAA");
//   // console.log("Claims:", parsedPayload);
// }

// export async function getCurrentUser(): Promise<User | null> {
//   const getCookies = cookies();
//   const token = getCookies.get("auto-zone-token")?.value || "";

//   if (!token) return null;

//   const user = jwtDecode(token) as TokenData;

//   const hasExpired = checkTokenExpiration(user);

//   if (hasExpired) return null;

//   return user;
// }
// export async function signUp({
//   email,
//   username,
//   password,
//   token,
// }: signUpProps) {
//   if (!token)
//     return {
//       data: null,
//       error: "You are not authroized to do this action, Please login first.",
//     };
//   const res = await fetch(`${process.env.API_URL}/api/Account/register`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, username, password }),
//   });

//   if (!res.ok)
//     return {
//       data: null,
//       error: `Something went wrong with the signup process.`,
//     };

//   // const data = await res.json();
//   redirect("/login");
// }

// export async function logoutUser() {
//   const getCookies = cookies();
//   const token = getCookies.get("auto-zone-token")?.value || "";

//   if (!token) throw new Error("The user is already logged out");
//   const response = await fetch(`${process.env.API_URL}/api/Account/logout`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok)
//     return {
//       data: null,
//       error: "something went wrong with the logout process",
//     };
//   getCookies.delete("auto-zone-token");

//   redirect("/login");
//   const data = await response.json();
// }

// export async function car() {
//   // const car = await fetch(
//   //   `https://mywarsha-gdgzdxdecghmfwa8.israelcentral-01.azurewebsites.net/api/cargenerations`,
//   //   {
//   //     headers: {
//   //       Authorization: `Bearer ${token.token}`,
//   //     },
//   //   }
//   // );
//   // const data = await car.json();
// }

// import { z } from "zod";
// import { LoginFormSchema, signUpProps, TokenData, User } from "../types";
// import { jwtDecode } from "jwt-decode";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { checkTokenExpiration } from "@lib/helper";
// import { revalidatePath } from "next/cache";
// import { createClient } from "@utils/supabase/server";

// export async function loginUser(
//   loginData: z.infer<typeof LoginFormSchema>,
//   direct: string
// ) {
//   const supabase = await createClient();

//   // type-casting here for convenience
//   // in practice, you should validate your inputs

//   const { error } = await supabase.auth.signInWithPassword({
//     email: loginData.username,
//     password: loginData.password,
//   });

//   if (error) return error;

//   revalidatePath("/", "layout");

//   if (direct) redirect(direct);
//   redirect("/");

//   /// this is another way of which you can get the data from token.
//   // const [header, payload, signature] = token.token.split(".");
//   // const decodedHeader = atob(header);
//   // const parsedHeader = JSON.parse(decodedHeader);

//   // const decodedPayload = atob(payload);
//   // const parsedPayload = JSON.parse(decodedPayload);

//   // console.log("Algorithm:", parsedHeader.alg, " AAAAA");
//   // console.log("Type:", parsedHeader.typ, "A&AAA");
//   // console.log("Claims:", parsedPayload);
// }

// export async function getCurrentUser(): Promise<User | null> {
//   const getCookies = cookies();
//   const token = getCookies.get("auto-zone-token")?.value || "";

//   if (!token) return null;

//   const user = jwtDecode(token) as TokenData;

//   const hasExpired = checkTokenExpiration(user);

//   if (hasExpired) return null;

//   return user;
// }
// export async function signUp({
//   email,
//   username,
//   password,
//   token,
// }: signUpProps) {
//   if (!token)
//     return {
//       data: null,
//       error: "You are not authroized to do this action, Please login first.",
//     };
//   const res = await fetch(`${process.env.API_URL}/api/Account/register`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, username, password }),
//   });

//   if (!res.ok)
//     return {
//       data: null,
//       error: `Something went wrong with the signup process.`,
//     };

//   // const data = await res.json();
//   redirect("/login");
// }

// export async function logoutUser() {
//   const getCookies = cookies();
//   const token = getCookies.get("auto-zone-token")?.value || "";

//   if (!token) throw new Error("The user is already logged out");
//   const response = await fetch(`${process.env.API_URL}/api/Account/logout`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok)
//     return {
//       data: null,
//       error: "something went wrong with the logout process",
//     };
//   getCookies.delete("auto-zone-token");

//   redirect("/login");
//   const data = await response.json();
// }

// export async function car() {
//   // const car = await fetch(
//   //   `https://mywarsha-gdgzdxdecghmfwa8.israelcentral-01.azurewebsites.net/api/cargenerations`,
//   //   {
//   //     headers: {
//   //       Authorization: `Bearer ${token.token}`,
//   //     },
//   //   }
//   // );
//   // const data = await car.json();
// }

// // export async function loginUser(
// //   loginData: z.infer<typeof LoginFormSchema>,
// //   direct: string
// // ) {
// //   const response = await fetch(`${process.env.API_URL}/api/Account/login`, {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify(loginData),
// //   });

// //   if (!response.ok) return { data: null, error: "Invalid login credentials." };

// //   const token = await response.json();

// //   // localStorage.setItem("auto-zone-token", token);

// //   const getCookies = cookies();
// //   getCookies.set("auto-zone-token", token.token);

// //   // const decoded = jwtDecode(token.token);

// //   if (direct) redirect(direct);
// //   redirect("/");

// //   /// this is another way of which you can get the data from token.
// //   // const [header, payload, signature] = token.token.split(".");
// //   // const decodedHeader = atob(header);
// //   // const parsedHeader = JSON.parse(decodedHeader);

// //   // const decodedPayload = atob(payload);
// //   // const parsedPayload = JSON.parse(decodedPayload);

// //   // console.log("Algorithm:", parsedHeader.alg, " AAAAA");
// //   // console.log("Type:", parsedHeader.typ, "A&AAA");
// //   // console.log("Claims:", parsedPayload);
// // }

// // export async function getCurrentUser(): Promise<User | null> {
// //   const getCookies = cookies();
// //   const token = getCookies.get("auto-zone-token")?.value || "";

// //   if (!token) return null;

// //   const user = jwtDecode(token) as TokenData;

// //   const hasExpired = checkTokenExpiration(user);

// //   if (hasExpired) return null;

// //   return user;
// // }
// // export async function signUp({
// //   email,
// //   username,
// //   password,
// //   token,
// // }: signUpProps) {
// //   if (!token)
// //     return {
// //       data: null,
// //       error: "You are not authroized to do this action, Please login first.",
// //     };
// //   const res = await fetch(`${process.env.API_URL}/api/Account/register`, {
// //     method: "POST",
// //     headers: {
// //       Authorization: `Bearer ${token}`,
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify({ email, username, password }),
// //   });

// //   if (!res.ok)
// //     return {
// //       data: null,
// //       error: `Something went wrong with the signup process.`,
// //     };

// //   // const data = await res.json();
// //   redirect("/login");
// // }

// // export async function logoutUser() {
// //   const getCookies = cookies();
// //   const token = getCookies.get("auto-zone-token")?.value || "";

// //   if (!token) throw new Error("The user is already logged out");
// //   const response = await fetch(`${process.env.API_URL}/api/Account/logout`, {
// //     method: "POST",
// //     headers: {
// //       Authorization: `Bearer ${token}`,
// //       "Content-Type": "application/json",
// //     },
// //   });

// //   if (!response.ok)
// //     return {
// //       data: null,
// //       error: "something went wrong with the logout process",
// //     };
// //   getCookies.delete("auto-zone-token");

// //   redirect("/login");
// //   const data = await response.json();
// // }

// // export async function car() {
// //   // const car = await fetch(
// //   //   `https://mywarsha-gdgzdxdecghmfwa8.israelcentral-01.azurewebsites.net/api/cargenerations`,
// //   //   {
// //   //     headers: {
// //   //       Authorization: `Bearer ${token.token}`,
// //   //     },
// //   //   }
// //   // );
// //   // const data = await car.json();
// // }
