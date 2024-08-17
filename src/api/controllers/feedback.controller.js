import { Feedback, Invoice } from "../../db/models/index.js";

export const updateFeedBack = async (req, res) => {
    const { rating, comment } = req.body
    const { invoiceId } = req.params
    try {
        const invoiceExist = await Invoice.findByPk(invoiceId)
        if (!invoiceExist) {
            return res.status(400).json({
                message: "Wrong invoiceId ",
                success: false
            })
        }
        await Feedback.update({ rating, comment }, { where: { invoiceId } })


        return res.status(200).json({ message: 'Feedback updated successfully', success: true });

    } catch (error) {
        console.log(error);

        return res.status(400).json({
            message: "Error occur while updating feedback ",
            success: false
        })
    }
};


export const getFeedback = async (req, res) => {
    const { invoiceId } = req.params
    try {
        const invoiceExist = await Invoice.findByPk(invoiceId)
        if (!invoiceExist) {
            return res.status(400).json({
                message: "Wrong invoiceId ",
                success: false
            })
        }
        const data = await Feedback.findOne({
            where: { invoiceId }, attributes: {
                exclude: ['createdAt', 'updatedAt', 'invoiceId']
            }
        })

        return res.status(200).json({
            data
        })
    } catch (error) {
        console.log(error);

    }
}