const mongoose = require('mongoose');

const { Schema } = mongoose;

const Link = new Schema(
  {
    title: String,
    link: { type: String, index: true, unique: true },
    keywords: [String]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Link', Link);
