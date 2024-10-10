const CustomError = require("../../classes/CustomError.js");
const { Url } = require("./../../model/index.js");
require("dotenv").config();

const redirectToShortenedUrl = async (req, res, next) => {
  const { shortcode } = req.params;
  try {
    if (!shortcode) {
      throw new CustomError("Invalid shortcode", 404);
    }

    const shortUrl = process.env.BASE_URI + shortcode;

    const document = await Url.findOne({ shortUrl });
    if (!document) {
      throw new CustomError("Url You're trying is Not Existed ...", 404);
    }
    document.clicks += 1;
    await document.save();

    res.redirect(document.originalUrl);

  } catch (err) {
    next(err);
  }
};

module.exports = redirectToShortenedUrl;
