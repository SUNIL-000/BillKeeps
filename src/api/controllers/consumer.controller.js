import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Consumer } from "../../db/models/index.js";
import { generateID } from "../../utils/generateID.js";

export const createNewConsumer = async (req, res) => {
  const { password, contactNo } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  //from UUID we just create merchantId
  let consumerId = generateID("C");
  try {
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
      consumerId,
      password: hashedPassword,
      contactNo,
    });
    await newConsumer.save();
    const token = jwt.sign(
      { id: newConsumer?.consumerId, role: "consumer" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2d",
      }
    );

    if (!newConsumer) {
      return res.status(400).json({
        message: "failed to create new Consumer",
      });
    }
    return res.status(201).json({
      message: "New consumer created successfully..",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: " Error while creating new consumer..",
    });
  }
};

//funtion for consumer login
export const consumerLogin = async (req, res) => {
  const { contactNo, password } = req.body;

  try {
    //check for exsting consumer
    const consumer = await Consumer.findOne({
      where: { contactNo: contactNo },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!consumer) {
      return res.status(404).json({
        message: "Consumer not found .Register first",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: consumer.consumerId, role: "consumer" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2d",
      }
    );
    let isMatch = bcrypt.compareSync(password, consumer?.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Credential mismatch..",
        success: false,
      });
    }

    return res.status(200).json({
      message: "You are successfully loggedin..",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: " Error while logged into consumer account",
    });
  }
};

//get All consumer
export const getAllConsumer = async (req, res) => {
  try {
    const allConsumer = await Consumer.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password"],
      },
    });

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
