const CustomError = require("./../../classes/CustomError.js");
const { Url } = require("./../../model/index.js");
const { sendJSON } = require("./../../utils/common.js");

const downloadQr = async (req, res, next) => {
  try {
    const { qrID, urlID } = req.body;

    if (!qrID || !urlID) throw new CustomError("Invalid Request", 400);

    const qrDoc = await Url.findOne({
      $and: [{ _id: urlID }, { "qrData._id": qrID }],
    });

    if (!qrDoc) throw new CustomError("Document not found", 404);

    // const qrSchema = qrDoc.qrData.id(qrID);
    const qrSchema  = qrDoc.qrData;
    if (!qrSchema) throw new CustomError("QR Data not found", 404);

    qrSchema.downloads += 1;
    qrSchema.scanCount += 1;
    await qrDoc.save();

    sendJSON(res, qrSchema);
  } catch (err) {
    next(err);
  }
};

module.exports = downloadQr;
