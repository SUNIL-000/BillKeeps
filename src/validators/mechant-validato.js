import { z } from "zod";

export const merchantSignup = z.object({
  buisnessName: z
    .string({ required_error: "buisnessName required" })
    .min(1, { message: "buisnessName must be at least 1 character" })
    .max(200, { message: "buisnessName must be at most 200 characters" }),
  contactNo: z
    .string({ required_error: "contactNo required" })
    .length(10, { message: "contactNo must be exactly 10 digits" }),

  password: z.string({ required_error: "password required" }),
  gstNo: z.string().optional(),
  address: z
    .string()
    .max(100, { message: "address must be at most 100 characters" })
    .optional(),
  businessType: z
    .string()
    .max(100, { message: "businessType must be at most 100 characters" })
    .optional(),
  buisnessLogoUrl: z.string().optional(),
});

export const merchantSignIn = z.object({
  contactNo: z
    .string({ required_error: "contactNo required" })
    .length(10, { message: "contactNo must be exactly 10 digits" }),
  password: z
    .string({ required_error: "password required" })
    .min(1, { message: "Please enter your password" }),
});
