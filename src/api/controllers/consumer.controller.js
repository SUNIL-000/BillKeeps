import { Op } from "sequelize";
import { Consumer } from "../../db/models/consumer.model.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
let JWT_SECRETEKEY = "MY_SECRET_KEY";

export const createNewConsumer = async (req, res) => {
  const { password, contactNo } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);

  //generating uuid
  let uid = uuid();

  //from UUID we just create consumer_id
  let consumer_id = `C${uid}`
    .split("-")
    .join("")
    .substring(0, 10)
    .toUpperCase();
  try {
    //check for empty value
    if (!password || !contactNo) {
      return res.status(409).json({
        message: "Please insert all the required fields",
        success: false,
      });
    }
    //check for exsting consumer
    const existingConsumer = await Consumer.findOne({
      where: { contactNo: contactNo },
    });
    if (existingConsumer) {
      return res.status(400).json({
        message: "You are already registered please login",
        success: false,
      });
    }
    const newConsumer = await Consumer.create({
      consumer_id,
      password: hashedPassword,
      contactNo,
    });
    await newConsumer.save();

    if (!newConsumer) {
      return res.status(400).json({
        message: "failed to create new Consumer",
      });
    }
    return res.status(201).json({
      message: "New consumer created successfully..",
      newConsumer,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: " Error whilecreating new consumer..",
    });
  }
};

//funtion for consumer login
export const consumerLogin = async (req, res) => {
  const { consumer_id, password } = req.body;

  try {
    //check for empty value
    if (!consumer_id || !password) {
      return res.status(409).json({
        message: "Please provide all the credential",
        success: false,
      });
    }
    //check for exsting consumer
    const consumer = await Consumer.findOne({
      where: { consumer_id: consumer_id },
    });

    if (!consumer) {
      return res.status(200).json({
        message: "Consumer not found",
        success: false,
      });
    }

    const token = jwt.sign({ id: consumer.consumer_id }, JWT_SECRETEKEY, {
      expiresIn: "2d",
    });
    let isMatch = bcrypt.compareSync(password, consumer?.password);
    if (isMatch) {
      return res.status(200).json({
        message: "You are successfully loggedin..",
        success: true,
        token,
      });
    }

    return res.status(400).json({
      message: "Credential mismatch..",
      success: false,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: " Error while log into consumer account",
    });
  }
};

//get All consumer
export const getAllConsumer = async (req, res) => {
  try {
    const allConsumer = await Consumer.findAll();

    if (!allConsumer || allConsumer.length == 0) {
      return res.status(400).json({
        message: "No Consumer found",
      });
    }
    return res.status(200).json({
      message: "Consumers account found successfully",
      allConsumer,
    });
  } catch (error) {
    return res.status(500).json({
      message: " Error fetching new consumer..",
    });
  }
};
