import { Product, Merchant } from "../../db/models/index.js";
import { generateID } from "../../utils/generateID.js";

//funtion for newproduct creation
export const NewProduct = async (req, res) => {
  const { name, desc, mrp } = req.body;
  const merchantId = req.id;

  try {

    const isMerchant = await Merchant.findOne({ where: { merchantId } })

    if (!isMerchant) {
      return res.status(400).json({
        messgae: "Merchant account not found..",
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
    if (merchantId != existProduct.merchantId) {
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
  const merchantId = req.id;

  try {


    const existProduct = await Product.findByPk(productId);

    if (!existProduct || existProduct.length == 0) {
      return res.status(404).json({
        messgae: "No product found.",
        success: false,
      });
    }
    if (merchantId != existProduct.merchantId) {
      return res.status(400).json({
        messgae: `You are not the owner of this product`,
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

//get single product
export const getSingleProduct = async (req, res) => {
  const { productId } = req.params;
  const merchantId = req.id;

  try {

    const singleProduct = await Product.findOne({
      where: { productId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: Merchant,
        attributes: ['merchantId']
      }
    });

    if (!singleProduct || singleProduct.length == 0) {
      return res.status(404).json({
        messgae: "No product found.",
        success: false,
      });
    }
    if (merchantId != singleProduct?.merchant.merchantId) {
      return res.status(400).json({
        messgae: `You are not the owner of this product`,
        success: false,
      });
    }
    console.log(merchantId)

    return res.status(200).json({
      messgae: "Single product details",
      success: true,
      singleProduct
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      messgae: "error while getting single product",
      success: false,
    });
  }
};



///
export const getAllProductOfSingleMerchant = async (req, res) => {

  const merchantId = req.id;

  try {

    if (!merchantId) {
      return res.status(400).json({
        message: "merchantId required",
        success: false,
      });
    }

    const merchantsProduct = await Merchant.findOne({
      where: { merchantId },
      include: {
        model: Product,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      attributes: ['merchantId'],
    });

    if (!merchantsProduct) {
      return res.status(400).json({
        message: "No merchant account has been found... ",
        success: false,
      });
    }

    if (merchantsProduct.products.length == 0) {
      return res.status(200).json({
        message: `No product has been associated with merchantId ${merchantId} `,
        success: false,
      });
    }

    return res.status(200).json({
      message: `Getting all product accountwith merchantId ${merchantId}`,
      success: true,
      merchantsProduct
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error while getting all product created by the merchant.",
      success: false,
      error,
    });
  }
};


//funtion for getting all product
export const getAllProduct = async (req, res) => {
  try {
    const allProduct = await Product.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },


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