import { Feedback } from "../../db/models/feedback.model.js";
import { Invoice } from "../../db/models/invoice.model.js";

export const updateFeedBack = async (req, res) => {
    const { rating, comment } = req.body
    const { invoiceId, } = req.params
    try {


        const invoiceExist = await Invoice.findByPk(invoiceId)
        if(!invoiceExist){
            return res.status(400).json({
                message: "Wrong invoiceId ",
                success: false
            })
        }
        const updatedFeedback = await Feedback.update(
            { rating, comment },
            { where: { invoiceId } })

        if (!updatedFeedback) {
            return res.status(400).json({
                message: "Failed to update feedback.",
                success: false
            })
        }
        return res.status(200).json({
            message: "Feedback updated ",
            success: true
        })
    } catch (error) {
        console.log(error);

        return res.status(400).json({
            message: "Error occur while updating feedback ",
            success: false
        })
    }
};