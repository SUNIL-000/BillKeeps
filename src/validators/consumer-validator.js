import { z } from "zod";

export const UserSignupValidation = z.object({
  body: z.object({
    contactNo: z
      .string({ required_error: "contactNo required" })
      .length(10, { message: "contactNo must be of 10 digits" }),

    password: z
      .string({ required_error: "Password required" })
      .min(1, { message: "Password required" }),
  })


});
export const UserSignInValidation = z.object({
  body: z.object({

  contactNo: z
    .string({ required_error: "contactNo required" })
    .length(10, { message: "contactNo must be of 10 digits" }),

  password: z
    .string({ required_error: "Password required" })
    .min(1, { message: "Please enter password" }),

  })
});
