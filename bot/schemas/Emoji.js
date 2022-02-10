const mongoose = require('mongoose');

const { Schema } = mongoose;

const Emoji = new Schema(
  {
    word: [String],
    emoji: [String],
    probability: Number,
    options: {
      min: Number,
      fixed: [String],
      start: [String],
      end: [String],
      isExact: Boolean
    },
    isHidden: Boolean
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Emoji', Emoji);
