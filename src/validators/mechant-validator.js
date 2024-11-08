import { z } from "zod";

export const merchantSignupValidation = z.object({
  body: z.object({
    businessName: z
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
    pincode: z
      .union([
        z
          .string()
          .regex(/^[0-9]{6}$/, { message: "Pincode must be a 6-digit number" }),
        z.string().length(0),
      ])
      .optional()
      .transform((pincode) => (pincode === "" ? null : pincode)),
  }),
});

export const merchantSignInValidation = z.object({
  body: z.object({
    contactNo: z
      .string({ required_error: "contactNo must be required" })
      .length(10, { message: "contactNo must be exactly 10 digits" }),
    password: z
      .string({ required_error: "password must be required" })
      .min(1, { message: "Please enter your password" }),
  }),
});
export const merchantTopProductValidation = z.object({
  params: z.object({
    merchantId: z
      .string({ required_error: "merchantId required" })
      .length(10, { message: "merchantId must be of 10 letters" }),
  }),
});

export const merchantUpdateValidation = z.object({
  body: z.object({
    businessName: z
      .string({ required_error: "buisnessName required" })
      .min(1, { message: "buisnessName must be at least 1 character" })
      .max(200, { message: "buisnessName must be at most 200 characters" })
      .optional(),
    contactNo: z
      .string({ required_error: "contactNo required" })
      .length(10, { message: "contactNo must be exactly 10 digits" })
      .optional(),

    gstNo: z.string().optional(),

    address: z
      .string()
      .max(100, { message: "address must be atmost 100 characters" })
      .optional(),

    businessType: z
      .string()
      .max(100, { message: "businessType must be atmost 100 characters" })
      .optional(),

    tandc: z
      .string()
      .max(1000, { message: "Terms and condition must not exceed than 1000 characters" })
      .optional(),
      
    pincode: z
      .union([
        z
          .string()
          .regex(/^[0-9]{6}$/, { message: "pinode must be a 6-digit number" }),
        z.string().length(0),
      ])
      .optional()
      .transform((pincode) => (pincode === "" ? null : pincode)),
  }),
  params: z.object({
    merchantId: z
      .string({ required_error: "merchantId required" })
      .length(10, { message: "merchantId must be of 10 letters" }),
  }),
});
