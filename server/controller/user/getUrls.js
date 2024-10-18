const { Url } = require("./../../model/index.js");
const { sendJSON } = require("./../../utils/common.js");
const CustomError = require("./../../classes/CustomError.js");

const getUrls = async (req, res, next) => {
  try {
    const { id: userID } = req.user;
    const page = parseInt(req.query.page, 10) || 1; // default page is 1
    const limit = parseInt(req.query.limit, 10) || 10; // default limit is 10;
    const offset = (page - 1) * limit;
    if (!userID) throw new CustomError("Un Authorized", 401);

    const query = {
      $and: [{ user: userID }, { isActive: true }],
    };
    const projection = {
      __v: 0
    };
    const allUrls = await Url.find(query, projection)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const totalCount = await Url.countDocuments({
      $and: [{ user: userID }, { isActive: true }],
    });
    const pageInfo = {
      page,
      limit,
      totalCount,
      prevPage: page > 1 ? page - 1 : 1,
      nextPage: page < Math.ceil(allUrls.length / limit) ? page + 1 : null,
    };

    if (allUrls.length == 0) {
      sendJSON(res, "No Records Found");
    }

    const data = { allUrls, pageInfo };
    sendJSON(res, data, "Data Fetched Sucessfully ", 200);
  } catch (err) {
    next(err);
  }
};

module.exports = getUrls;
