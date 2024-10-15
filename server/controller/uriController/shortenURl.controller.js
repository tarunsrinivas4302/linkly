const {
  generateUniqueID,
  validateURL,
  generateShortURI,
  sendJSON,
} = require("./../../utils/common.js");
const CreateQRImage = require("./../../utils/qrcode.js");
const CustomError = require("./../../classes/CustomError.js");

const { Qr, Url } = require("./../../model/index.js");

const dotenv = require("dotenv");
const User = require("../../model/User.model.js");
dotenv.config();

const shortenUrl = async (req, res, next) => {
  try {
    const { originalUrl, title, shortCode: shortcode } = req.body;
    const { id: userID, email } = req.user;
    if (!originalUrl || !title) {
      throw new CustomError("Bad Request", 400);
    }
    userID.toString();
    let shortUrl;

    // if (userData.isPremium && urlID.length > 20) throw new CustomError("Limit exceeded", 403);
    const userData = await User.findOne({ _id: userID });


    if (!userData) throw new CustomError("User not found", 404);

    const isSameUrlExistedToThisUser = await Url.findOne({
      user: userID,
      originalUrl,
      isActive: true,
    })
    if (isSameUrlExistedToThisUser !== null) {
      throw new CustomError("Same Url is Active in your Dashboard...", 301);
    }

    if (!validateURL(originalUrl)) throw new CustomError("Invalid URL ", 400);

    let urlID = generateShortURI(originalUrl);
    if (shortcode) {
      const existingUrl = await Url.findOne({ shortUrl: shortcode });
      if (existingUrl) throw new CustomError("Shortcode already exists", 302);
      urlID = shortcode;
    }

    if (!urlID.includes(process.env.BASE_URI))
      urlID = process.env.BASE_URI +  urlID;

   /* const qrShortCode = process.env.BASE_URI + urlID;
    const qrData = await CreateQRImage(urlID, 300, 300); // Creates a QR Code Image with 300 * 300 px
    if (!qrData) throw new CustomError("Unable to create QR image", 500);

    const qrSchema = {
      qrData,
      description: `Created a QR code Image with 300 * 300 px for this title :: ${title}`,
      createdBy: userID,
    };

    const UrlData = new Url({
      title,
      originalUrl,
      user: userID,
      shortUrl: urlID,
      qrData: qrSchema,
    });*/
     const UrlData = new Url({
      title,
      originalUrl,
      user: userID,
      shortUrl: urlID,
    });

    const urlData = await UrlData.save();
    if (!urlData) {
      throw new CustomError("Failed to Create a Short Url ", 500);
    }

    sendJSON(res, urlData, "Url Created Sucessfully ...", 201);
  } catch (err) {
    next(err);
  }
};

module.exports = shortenUrl;
