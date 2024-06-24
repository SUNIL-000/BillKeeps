import { rm } from "fs";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
let JWT_SECRETEKEY = "MY_SECRET_KEY";

import { Product, Merchant } from "../../db/models/index.js";
import { generateID } from "../../utils/generateID.js";

//creating a new merchant account
export const createNewMerchant = async (req, res) => {
  const { buisnessName, gstNo, contactNo, address, password } = req.body;
  const buisnessLogoUrl = req.file;

  //from UUID we just create merchant_id
  let merchant_id = generateID("M");

  try {
    if (!buisnessName || !password || !contactNo) {
      rm(buisnessLogoUrl.path, () => {
        console.log("photo deleted");
      });
      return res.status(409).json({
        message: "please provide the required fields",
        success: false,
      });
    }

    const existingMerchant = await Merchant.findOne({
      where: {
        [Op.or]: [{ contactNo: contactNo }],
      },
    });

    if (existingMerchant) {
      rm(buisnessLogoUrl.path, () => {
        console.log("photo deleted");
      });
      return res.status(409).json({
        message: "Account already exists with this contact number",
        success: false,
      });
    }

    //hashing password before storing
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newMerchant = await Merchant.create({
      merchant_id,
      buisnessName,
      buisnessLogoUrl: buisnessLogoUrl.path,
      gstNo,
      address,
      password: hashedPassword,
      contactNo,
    });
    await newMerchant.save();

    if (!newMerchant) {
      return res.status(409).json({
        message: "Failed to create new merchant account",
        success: false,
      });
    }

    return res.status(201).json({
      message: "New merchant account created successfully...",
      success: true,
      newMerchant,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while creating new merchant account.",
      success: false,
      error,
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

//funtion for merchant login
export const merchantLogin = async (req, res) => {
  const { contactNo, password } = req.body;
  console.log(req.body);

  try {
    // Check for empty value
    if (!contactNo || !password) {
      return res.status(409).json({
        message: "Please provide all the credentials",
        success: false,
      });
    }

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
    if (isMatch) {
      const token = jwt.sign(
        { id: merchant.merchant_id, role: "merchant" },
        JWT_SECRETEKEY,
        {
          expiresIn: "2d",
        }
      );

      return res.status(200).json({
        message: "You are successfully logged in",
        success: true,
        token,
        merchant,
      });
    }

    return res.status(400).json({
      message: "Credential mismatch",
      success: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while logging into merchant account",
    });
  }
};

export const getAllMerchantWithProduct = async (req, res) => {
  try {
    const merchantsProduct = await Merchant.findAll({
      include: {
        model: Product,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    if (!merchantsProduct || merchantsProduct.length == 0) {
      return res.status(400).json({
        message: "No merchant account has been found... ",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Getting all merchant account with their product...",
      success: true,
      merchantsProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(201).json({
      message: "Error while getting all product created by the merchant.",
      success: false,
      error,
    });
  }
};

export const getAllMerchantID = async (req, res) => {
  try {
    const merchantIDs = await Merchant.findAll({
      
      attributes: ["merchant_id"] ,
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
