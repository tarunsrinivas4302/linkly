const { default: mongoose } = require("mongoose");
const { Url, Stats } = require("../../model/index.js");
const { sendJSON } = require("../../utils/common.js");
const CustomError = require("./../../classes/CustomError.js");
const updateClicks = async (req, res, next) => {
    try {
        const { urlID, country, city, device } = req.body;
        //const { id: user } = req.user;

        //if (!user) throw new CustomError("Unauthorized", 401);
        if (!urlID) throw new CustomError("Bad Request", 400);

        const shortUrl = process.env.BASE_URI +  urlID
        const newShortUrl = shortUrl.toString().trim()
        let doc;

        if (mongoose.Types.ObjectId.isValid(urlID)) {
            doc = await Url.findOne({ _id: urlID }, { qrData: 0 });
        } else {
            doc = await Url.findOne({ shortUrl: newShortUrl }, { qrData: 0 });
        }

        if (!doc) {
            throw new CustomError("URL not found", 404);
        }

        doc.clicks += 1;
        const newDoc = await doc.save();
  

        // update stats
        const statsDoc = Stats({
            city,
            country,
            device,
            url: newDoc._id,
            clicks: newDoc.clicks
        })

        console.log(statsDoc);
        const data = await statsDoc.save();


        if (data) {
            sendJSON(
                res,
                { success: true, message: "Url Clicked Sucessfully", data: newDoc },
                "Url Clicked Sucessfully",
                200
            );
        }
    } catch (err) {
        next(err);
    }
};

module.exports = updateClicks;
