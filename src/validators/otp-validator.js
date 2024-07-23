import z from "zod"


export const verifyOtpValidation = z.object({
    body: z.object({
        consumerId: z.string({ required_error: "consumerId required" })
            .length(10, { message: "consumerId must be of 10 letters" }),
        otp: z.string({ required_error: " otp must be required" })
            .length(4, { message: "Otp must be of 4 digit" })


    })
})



export const deleteOtpValidation = z.object({
    params: z.object({

        consumerId: z.string({ required_error: "consumerId required" })
            .length(10, { message: "consumerId must be of 10 letters" }),
    })
})