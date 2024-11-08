import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  Consumer,
  Feedback,
  Invoice,
  Merchant,
} from "../../db/models/index.js";
import { generateID } from "../../utils/generateID.js";
import { getPinCode } from "./location.controller.js";
import { config } from "../../config/env.js";
import axios from "axios";

export const createNewConsumer = async (req, res) => {
  const { password, contactNo } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  //from UUID we just create consumerId...
  let consumerId = generateID("C");
  try {
    //check for existing consumer
    const existingConsumer = await Consumer.findOne({
      where: { contactNo: contactNo },
    });
    if (existingConsumer) {
      return res.status(400).json({
        message: "You are already registered, please login",
        success: false,
      });
    }
    const newConsumer = await Consumer.create({
      consumerId,
      password: hashedPassword,
      contactNo,
    });

    try {

      const result = await axios.post(config?.webHooks?.consumerHookUrl, {
        consumerId: newConsumer.consumerId,
        contactNo: newConsumer.contactNo,
        
      });
      console.log(result.data, "Webhook called successfully.(consumer)");
    } catch (webhookError) {
      console.error("Error calling webhook:", webhookError.message);
      // Handle the error, e.g., retry logic or log for future debugging
    }
    await newConsumer.save();
    const token = jwt.sign(
      { id: newConsumer?.consumerId, role: "consumer" },
      config.jwt.jwtSecret,
      { expiresIn: config.jwt.jwtAccessTokenExpiry }
    );

    if (!newConsumer) {
      return res.status(400).json({
        message: "Failed to create new consumer",
      });
    }
    return res.status(201).json({
      message: "New consumer created successfully",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while creating new consumer",
    });
  }
};

// Function for consumer login
export const consumerLogin = async (req, res) => {
  const { contactNo, password } = req.body;

  try {
    // Check for existing consumer
    const consumer = await Consumer.findOne({
      where: { contactNo: contactNo },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!consumer) {
      return res.status(404).json({
        message: "Consumer not found. Please register first",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: consumer.consumerId, role: "consumer" },
      config.jwt.jwtSecret,
      { expiresIn: config.jwt.jwtAccessTokenExpiry }

    );
    let isMatch = bcrypt.compareSync(password, consumer?.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Credentials mismatch",
        success: false,
      });
    }

    return res.status(200).json({
      message: "You are successfully logged in",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while logging into consumer account",
    });
  }
};

// Consumer details
export const consumerDetails = async (req, res) => {
  const consumerId = req.id;
  try {
    // Check for existing consumer
    const consumer = await Consumer.findOne({
      where: { consumerId },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
    });
    if (!consumer) {
      return res.status(404).json({
        message: "No consumer found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Getting consumer details",
      success: true,
      consumer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while getting consumer details",
    });
  }
};
//no of consumers
export const totalConsumer = async (req, res) => {
  const { merchantId } = req.params;
  try {
    const ismerchant = await Merchant.findByPk(merchantId);

    if (!ismerchant) {
      return res.status(400).json({
        message: "Wrong merchantId",
        success: false,
      });
    }
    const totalConsumer = await Invoice.count({
      where: { merchantId },
      distinct: true,
      col: "consumerId",
    });

    return res.status(200).json({
      message: "Getting total no of consumer",
      success: true,
      totalConsumer,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Error while fetching total no of consumers",
      success: false,
    });
  }
};
// Get all consumers
export const getAllConsumer = async (req, res) => {
  try {
    const allConsumer = await Consumer.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (!allConsumer || allConsumer.length == 0) {
      return res.status(400).json({
        message: "No consumers found",
      });
    }
    return res.status(200).json({
      message: "Consumer accounts found successfully",
      allConsumer,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching consumer accounts",
      success: false,
    });
  }
};
export const updatePasswordConsumer = async (req, res) => {
  const consumerId = req.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const isConsumer = await Consumer.findByPk(consumerId);
    const ismatchPassword = bcrypt.compareSync(
      currentPassword,
      isConsumer.password
    );

    if (!ismatchPassword) {
      return res.status(400).json({
        message: "Old password mismatch",
        success: false,
      });
    } else {
      isConsumer.password = bcrypt.hashSync(newPassword, 10);
      await isConsumer.save();
    }

    return res.status(200).json({
      message: "New password updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while updating new password of consumer",
      success: false,
    });
  }
};

export const searchMerchantByPincode = async (req, res) => {
  try {
    const { pincode, lat, lon } = req.body;

    let searchPincode = pincode;

    if (!pincode && lat && lon) {
      searchPincode = await getPinCode(lat, lon);
    }

    if (!searchPincode) {
      return res.status(400).json({
        message: "Pincode or coordinates are required",
        success: false,
      });
    }

    const nearByMerchants = await Merchant.findAll({
      where: { pincode: searchPincode },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

    if (nearByMerchants.length === 0) {
      return res.status(404).json({
        message: "No nearby merchants found",
        success: false,
      });
    }

    const merchantsWithRatings = [];
    for (const merchant of nearByMerchants) {
      const feedbacks = await Feedback.findAll({
        include: {
          model: Invoice,
          where: { merchantId: merchant.merchantId },
          attributes: [],
        },
        attributes: ["rating"],
      });

      const ratings = feedbacks.map((item) => item.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          : 0;

      merchantsWithRatings.push({
        ...merchant.get(),
        avgRating,
      });
    }

    return res.status(200).json({
      message: `Found ${nearByMerchants.length} nearby merchants`,
      success: true,
      merchants: merchantsWithRatings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error while searching for nearby merchants",
      success: false,
    });
  }
};
