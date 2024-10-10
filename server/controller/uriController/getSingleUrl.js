const { Url } = require("../../model/index.js");
const { sendJSON } = require("../../utils/common.js");
const CustomError = require("./../../classes/CustomError.js");

const getSingleUrl = async (req, res, next) => {
  try {
    const { urlID } = req.body;
    const { id: userID } = req.user;

    if (!userID) throw new CustomError("Un Authorized ", 401);

    if (!urlID) throw new CustomError("Bad  Request", 400);

    const query = { user: userID, _id: urlID };
    const projection = {};

    const urlData = await Url.findOne(query, projection);

    if (!urlData) throw new CustomError("Document not found", 404);

    sendJSON(res, urlData, "Url Data Fetched Sucessfully", 200);
    
  } catch (e) {
    next(e.message);
  }
};
module.exports = getSingleUrl;
