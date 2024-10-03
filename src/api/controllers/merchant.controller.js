import { rm } from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Merchant } from "../../db/models/index.js";
import { generateID } from "../../utils/generateID.js";

// Creating a new merchant account
export const createNewMerchant = async (req, res) => {
  const { businessName, gstNo, contactNo, address, password, businessType, pincode } = req.body;
  const businessLogoUrl = req.file;

  // Generate merchantId using UUID
  let merchantId = generateID("M");

  try {
    const existingMerchant = await Merchant.findOne({
      where: { contactNo: contactNo },
    });

    if (existingMerchant) {
      if (businessLogoUrl) {
        rm(businessLogoUrl?.path, () => {
          console.log("Photo deleted");
        });
      }
      return res.status(400).json({
        message: "Merchant account already exists with this contact number",
        success: false,
      });
    }

    // Hashing password before storing
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
      pincode
    });
    await newMerchant.save();

    const token = jwt.sign(
      { id: newMerchant.merchantId, role: "merchant" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
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

// Getting all merchant accounts
export const getAllMerchant = async (req, res) => {
  try {
    const allMerchants = await Merchant.findAll({
      attributes: { exclude: ["password", "createdAt", "updatedAt"] },
    });

    if (!allMerchants || allMerchants.length == 0) {
      return res.status(400).json({
        message: "No merchant account has been found...",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Getting all merchant accounts successfully...",
      success: true,
      allMerchants,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while getting all merchant accounts.",
      success: false,
      error,
    });
  }
};

// Get Merchant Data
export const merchantDetails = async (req, res) => {
  const merchantId = req.id;
  try {
    const merchant = await Merchant.findOne({
      where: { merchantId },
      attributes: { exclude: ["createdAt", "updatedAt", "password"] },
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

// Function for merchant login
export const merchantLogin = async (req, res) => {
  const { contactNo, password } = req.body;

  try {
    const merchant = await Merchant.findOne({
      where: { contactNo },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found, please register",
        success: false,
      });
    }

    const isMatch = bcrypt.compareSync(password, merchant?.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Credential mismatch",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: merchant.merchantId, role: "merchant" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
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

// Getting all Merchant IDs
export const getAllMerchantID = async (req, res) => {
  try {
    const merchantIDs = await Merchant.findAll({
      attributes: ["merchantId"],
    });

    if (!merchantIDs || merchantIDs.length == 0) {
      return res.status(400).json({
        message: "No merchant account has been found...",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Getting all merchant IDs",
      success: true,
      merchantIDs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while getting all merchant IDs.",
      success: false,
      error,
    });
  }
};

//update merchant / buisness controller

export const updateMerchant = async (req, res) => {
  const { businessName, gstNo, contactNo, address, businessType ,pincode} = req.body;
  const { merchantId } = req.params;
  const newBusinessLogo = req.file;

  try {
    const existingMerchant = await Merchant.findByPk(merchantId);

    if (!existingMerchant) {
      return res.status(404).json({
        message: "Merchant not found",
        success: false,
      });
    }

    if (existingMerchant.businessLogoUrl && newBusinessLogo) {
      rm(existingMerchant?.businessLogoUrl, (err) => {
        if (err) {
          console.error("Error while removing old photo", err);
        } else {
          console.log("Old photo removed");
        }
      });
    }
    // Update merchant 
    const updateFields = {};
    if (businessName) updateFields.businessName = businessName;
    if (gstNo) updateFields.gstNo = gstNo;
    if (contactNo) updateFields.contactNo = contactNo;
    if (address) updateFields.address = address;
    if (businessType) updateFields.businessType = businessType;
    if (pincode) updateFields.pincode = pincode;
    if (newBusinessLogo) updateFields.businessLogoUrl = newBusinessLogo.path;


    const updatedMerchant = await Merchant.update(updateFields, {
      where: { merchantId }
    });
    return res.status(200).json({
      message: "Merchant updated successfully.",
      success: true,

    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while updating merchant details.",
      success: false,
      error,
    });
  }
};
