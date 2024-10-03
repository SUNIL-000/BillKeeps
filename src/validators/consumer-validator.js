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
export const totalconsumerValidation = z.object({
  params: z.object({
    merchantId: z.string({ required_error: "merchantId required" })
      .length(10, { message: "merchantId must be of 10 charecters" }),
  })
});
export const updatePassword = z.object({
  body: z.object({
    currentPassword: z.string({ required_error: "currentPassword required" })
      .min(1, { message: "current password can't be empty" }),

    newPassword: z.string({ required_error: "merchantId required" })
      .min(1, { message: "New password can't be empty" }),
  }),

});
export const NearbyMerchant = z.object({
  query: z.object({
    pincode: z.string({ required_error: "currentPassword required" })
      .regex(/^[0-9]{6}$/, { message: "Pincode must be a 6-digit number" })
  }),

});