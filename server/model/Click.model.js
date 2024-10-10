const mongoose = require("mongoose");
const { User, Url } = require("./index.js");

const statsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required  : false,
  },
  url: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
  },
  city: {
    type: String,
    default: "Hyderabad"
  },
  country : {
    type: String,
    default: "India"
  },
  device: {
    type: String,
    default: "Desktop"
  },
  clicks: {
    type: Number
  }

}, {timestamps : true })


const Stats = mongoose.model('Stats', statsSchema);
module.exports = Stats;