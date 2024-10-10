const express = require("express");
const downloadQr = require("../controller/uriController/downloadQR");

const qrRouter = express.Router();

qrRouter.post("/downloadqr", (req, res, next) => {
  downloadQr(req, res, next);
});

module.exports = qrRouter;