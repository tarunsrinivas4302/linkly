const CustomError = require("./../../classes/CustomError.js");
const User = require("../../model/User.model");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("./../../utils/token.js");
const { sendJSON } = require("../../utils/common.js");

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new CustomError("Invalid email or password", 400);
    }
    const user = await User.findOne({ email } , {password : 0 , _id : 0 , __v : 0});
    if (!user) {
      throw new CustomError("Email not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid Credentials" , 403);
    }
    const token = generateAccessToken(user);
    if (!token) {
      throw new Error("Failed to generate access token");
    }

    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24, // One day
      
      secure: process.env.NODE_ENV == "production", // Set secure flag only in production
      sameSite: process.env.NODE_ENV == "production" ? "None" : "Lax", // 'Lax' for local testing
    });

    sendJSON(res, { user, token }, "User Authenticated Successfully", 201);
  } catch (err) {
    next(err);
  }
};

module.exports = login;
