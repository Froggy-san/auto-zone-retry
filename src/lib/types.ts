import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z
    .string()
    .describe("Username")
    .min(3, { message: "Invaild user name" }),
  password: z
    .string()
    .describe("Password")
    .min(6, { message: "Invaild user name" }),
});

export const SignUpFormSchema = z
  .object({
    email: z
      .string()
      .describe("Email")
      .min(6, { message: "Invaild user name" }),
    username: z
      .string()
      .describe("Username")
      .min(6, { message: "Invaild user name" }),
    password: z
      .string()
      .describe("Password")
      .min(6, { message: "Invaild password" }),
    confirmPassword: z
      .string()
      .describe("Confirm Password")
      .min(6, { message: "Invaild password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export interface signUpProps {
  username: string;
  email: string;
  password: string;
  token?: string | null;
}

export interface User {
  sub?: string;
  jti?: string;
  exp?: number;
  iss?: string;
  aud?: string | string[] | undefined;
}

export const ProductsSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Product name is too short" })
    .max(100, { message: "Product name is too long." }),
  categoryId: z.number(),
  productTypeId: z.number(),
  productBrandId: z.number(),
  description: z
    .string()
    .min(4, { message: "Description  is too short" })
    .max(100, { message: "Description  is too long." }),
  listPrice: z.number(),
  carinfoId: z.number(),
  salePrice: z.number(),
  stock: z.number().default(0),
  isAvailable: z.boolean().default(false),
});

export type Product = z.infer<typeof ProductsSchema>;
