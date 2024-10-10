const register = require("./../controller/auth/register");
const login = require("./../controller/auth/login");
const logout = require("./../controller/auth/logout");

const express = require("express");

const authRouter = express.Router();

authRouter.post("/save", (req, res, next) => {
  register(req, res, next);
});

authRouter.post("/login", (req, res, next) => {
  login(req, res, next);
});

authRouter.post("/logout", (req, res, next) => {
  logout(req, res, next);
});

module.exports = authRouter;
