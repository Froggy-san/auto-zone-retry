"use server";

import { z } from "zod";
import { LoginFormSchema, SignUpFormSchema, signUpProps, User } from "../types";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(loginData: z.infer<typeof LoginFormSchema>) {
  const response = await fetch(`${process.env.API_URL}/api/Account/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) throw new Error("Invalid login credentials");

  const token = await response.json();
  console.log(token, "TTOEKN");

  // localStorage.setItem("auto-zone-token", token);

  const getCookies = cookies();
  getCookies.set("auto-zone-token", token.token);

  const decoded = jwtDecode(token.token);
  // console.log(token.token, "TOKEN");

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
  const getCookies = cookies();
  const token = getCookies.get("auto-zone-token")?.value || "";

  if (token === "") return null;

  const user = jwtDecode(token);

  return user;
}
export async function signUp({
  email,
  username,
  password,
  token,
}: signUpProps) {
  if (!token)
    throw new Error(
      "You are not authroized to do this action, Please login first."
    );
  const res = await fetch(`${process.env.API_URL}/api/Account/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  });

  if (!res.ok) throw new Error(`Something went wrong with the signup process.`);

  const data = await res.json();
  redirect("/login");
}

export async function logoutUser() {
  const getCookies = cookies();
  const token = getCookies.get("auto-zone-token")?.value || "";

  console.log(token, "TOKEN");
  if (!token) throw new Error("The user is already logged out");
  const response = await fetch(`${process.env.API_URL}/api/Account/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok)
    throw new Error("something went wrong with the logout process");
  getCookies.delete("auto-zone-token");

  const data = await response.json();
  console.log(data, "LOGOUT DATA");
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
  // console.log(car, "CARRRRR");
  // console.log(data, "data");
}
