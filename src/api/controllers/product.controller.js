import { Product } from "../../db/models/product.model.js";

export const NewProduct = (req, res) => {
  const { product_id, name, desc, price } = req.body;
  try {

    if(!product_id || !name ||! desc || !price ){
        return res.status(409).json({
            messgae: "Please provide the required detail's",
            success: false,
          });
    }
    const newProduct = Product.create({
      product_id,
      name,
      desc,
      price,
    });

    if (!newProduct) {
      return res.status(404).json({
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
    console.log(error)
    return res.status(500).json({
        messgae: "error while creating new product",
        success: false,
        
      });
  }
};
