const mongoose = require('mongoose');

const { Schema } = mongoose;

const Link = new Schema(
  {
    link: { type: String, unique: true },
    keywords: [String]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Link', Link);
