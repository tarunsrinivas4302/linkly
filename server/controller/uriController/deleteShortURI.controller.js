const { Url } = require("../../model/index.js");
const { sendJSON } = require("../../utils/common.js");
const CustomError = require("./../../classes/CustomError.js");

const deleteShortURI = async (req, res, next) => {
  try {
    console.log(req.body);
    const { urlID } = req.body;
    const { id: userID } = req.user;

    if (!userID) throw new CustomError("Un Authorized ", 401);

    if (!urlID) throw new CustomError("Bad  Request", 400);

    const query = { user: userID, _id: urlID };
    const updatedoc = { $set: { isActive:  false} };
    const options = { new: true };
    const urlData = await Url.findOneAndDelete(query, updatedoc, options);
    sendJSON(res, {success : true , message : "Url Deleted Sucessfully ...."}, "Url Deleted Sucessfully", 200);
  } catch (err) {
    next(err);
  }
};

module.exports = deleteShortURI;
