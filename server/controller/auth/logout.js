
const { sendJSON } = require("../../utils/common.js");


const logout = async (req, res, next) => {
  try {
    console.log("LogOut Invoked");
    const cookie = req.headers.cookie;
    if (cookie) {
      cookie.split("; ").forEach((ele) => {
        if (ele.toLowerCase().includes("token")) {
          console.log("Token Found", ele);
          const [tokenKey, tokenValue] = ele.split("=");
          res.setHeader(
            "Set-Cookie",
            `${tokenKey}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
          );
        }
      });
    }
    // Ensure the response is sent only once
    // res.status(200).send("Logged out successfully");
    sendJSON(res , {success : true ,}, "logged out successfully" ,200)

    
  } catch (err) {
    next(err);
  }
};

module.exports = logout;


