const express = require("express");
const { shortenUrl, deleteShortURI } = require("../controller/uriController");
const getUrls = require("../controller/user/getUrls");
const getSingleUrl = require("../controller/uriController/getSingleUrl");
const updateClicks = require("../controller/uriController/updateClicks");
const getStats = require("../controller/uriController/getStats");
const router = express.Router();
router.post("/shorten", (req, res, next) => {
  shortenUrl(req, res, next);
});

router.delete("/delete", (req, res, next) => {
  deleteShortURI(req, res, next);
});

router.get("/getUrls", (req, res, next) => {
  getUrls(req, res, next);
});

router.post("/update", (req, res, next) => {
  updateClicks(req, res, next);
});

router.post("/getSingleUrl", (req, res, next) => {
  getSingleUrl(req, res, next);
});
router.post("/stats", (req, res, next) => {
  getStats(req, res, next);
});
module.exports = router;
