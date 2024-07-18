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

    
});

export const invoiceValidation = z.object({
    body: z.object({
        consumerId: z.string({ required_error: "consumerId required" })
            .length(10, { message: "consumerId must be of 10 letters" }),

        items: z.array(item,{required_error:"minimum 1 item required"}),

        returnValidity: z.number({ required_error: "returnValidity required" })
            .optional(),
            

        exchangeValidity: z.number({ required_error: "exchangeValidity required" })
            .optional(),

       
    })

});


export const singleInvoiceValidation = z.object({
    params: z.object({
        invoiceId: z.string({ required_error: "invoiceId required" })
            .length(10, { message: "invoiceId must be of 10 letters" }),

        
    })

});