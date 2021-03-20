const mongoose = require('mongoose');

const SocialMediation = new mongoose.Schema(
  {
    active: { type: Boolean },
    details: { type: String },
  },
  {
    _id: false,
    timestamps: false,
  },
);

module.exports = SocialMediation;
