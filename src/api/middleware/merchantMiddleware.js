import jwt from "jsonwebtoken";

export const isMerchant = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({
        message: "Token must be provided",
        success: false,
      });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(data)

    if (data?.role != "merchant") {
      return res.status(400).json({
        message: "Unauthorized access",
        success: false,
      });
    }
    req.id = data.id
    next();
  }
  catch (error) {
    console.log(error)
    return res.status(400).json({
      message: "Error occur merchant middleware",
      success: false,

    });
  }
};
