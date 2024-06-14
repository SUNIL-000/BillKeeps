import { User } from "../../db/models/user.model.js";
import bcrypt from "bcryptjs";

//  for creating a new user
export const userSignup = async (req, res) => {
  const { user_id, email, password, contactNo, role } = req.body;

  try {
   
    if (!user_id || !email || !password || !contactNo || !role) {
      return res.status(409).json({
        message: "Please add all the fields",
        success: false,
      });
    }

    //  for existing user
    const existingUser = await User.findOne({
      where: { user_id },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists, please login...",
        success: true,
      });
    }

    // Create a new user 
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      user_id,
      email,
      password: hashedPassword,
      contactNo,
      role,
    });

    return res.status(201).json({
      message: "User created successfully",
      success: true,
      newUser,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error while creating a new user",
      success: false,
    });
  }
};

// Get all users function
export const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.findAll();

    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({
        message: "No users found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "List of users",
      success: true,
      users: allUsers,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error occurred while fetching users",
      success: false,
    });
  }
};
