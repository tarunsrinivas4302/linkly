const jwt = require("jsonwebtoken");
const dotenv = require("dotenv")
dotenv.config();

function generateAccessToken(user) {
  try {
    const payload = {
      id: user.id,
      email: user.email,
    };
    const secret = process.env.JWT_KEY;
    const TokenAge = 1000 * 60 * 60 * 24; // 24 hours

    const options = { expiresIn: TokenAge };
    const token = jwt.sign(payload, secret, options);
    return token;
  } catch (err) {
    console.log(err.message);
  }
}

function verifyAccessToken(token, secret) {
  try {
    const decoded = jwt.verify(token, secret);
    return { success : true , user: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};
