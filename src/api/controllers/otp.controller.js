import { Consumer, Otp } from "../../db/models/index.js";
import { generateID } from "../../utils/generateID.js";


export const generateOtp = async (req, res) => {
    const consumerId = req.id;
    //for otp
    var code = Math.floor(Math.random() * 10000);
    code = code < 1000 ? code += 1000 : code

    //For expiry
    const date = new Date()
    const milisecond = date.getTime();


    try {


        let newOtp = await Otp.findOne({ where: { consumerId } })

        if (newOtp) {
            newOtp.code = code;
            newOtp.expiry = milisecond
            await newOtp.save();

        } else {
            newOtp = await Otp.create({
                otpId: generateID("O"),
                consumerId,
                code,
                expiry: milisecond
            })
        }

        setTimeout(autoDeleteOtp(consumerId), 60000)

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

        const date = new Date();
        const getMilisecond = date.getTime();

        // verify consumer 
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
        if (!existOtp || (getMilisecond - existOtp.expiry) > 60000) {
            return res.status(400).json({
                message: "OTP expired ",
                success: false
            })
        }

        if (existOtp.code != otp) {
            return res.status(400).json({
                message: "Wrong OTP ",
                success: false
            })
        }
        console.log()
        return res.status(200).json({
            message: "otp verified successfully",
            success: true,
            value: getMilisecond - existOtp.expiry

        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Error while verifying otp",
            success: false
        })
    }
}

export const getOtp = async (req, res) => {
    const { consumerId } = req.params
    try {
        const isConsumer = await Consumer.findOne({ where: { consumerId } })
        if (!isConsumer) {
            return res.status(400).json({
                message: "Not a valid consumer",
                success: false
            })
        }
        const existOtp = await Otp.findOne({
            where: { consumerId }
        })

        if (!existOtp) {
            return res.status(400).json({
                message: "Otp expired",
                success: false
            })
        }
        return res.status(200).json({
            message: "Otp found",
            success: true,
            existOtp
        })

    } catch (error) {

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


const autoDeleteOtp = (consumerId) => async (req, res) => {
    try {
        const deletOtp = await Otp.destroy({ where: { consumerId } })


        console.log("OTP deleted successfully")
    } catch (error) {
        console.log(error)

    }
}


