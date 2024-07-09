import { rm } from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {  Merchant } from "../../db/models/index.js";
import { generateID } from "../../utils/generateID.js";
``;
//creating a new merchant account
export const createNewMerchant = async (req, res) => {
  const { businessName, gstNo, contactNo, address, password, businessType } =
    req.body;
  const businessLogoUrl = req.file;

  //from UUID we just create merchantId
  let merchantId = generateID("M");

  try {
    const existingMerchant = await Merchant.findOne({
      where: { contactNo: contactNo },
    });

    if (existingMerchant) {
      if (businessLogoUrl) {
        rm(businessLogoUrl.path, () => {
          console.log("Photo deleted");
        });
      }
      return res.status(400).json({
        message: "Merchant account already exists with this contact number",
        success: false,
      });
    }

    //hashing password before storing
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newMerchant = await Merchant.create({
      merchantId,
      businessName,
      businessLogoUrl: `${businessLogoUrl ? businessLogoUrl?.path : ""}`,
      gstNo,
      address,
      businessType,
      password: hashedPassword,
      contactNo,
    });
    await newMerchant.save();
    const token = jwt.sign(
      { id: newMerchant.merchantId, role: "merchant" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2d",
      }
    );

    if (!newMerchant) {
      return res.status(409).json({
        message: "Failed to create new merchant account",
        success: false,
      });
    }

    return res.status(201).json({
      message: "Merchant account created successfully...",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
   
    return res.status(500).json({
      message: "Error while creating new merchant account.",
      success: false,
      error: error,
    });
  }
};

//getting all merchant account
export const getAllMerchant = async (req, res) => {
  try {
    const allMerchant = await Merchant.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    if (!allMerchant || allMerchant.length == 0) {
      return res.status(400).json({
        message: "No merchant account has been found... ",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Getting all merchant account successfully...",
      success: true,
      allMerchant,
    });
  } catch (error) {
    console.log(error);
    return res.status(201).json({
      message: "Error while getting all merchant account.",
      success: false,
      error,
    });
  }
};

//get Merchant Data
export const merchantDetails= async (req, res) => {
    const merchantId = req.id;
  try {
    // Check for existing merchant
    const merchant = await Merchant.findOne({
      where: { merchantId },
      attributes: { exclude: ["createdAt", "updatedAt","password"] },
    });
    if (!merchant) {
      return res.status(404).json({
        message: "No Merchant found",
        success: false,
      });
    }

    
    
    return res.status(200).json({
      message: "Getting merchant details",
      success: true,
      merchant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while getting merchant details",
    });
  }
};
//funtion for merchant login
export const merchantLogin = async (req, res) => {
  const { contactNo, password } = req.body;

  try {
    // Check for existing merchant
    const merchant = await Merchant.findOne({
      where: { contactNo },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found please register",
        success: false,
      });
    }

    let isMatch = bcrypt.compareSync(password, merchant.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Credential mismatch",
        success: false,
      });
    }
    const token = jwt.sign(
      { id: merchant.merchantId, role: "merchant" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2d",
      }
    );
    return res.status(200).json({
      message: "You are successfully logged in",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while logging into merchant account",
    });
  }
};



export const getAllMerchantID = async (req, res) => {
  try {
    const merchantIDs = await Merchant.findAll({
      attributes: ["merchantId"],
    });

    if (!merchantIDs || merchantIDs.length == 0) {
      return res.status(400).json({
        message: "No merchant account has been found... ",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Getting all merchant ID",
      success: true,
      merchantIDs,
    });
  } catch (error) {
    console.log(error);
    return res.status(201).json({
      message: "Error while getting all merchant ID.",
      success: false,
      error,
    });
  }
};
