const express = require("express");
const getProfile = require("../controller/auth/getProfile.js");

const userRouter = express.Router();

userRouter.get("/profile", (req, res, next) => {
  getProfile(req, res, next);
});

module.exports = userRouter;
