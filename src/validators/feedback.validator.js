import { z } from "zod";

export const updatefeedbackValidation = z.object({
  body: z.object({
    //   7 rating
    rating: z
      .number({ required_error: "rating required" })
      .gt(0, { message: "rating should be greate than 0 " })
      .lt(6, { message: "rating should be between 1-5 " }),

    comment: z
      .string({ required_error: "comment required" })
      .optional(),

  }),
  params: z.object({
    invoiceId: z.string({ required_error: "invoiceId required" })
      .length(10, { message: "invoiceId must be of 10 letters" }),

  })
});
export const getfeedbackValidation = z.object({

  params: z.object({
    invoiceId: z.string({ required_error: "invoiceId required" })
      .length(10, { message: "invoiceId must be of 10 letters" }),

  })
});
