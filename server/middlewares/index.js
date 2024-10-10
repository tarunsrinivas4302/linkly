const { notFound, errorMiddleware } = require("./error.middleware.js");
const authMiddleware = require("./auth.middleware.js");
module.exports = {
  errorMiddleware,
  authMiddleware,
  notFound,
};
