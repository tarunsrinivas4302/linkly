const bcrypt = require("bcrypt");
const User = require("../../model/User.model");
const { validateEmail, generateUUID, sendJSON } = require("../../utils/common");
const CustomError = require("./../../classes/CustomError.js");

const register = async (req, res, next) => {
  try {
    const { uname, email, password, avatar, location, isAdmin } = req.body;

    if (!uname || !email || !password) {
      throw new CustomError("Invalid Requet ", 400);
    }

    const saltrounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltrounds);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new CustomError("Email already exists", 400);
    }

    if (!validateEmail(email)) {
      throw new CustomError("Invalid Email", 400);
    }

    const uuid = generateUUID();
    if (!uuid) {
      throw new CustomError("Failed to generate UUID", 500);
    }

    const user = new User({
      userName: uname,
      email,
      uuid,
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });
    const doc = await user.save();

    if (!doc) {
      throw new CustomError("Failed to save User");
    }
    return sendJSON(res, doc, "User Created Sucessfully ", 201);
  } catch (err) {
    next(err);
  }
};
module.exports = register;
