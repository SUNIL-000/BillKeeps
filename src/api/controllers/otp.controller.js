import { Consumer, Otp } from "../../db/models/index.js";


export const generateOtp = async (req, res) => {
    const consumerId = req.id;

    var code = Math.floor(Math.random() * 10000);
    code = code < 1000 ? code += 1000 : code

    try {
        const isConsumer = await Consumer.findOne({ where: { consumerId } })

        if (!isConsumer) {
            return res.status(400).json({
                message: "Not a valid consumer",
                success: false
            })
        }
        let newOtp = await Otp.findOne({ where: { consumerId } })

        if (newOtp) {
            newOtp.code = code;
            await newOtp.save();
        } else {
            newOtp = await Otp.create({ consumerId, code })
        }


        return res.status(201).json({
            message: "otp generated successfully",
            success: true,
            newOtp
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Error while creating otp",
            success: false
        })
    }
}


export const verifyOtp = async (req, res) => {
    const { consumerId, otp } = req.body;
    try {

        //verify consumer 
        const isConsumer = await Consumer.findOne({ where: { consumerId } })

        if (!isConsumer) {
            return res.status(400).json({
                message: "Not a valid consumer",
                success: false
            })
        }

        //verify otp
        const existOtp = await Otp.findOne({
            where: { consumerId }
        })

        if (existOtp.code != otp) {
            return res.status(400).json({
                message: "Wrong otp ",
                success: false
            })
        }

        return res.status(200).json({
            message: "otp verified successfully",
            success: true,

        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Error while verifying otp",
            success: false
        })
    }
}

export const deleteOtp = async (req, res) => {
    const { consumerId } = req.params;
    try {

        //delete otp
        const deletdOtp = await Otp.destroy({
            where: { consumerId }
        })

        if (!deletdOtp) {
            return res.status(400).json({
                message: "Failed to delete otp",
                success: false
            })
        }

        return res.status(200).json({
            message: "otp deleted successfully",
            success: true,
            deletdOtp

        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Error while verifying otp",
            success: false
        })
    }
}