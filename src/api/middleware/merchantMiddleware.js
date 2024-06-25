import jwt from "jsonwebtoken";

export const isMerchant = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (data.role != "merchant") {
      return res.status(400).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    next();
  } catch (error) {
    return res.status(400).json({
      message: "Unauthorized access",
      success: false,
    });
  }
};
