
import { z } from "zod";

export const createProductValidation = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Product name must required" })
      .min(1, { message: "Product name must be atleast 1 charecter" }),
    desc: z
      .string({ required_error: "Description must be required" }).optional(),
    mrp: z.number({ required_error: "Mrp must be required" })
      .gte(0, { message: "mrp must be greater than 0" })
    ,
  })
});
//   merchantId, name, desc, mrp

export const updateProductValidation = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Product name must be required" })
      .min(1, { message: "Name must be atleast 1 charecter" }),
    desc: z
      .string({ required_error: "Description must be required" })
      .optional(),

    mrp: z.number({ required_error: "Mrp must be required" })
      .gte(0, { message: "mrp must be greater than 1" }),
  }),
  params: z.object({
    productId: z
      .string({ required_error: "productId must required" })
      .length(10, { message: "productId must be of 10 charecter" }),

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

export const searchProductValidation = z.object({

  query: z.object({
    name: z
      .string({ required_error: "name must be required" })
      .min(1, { message: "name atleast of 1 charecter" }),

  })
});



