const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema(
  {
    date: { type: Date },
    number: { type: Number },
    fresh: { type: Boolean },
    first_date: { type: Date },
    know_lacle: { type: String },
    other_known: { type: String },
  },
  {
    _id: false,
  },
);

module.exports = RegistrationSchema;
