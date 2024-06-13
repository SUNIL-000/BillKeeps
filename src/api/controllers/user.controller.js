import { User } from "../../db/models/user.model.js";
import bcrypt from "bcryptjs";

//userSignup funtiom for creating new user
export const userSignup = async (req, res) => {
  const { user_id, email, password, contactNo, role } = req.body;

  try {
    let newUser;
    //check for undefined values
    if (!user_id || !email || !password || !contactNo || !role) {
      res.status(400).json({
        message: "Please add All the fields",
        success: false,
      });
    }
    //check for find exsting user
    const existingUser = await User.findOne({
      where: {
        user_id: user_id,
      },
    });
    if (existingUser) {
      res.status(200).json({
        message: "User Already exist please login",
        success: true,
      });
    } else {
      const hashedpassword = bcrypt.hashSync(password, 10);
      newUser = await User.create({
        user_id,
        email,
        password: hashedpassword,
        contactNo,
        role,
      });
    }

    if (!newUser) {
      res.status(400).json({
        message: "Failed to create user...",
      });
    }

    res.status(201).json({
      message: "user created successfully...",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error while creating a new user",
    });
  }
};

//get all user
export const getAllUser = async (req, res) => {
  try {
    const getAllUsers = await User.findAll();

    if (!getAllUser) {
      res.status(404).json({
        message: "No user found",
        success: true,
      });
    }
    res
      .status(200)
      .json({ message: "List of User", success: true, getAllUsers });
  } catch (error) {
    res.status(400).json({
      message: "Error occured while fetching allusers",
      success: false,
    });
  }
};
