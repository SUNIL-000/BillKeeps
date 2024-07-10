import { Op } from "sequelize";
import { Product, Merchant } from "../../db/models/index.js";
import { generateID } from "../../utils/generateID.js";

// Function for new product creation
export const NewProduct = async (req, res) => {
  const { name, desc, mrp } = req.body;
  const merchantId = req.id;

  try {
    const isMerchant = await Merchant.findOne({ where: { merchantId } });

    if (!isMerchant) {
      return res.status(400).json({
        message: "Merchant account not found.",
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
        message: "Failed to create new product",
        success: false,
      });
    }

    return res.status(201).json({
      message: "New Product created successfully",
      success: true,
      newProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while creating new product",
      success: false,
    });
  }
};

// Function for updating existing product
export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const merchantId = req.id;
  const { name, mrp, desc } = req.body;

  try {
    if (!productId) {
      return res.status(400).json({
        message: "Please provide product ID",
        success: false,
      });
    }

    const existProduct = await Product.findByPk(productId);

    if (!existProduct) {
      return res.status(404).json({
        message: `No product found with productId ${productId}`,
        success: false,
      });
    }

    if (merchantId != existProduct.merchantId) {
      return res.status(400).json({
        message: "You are not the owner of this product",
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
      message: "Product updated successfully",
      success: true,
      existProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while updating the product",
      success: false,
    });
  }
};

// Function for deleting existing product
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const merchantId = req.id;

  try {
    const existProduct = await Product.findByPk(productId);

    if (!existProduct) {
      return res.status(404).json({
        message: "No product found.",
        success: false,
      });
    }

    if (merchantId != existProduct.merchantId) {
      return res.status(400).json({
        message: "You are not the owner of this product",
        success: false,
      });
    }

    await existProduct.destroy();

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while deleting the product",
      success: false,
    });
  }
};

// Get single product
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

    if (!singleProduct) {
      return res.status(404).json({
        message: "No product found.",
        success: false,
      });
    }

    if (merchantId != singleProduct.merchant.merchantId) {
      return res.status(400).json({
        message: "You are not the owner of this product",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Single product details",
      success: true,
      singleProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while getting single product",
      success: false,
    });
  }
};

// Get all products of a single merchant
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
        attributes: { exclude: ["createdAt", "updatedAt", "merchantId"] },
      },
      attributes: ['merchantId'],
    });

    if (!merchantsProduct) {
      return res.status(400).json({
        message: "No merchant account has been found.",
        success: false,
      });
    }

    if (merchantsProduct.products.length == 0) {
      return res.status(200).json({
        message: `No product has been associated with merchantId ${merchantId}`,
        success: false,
      });
    }

    return res.status(200).json({
      message: `Getting all products with merchantId ${merchantId}`,
      success: true,
      merchantsProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error while getting all products created by the merchant.",
      success: false,
      error,
    });
  }
};

// Search product by its name
export const searchProduct = async (req, res) => {
  const merchantId = req.id;
  const { name } = req.query;

  try {
    if (!merchantId) {
      return res.status(400).json({
        message: "merchantId required",
        success: false,
      });
    }

    const searchProduct = await Product.findAll({
      where: {
        merchantId: merchantId,
        name: {
          [Op.iLike]: `%${name.trim()}%`
        }
      },
      attributes: { exclude: ['createdAt', 'updatedAt', 'merchantId'] },
    });

    if (!searchProduct || searchProduct.length == 0) {
      return res.status(400).json({
        message: "No product found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Getting products",
      success: true,
      searchProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error while searching the product.",
      success: false,
      error,
    });
  }
};

// Function for getting all products
export const getAllProduct = async (req, res) => {
  try {
    const allProducts = await Product.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!allProducts || allProducts.length == 0) {
      return res.status(404).json({
        message: "No product found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Getting all products",
      success: true,
      allProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while fetching all products",
      success: false,
    });
  }
};
