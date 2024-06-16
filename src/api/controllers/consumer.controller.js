import { Op } from "sequelize";
import { Consumer } from "../../db/models/consumer.model.js";
import {v4 as uuid} from "uuid"
import bcrypt from "bcryptjs"


export const createNewConsumer = async (req, res) => {
  const { user_id, email, password, contactNo } = req.body;
  
  const hashedPassword=  bcrypt.hashSync(password,10);
  
  //generating uuid
  let uid=uuid();
  

  //from UUID we just create consumer_id
  let consumer_id =`C${user_id}${uid}`.split("-").join("").substring(0,10); 
  try {
    
    //check for empty value 
    if(!user_id|| !email || !password || !contactNo){
      return res.status(409).json({
        message:"Please insert all the required fields",
        success:false
      })
    }
    //check for exsting consumer
    const existingConsumer = await Consumer.findOne({
      where:{
        [Op.or]: [
          { user_id: user_id },
          { contactNo: contactNo },
          { email: email },
        ],
      },
    })
    if(existingConsumer){
      return res.status(400).json({
        message:"You are already registered please login",
        success:false
      })
    }
    const newConsumer = await Consumer.create({
      consumer_id,
      user_id,
      email,
      password:hashedPassword,
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
      newConsumer
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: " Error whilecreating new consumer..",
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
