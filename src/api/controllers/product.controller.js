import { Merchant } from "../../db/models/merchant.model.js";
import { Product } from "../../db/models/product.model.js";
import { v4 as uuid } from "uuid";

//funtion for newproduct creation
export const NewProduct = async (req, res) => {
  const { merchant_id, name, desc, price } = req.body;
  console.log(req.body);
  try {
    if (!name || !desc || !price || !merchant_id) {
      return res.status(409).json({
        messgae: "Please provide the product detail's",
        success: false,
      });
    }
    const id = uuid();
    const product_id = `P${id}`.split("-").join("").substring(0, 10);
    const newProduct = await Product.create({
      product_id,
      merchant_id,
      name,
      desc,
      price,
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
    const allProduct = await Product.findAll();

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
  const { product_id } = req.params;
  const { name, price, desc } = req.body;
  try {
    if (!product_id) {
      return res.status(409).json({
        message: "Please provide product id",
        success: false,
      });
    }

    const existProduct = await Product.findByPk(product_id);

    if (!existProduct || existProduct.length == 0) {
      return res.status(404).json({
        messgae: "No product found.",
        success: false,
      });
    }
    if (name) {
      existProduct.name = name;
    }
    if (price) {
      existProduct.price = price;
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
      messgae: "error while updatinf=g the product",
      success: false,
    });
  }
};
//funtion for updating exsting product
export const deleteProduct = async (req, res) => {
  const { product_id } = req.params;
  try {
    if (!product_id) {
      return res.status(409).json({
        message: "Please provide product id",
        success: false,
      });
    }

    const existProduct = await Product.findByPk(product_id);

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
