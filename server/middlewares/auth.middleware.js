const CustomError = require("../classes/CustomError");
const { verifyAccessToken } = require("../utils/token");
const dotenv = require("dotenv").config();
function authMiddleware(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;
  if (!token || token === null) {
    throw new CustomError("Un Authorized , No Token Provided!!", 401);
  }

  try {
    const secret = process.env.JWT_KEY;
    const tokenStatus = verifyAccessToken(token, secret);

    if (!tokenStatus.success) {
      throw new CustomError("Unauthorized, Invalid Token Provided!!", 401);
    }

    req.user = tokenStatus.user; 
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
