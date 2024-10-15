const mongoose = require("mongoose");
const { User } = require("./index.js");




const urlSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    originalUrl: {
      type: String,
      required: true,

      validate: {
        validator: (v) =>
          /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
            v
          ),
        message: "Please enter a valid URL",
      },
    },
    clicks: {
      type: Number,
      default: 0,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);
urlSchema.index({ title: 1, user: 1, originalUrl: 1 }, { unique: true }, { '$**': 'text' });


const URL = mongoose.model("Url", urlSchema);

urlSchema.statics.findOriginalUrl = function (originalURL) {
  return this.findOne({
    originalURL: originalURL,
  });
};

urlSchema.statics.findByShortURL = function (shortURL) {
  return this.findOne({ shortURL: shortURL });
};

module.exports = URL;
