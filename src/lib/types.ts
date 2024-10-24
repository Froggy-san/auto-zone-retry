import { z } from "zod";

export function validateEgyptianPhoneNumber(phoneNumber: string) {
  "use client";
  // define the regex
  const regex = /^01[0125][0-9]{8}$/;
  // test the string against the regex
  if (regex.test(phoneNumber)) {
    // return true if it matches
    return true;
  } else {
    // return false if it doesn't
    return false;
  }
}
export interface FilesWithPreview extends File {
  preview: string;
}
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

export const ProductsSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Product name is too short" })
    .max(100, { message: "Product name is too long." }),
  categoryId: z.number(),
  productTypeId: z.number(),
  productBrandId: z.number(),
  description: z.string(),
  // .min(4, { message: "Description  is too short" })
  // .max(100, { message: "Description  is too long." }),
  listPrice: z.number(),
  carinfoId: z.number(),
  salePrice: z.number(),
  stock: z.number().default(0),
  isAvailable: z.boolean().default(false),

  images: z.array(z.custom<FilesWithPreview>()).max(9, {
    message: "You can only upload up to 9 images at a time.",
  }),

  isMain: z.boolean().default(false),
});

export const CarGenerationsSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name is too short" })
    .max(55, { message: "Name is too long." }),
  carModelId: z.number().default(0),
  notes: z.string(),
});

export const CarInfoSchema = z.object({
  carMakerId: z.number(),
  carModelId: z.number(),
  carGenerationId: z.number(),
});

export const CarModelSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name is too short" })
    .max(55, { message: "Name is too long." }),
  carMakerId: z.number().default(0),
  notes: z.string(),
});

export const CarSchema = z.object({
  color: z.string(),
  plateNumber: z
    .string()
    .min(1, { message: "Plate number is required!" })
    .max(55, { message: "Plate number is too long." }),
  chassisNumber: z
    .string()
    .min(1, { message: "Chassi number is required!" })
    .max(55, { message: "Chassi number is too long." }),
  motorNumber: z
    .string()
    .min(1, { message: "Motor number is required!" })
    .max(55, { message: "Motor number is too long." }),
  notes: z.string(),
  clientId: z.number().default(0),
  carInfoId: z.number().default(0),
});

export const CreateCarMakerScehma = z.object({
  name: z
    .string()
    .min(3, { message: "Toos short" })
    .max(55, { message: "Too long" }),
  notes: z.string(),
  logo: z.custom<File[]>(),
});

export const CreateCarModelSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Toos short" })
    .max(55, { message: "Too long" }),
  carMakerId: z.number(),
  notes: z.string(),
});

export const CreateCarInfoSchema = z.object({
  carMakerId: z.number(),
  carModelId: z.number(),
  carGenerationId: z.number(),
});

export const CreateProdcutImageSchema = z.object({
  image: z.custom<File[]>(),
  productId: z.number(),
  isMain: z.boolean().default(false),
});

export const EditNameAndNote = z.object({
  name: z
    .string()
    .min(3, { message: "Too short" })
    .max(100, { message: "Too long" }),
  notes: z.string(),
});

// const phone = z.object({
//   id: z.number().nullable(),
//   number: z
//     .string()
//     .min(11, { message: "This phone number is too short" })
//     .max(11, { message: "This phone number is too long." })
//     .refine((phone) => validateEgyptianPhoneNumber(phone), {
//       message: "This phone number is not valid",
//     }),
//   clientId: z.number().nullable(),
// });

const phone = z
  .object({
    id: z.number(),
    number: z
      .string()
      .min(11, { message: "This phone number is too short" })
      .max(11, { message: "This phone number is too long." })
      .refine((phone) => validateEgyptianPhoneNumber(phone), {
        message: "This phone number is not valid",
      }),
    clientId: z.number(),
  })
  .partial({ id: true, clientId: true });

export const CreateClientSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Put a valid name" })
    .max(100, { message: "The name is too long" }),
  email: z.string().describe("Email"),
  phones: phone.array(),
});

export const CreateCarSchema = z.object({
  color: z.string(),
  plateNumber: z
    .string()
    .min(1, "Plate number is required")
    .max(30, { message: "Plate number is too long." }),
  chassisNumber: z.string(),
  motorNumber: z.string(),
  notes: z.string(),
  clientId: z.number().min(1, { message: "Every car must have an owner" }),
  carInfoId: z.number(),

  images: z.array(z.custom<FilesWithPreview>()).max(9, {
    message: "You can only upload up to 9 images at a time.",
  }),
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

export interface TokenData {
  sub: string;
  jti: string;
  role?: string;
  exp: number;
  iss: string;
  aud: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface ProductBrand {
  id: number;
  name: string;
}

export interface ProductType {
  id: number;
  name: string;
}

export interface CarInfoProps {
  id: number;
  carMaker: {
    id: number;
    name: string;
    notes: string;
    logo: null;
  };
  carModel: {
    id: number;
    name: string;
    notes: string;
  };
  carGeneration: {
    id: 1;
    name: string;
    notes: string;
  };
}

export interface CarMaker {
  id: 2;
  name: string;
  carModels: {
    id: number;
    name: string;
    notes: string;
    carModelId: number;
  };
  notes: string;
  logo: null | string;
}

export interface CarModelProps {
  id: number;
  name: string;
  notes: string;
  carMaker: any;
  carMakerId: number;
  carGenerations: {
    id: number;
    name: string;
    notes: string;
    carModelId: number;
  }[];
}

export interface CarGenerationProps {
  id: number;
  name: string;
  notes: string;
  carModel: any;
  carModelId: number;
}

export interface CreateProductProps {
  name: string;
  categoryId: number;
  productTypeId: number;
  productBrandId: number;
  description: string;
  listPrice: number;
  carinfoId: number;
  salePrice: number;
  stock: number;
  isAvailable: boolean;
  images: FormData[];
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  dateAdded: string;
  description: string;
  listPrice: number;
  salePrice: number;
  stock: number;
  isAvailable: boolean;
  mainProductImage: null | string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isMain: boolean;
  productId: number;
}

export interface ProductById {
  id: number;
  name: string;
  category: Category;
  productType: ProductType;
  productBrand: ProductBrand;
  dateAdded: string;
  description: string;
  listPrice: number;
  salePrice: number;
  stock: number;
  isAvailable: boolean;
  carInfos: [];
  productImages: ProductImage[];
}

export interface EditProduct {
  id: number;
  name: string;
  categoryId: number;
  description: string;
  listPrice: number;
  salePrice: number;
  stock: number;
  isAvailable: boolean;
}

export interface Client {
  id: number;
  name: string;
  email: string;
}

export interface PhoneNumber {
  id: number;
  number: string;
  clientId: number;
}

export interface ClientWithPhoneNumbers extends Client {
  phoneNumbers: PhoneNumber[];
}

export type CreateProductWithImagesProps = z.infer<typeof ProductsSchema>;
export type CarGeneration = z.infer<typeof CarGenerationsSchema>;
export type CarInfo = z.infer<typeof CarInfoSchema>;
export type CarModel = z.infer<typeof CarModelSchema>;
export type Car = z.infer<typeof CarSchema>;
export type CreateCarMaker = z.infer<typeof CreateCarMakerScehma>;
export type CreateCarModel = z.infer<typeof CreateCarModelSchema>;
export type CreateCarInfoSchema = z.infer<typeof CreateCarInfoSchema>;
export type CreateClient = z.infer<typeof CreateClientSchema>;
export type CreateCar = z.infer<typeof CreateCarSchema>;
