import fs from "fs/promises";
import { Merchant } from "../../db/models/merchant.model.js";
import { rm } from "fs";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
let JWT_SECRETEKEY = "MY_SECRET_KEY";
//creating a new merchant account
export const createNewMerchant = async (req, res) => {
  const {
    user_id,
    buisnessName,
    gstNo,
    address,
    password,
    email,
    contactNo,
    role,
  } = req.body;
  const buisnessLogoUrl = req.file;

  //generating uuid
  let uid = uuid();

  //from UUID we just create merchant_id
  let merchant_id = `M${user_id}${uid}`.split("-").join("").substring(0, 10);

  try {
    if (
      !user_id ||
      !buisnessName ||
      !password ||
      !email ||
      !contactNo ||
      !role
    ) {
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
        [Op.or]: [
          { buisnessName: buisnessName },
          { contactNo: contactNo },
          { email: email },
        ],
      },
    });

    if (existingMerchant) {
      rm(buisnessLogoUrl.path, () => {
        console.log("photo deleted");
      });
      return res.status(400).json({
        message: " This merchant account already present please login ",
        success: false,
      });
    }

    //hashing password before storing
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newMerchant = await Merchant.create({
      merchant_id,
      user_id,
      buisnessName,
      buisnessLogoUrl: buisnessLogoUrl.path,
      gstNo,
      address,
      password: hashedPassword,
      email,
      contactNo,
      role,
    });
    await newMerchant.save();

    if (!newMerchant) {
      return res.status(400).json({
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
    return res.status(201).json({
      message: "Error while creating new merchan account.",
      success: false,
      error,
    });
  }
};

//getting all merchant account
export const getAllMerchant = async (req, res) => {
  try {
    const allMerchant = await Merchant.findAll({
      attributes: { exclude: ["password"] },
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
  const { merchant_id, password } = req.body;

  try {
    // Check for empty value
    if (!merchant_id || !password) {
      return res.status(409).json({
        message: "Please provide all the credentials",
        success: false,
      });
    }

    // Check for existing merchant
    const merchant = await Merchant.findOne({ where: { merchant_id } });
    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found",
        success: false,
      });
    }

    let isMatch = bcrypt.compareSync(password, merchant.password);
    if (isMatch) {
      const token = jwt.sign({ id: merchant.merchant_id }, JWT_SECRETEKEY, {
        expiresIn: "2d",
      });

      return res.status(200).json({
        message: "You are successfully logged in",
        success: true,
        token,
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