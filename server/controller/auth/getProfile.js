const CustomError = require("./../../classes/CustomError.js");
const { sendJSON } = require("./../../utils/common.js");
const { User } = require("./../../model/index.js");
const getProfile = async (req, res, next) => {
  try {
    const { id: userID } = req.user;
    if (!userID) throw new CustomError("UnAuthorized ", 401);

    const user = await User.findOne({ _id: userID } , {password : 0 , });
    if (!user) throw new CustomError("User not found", 404);
    sendJSON(res, user, "User Fetched Sucessfully", 200);
  } catch (err) {
    next(err);
  }
};

module.exports = getProfile;
