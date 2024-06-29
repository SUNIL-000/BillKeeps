import { z } from "zod";

export const createProductValidation = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Product name must required" })
      .min(5, { message: "Product name must be atleast 5 charecter" }),
    desc: z
      .string({ required_error: "Description must be required" })
      .min(1, { message: "Description must be atleast of 1 charecter" }),
    mrp: z.number({ required_error: "Mrp must be required" }),
  })
});
//   merchantId, name, desc, mrp

export const updateProductValidation = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Product name must required" })
      .optional(),
    desc: z
      .string({ required_error: "Description must be required" })
      .optional(),
    mrp: z.number({ required_error: "Mrp must be required" }).optional(),
  }),
  params: z.object({
    productId: z
      .string({ required_error: "productId must required" })
      .length(10, { message: "productId must be of 10 digit" }),

  })
});



export const deleteProductValidation = z.object({

  params: z.object({
    productId: z
      .string({ required_error: "productId must required" })
      .length(10, { message: "productId must be of 10 digit" }),

  })
});
export const singleProductValidation = z.object({

  params: z.object({
    productId: z
      .string({ required_error: "productId must required" })
      .length(10, { message: "productId must be of 10 digit" }),

  })
});



