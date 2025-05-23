"use server";

import { z } from "zod";
import { LoginFormSchema, signUpProps, TokenData, User } from "../types";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

    if (role !== "Admin") {
      const { error: clientActionError } = await createClientAction({
        name: full_name,
        email,
        phones: [],
      });

      if (clientActionError) throw new Error(clientActionError);
    }

    if (direct) redirect(direct);
    else redirect("/login");
  } catch (error) {
    if (error instanceof Error) {
      return { data: null, error: error.message };
    }
    return { data: null, error };
  }
}

export async function logoutUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) return error.message;

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function car() {
  // const car = await fetch(
  //   `https://mywarsha-gdgzdxdecghmfwa8.israelcentral-01.azurewebsites.net/api/cargenerations`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${token.token}`,
  //     },
  //   }
  // );
  // const data = await car.json();
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
