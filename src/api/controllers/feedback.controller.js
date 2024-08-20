
import { Feedback, Invoice, Merchant } from "../../db/models/index.js";

export const updateFeedBack = async (req, res) => {
    const { rating, comment } = req.body
    const { invoiceId } = req.params
    const consumerId = req.id
    try {
        const invoiceExist = await Invoice.findByPk(invoiceId)
        if (!invoiceExist) {
            return res.status(400).json({
                message: "Wrong invoiceId ",
                success: false
            })
        }
        await Feedback.update({ rating, comment, consumerId }, { where: { invoiceId } })


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

export const getAvgFeedback = async (req, res) => {
    const merchantId = req.id
    try {
        const invoiceExist = await Invoice.findAndCountAll({ where: { merchantId } })
        if (!invoiceExist) {
            return res.status(400).json({
                message: "Invoice not found.",
                success: false
            })
        }
        const feedbacks = await Feedback.findAll({
            attributes: ['rating'],
            include: {
                model: Invoice,
                attributes: [],
                where: { merchantId }
            }
        });
        const ratings = feedbacks.map(item => item.rating);
        const avgRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
        return res.status(200).json({
            avgRating,
        })
    } catch (error) {
        return res.status(400).json({
            message: "Error while searching avg feedback of a merchant",
            success: false

        })

    }
}

export const getAllFeedback = async (req, res) => {
    const merchantId = req.id
    try {
        const invoiceExist = await Invoice.findAndCountAll({ where: { merchantId } })
        if (!invoiceExist) {
            return res.status(404).json({
                message: "Invoice not found.",
                success: false
            })
        }
        const feedbacks = await Feedback.findAll({

            include: {
                model: Invoice,
                attributes: [],
                where: { merchantId }
            }
        });
        if (!feedbacks) {
            return res.status(404).json({
                message: "No feedback found.",
                success: false
            })
        }

        return res.status(200).json({
            message: "Getting all feedbacks",
            success: true,
            feedbacks,
        })
    } catch (error) {
        return res.status(400).json({
            message: "Error while searching all feedback of a merchant",
            success: false

        })

    }
}