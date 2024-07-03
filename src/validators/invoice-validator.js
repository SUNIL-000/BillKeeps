import { z } from "zod";

const item = z.object({
    productId: z.string({ required_error: "productID required" })
        .length(10, { message: "productID must be of 10 letters" }),

    quantity: z.number({ required_error: "quantity required" })
        .gte(1, { message: "quantity must be greater than 0" }),

    discountAmount: z.number()
        .optional(),

    discountPercent: z.number()
        .optional(),

    salePrice: z.number({ required_error: "salePrice required" })
        .gt(0, { message: "salePrice must be greater than 0" }),
});

export const invoiceValidation = z.object({
    body: z.object({
        consumerId: z.string({ required_error: "consumerId required" })
            .length(10, { message: "consumerId must be of 10 letters" }),

        items: z.array(item),

        returnValidity: z.number({ required_error: "returnValidity required" })
            .min(1, { message: "returnValidity must be at least 1" }),

        exchangeValidity: z.number({ required_error: "exchangeValidity required" })
            .min(1, { message: "exchangeValidity must be at least 1" }),

        totalAmount: z.number({ required_error: "totalAmount required" })
            .gt(0, { message: "totalAmount must be greater than 0" }),
    })

});
