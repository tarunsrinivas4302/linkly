const dotenv = require("dotenv");
dotenv.config();

const validateURL = (url) => {
  if (!url) return false;
  const regex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))?(?::\d{2,5})?(?:[/?#]\S*)?$/i;

  return regex.test(url);
};

const generateUniqueID = () => {
  const possibleChars = "0123456789abcdefABCDEFG";
  let uniqId = "";
  for (let i = 0; i < 8; i++) {
    uniqId += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  return uniqId + Date.now();
};

const generateUUID = () => {
  // Initialize an array to store the hexadecimal characters
  const hexChars = "0123456789abcdef".split("");

  // Generate a random 32-bit integer (time_low)
  const timeLow = Math.floor(Math.random() * 0xffffffff); // 0xffffffff  represents 32 bits of all ones in binary to get a random 32-bit integer

  // Generate two random 16-bit integers (time_mid and time_hi_and_version)
  const timeMid = Math.floor(Math.random() * 0xffff); // Represents the middle 16 bits of the UUID.
  const timeHiAndVersion = (Math.floor(Math.random() * 0xf) | 0x4000) << 12; // combines the high 4 bits (version 4 identifier) and the next 12 bits (time_hi).

  // Combine the fields into a single 128-bit value
  const uuidBits = ((timeHiAndVersion | timeMid) << 32) | timeLow;

  // Convert the 128-bit value to a string
  let uuidString = "";
  for (let i = 0; i < 64; i += 2) {
    const nibble = (uuidBits >> i) & 0xf;
    uuidString = hexChars[nibble] + uuidString;
  }

  // Insert hyphens at the appropriate positions
  uuidString = `${uuidString.substr(0, 8)}-${uuidString.substr(
    8,
    4
  )}-${uuidString.substr(12, 4)}-${uuidString.substr(
    16,
    4
  )}-${uuidString.substr(20)}`;

  return uuidString;
};

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
};

function validatePhone(phoneNumber) {
  const regex = /^\+?[1-9]\d{8,14}$/;
  return regex.test(phoneNumber);
}
const generateShortURI = (URI) => {
  if (!URI) {
    throw new Error("Invalid URI");
  }

  try {
    const url = new URL(URI);
    const domain = url.hostname;
    const path = url.pathname;
    const search = url.search;
    const searchLength =
      search.length === 0 ? search.length + 1 : search.length;
    const shortcode = searchLength + path.slice(1, 4).toUpperCase();
    const shortcodeURI = `${shortcode}`;

    return shortcodeURI;
  } catch (error) {
    throw new Error("Invalid URL format", error.message);
  }
};

/**
 *
 * @param {Object} res || response Object
 * @param {Object} data || Data You want to Send as Response
 * @param {String} message || Message You Want to Send Response
 * @param {Number} status || Http Status Code You Want to Set Defalt is 200
 * @param {Object} headers || Headers You Want to Set If Any default is False
 * @returns {Object} Response Object With the Data and Headers
 */
const sendJSON = (res, data = {}, message = "", status = 200, headers = {}) => {
  if (headers) {
    Object.keys(headers).forEach((ele) => {
      res.setHeader(ele, headers[ele]);
    });
  }
  res.status(status);
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    error: false,
    status: status,
    message: message || "Success",
    data: data,
  });

  res.end();
  return res;
};

module.exports = {
  validateURL,
  validateEmail,
  validatePhone,
  generateUUID,
  generateShortURI,
  generateUniqueID,
  sendJSON,
};
