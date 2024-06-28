import { Product, Merchant } from "../../db/models/index.js";
import { generateID } from "../../utils/generateID.js";

//funtion for newproduct creation
export const NewProduct = async (req, res) => {
  const {  name, desc, mrp } = req.body;
  const  merchantId = req.id;

  try {
    
    const isMerchant = await Merchant.findOne({where:{merchantId}})

    if(!isMerchant){
      return res.status(400).json({
        messgae: "Invalid Merchant ID",
        success: false,
      });
    }
    const productId = generateID("P");
    const newProduct = await Product.create({
      productId,
      merchantId,
      name,
      desc,
      mrp,
    });

    if (!newProduct) {
      return res.status(400).json({
        messgae: "Failed to create new product",
        success: false,
      });
    }

    return res.status(201).json({
      messgae: "New Product Created successfully",
      success: true,
      newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      messgae: "error while creating new product",
      success: false,
    });
  }
};

//funtion for getting all product
export const getAllProduct = async (req, res) => {
  try {
    const allProduct = await Product.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: {
        model: Merchant,
        attributes: {
          exclude: ["buisnessLogoUrl", "password", "createdAt", "updatedAt"],
        },
      },
    });

    if (!allProduct || allProduct.length == 0) {
      return res.status(404).json({
        messgae: "No product found.",
        success: false,
      });
    }

    return res.status(200).json({
      messgae: "Getting all product",
      success: true,
      allProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      messgae: "error while fetching all product",
      success: false,
    });
  }
};

//funtion for deleting exsting product
export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const merchantId = req.id


  const { name, mrp, desc } = req.body;
  try {
    if (!productId) {
      return res.status(400).json({
        message: "Please provide product id",
        success: false,
      });
    }

    const existProduct = await Product.findByPk(productId);
    

    if (!existProduct || existProduct.length == 0) {
      return res.status(404).json({
        messgae: `No product found with productId ${productId}`,
        success: false,
      });
    }
    if(merchantId !=existProduct.merchantId){
      return res.status(400).json({
        messgae: `You are not the owner of this product`,
        success: false,
      });
    }
    if (name) {
      existProduct.name = name;
    }
    if (mrp) {
      existProduct.mrp = mrp;
    }
    if (desc) {
      existProduct.desc = desc;
    }
    await existProduct.save();

    return res.status(200).json({
      messgae: "Product updated successfully",
      success: true,
      existProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      messgae: "error while updating the product",
      success: false,
    });
  }
};
//funtion for updating exsting product
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    if (!productId) {
      return res.status(409).json({
        message: "Please provide product id",
        success: false,
      });
    }

    const existProduct = await Product.findByPk(productId);

    if (!existProduct || existProduct.length == 0) {
      return res.status(404).json({
        messgae: "No product found.",
        success: false,
      });
    }
    await existProduct.destroy();

    return res.status(200).json({
      messgae: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      messgae: "error while deleting the product",
      success: false,
    });
  }
};
