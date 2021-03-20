const mongoose = require('mongoose');

const GeneralAvailabilitiesSchema = new mongoose.Schema(
  {
    day: { type: String },
    start_hour: { type: String },
    end_hour: { type: String },
  },
  {
    _id: false,
    timestamps: false,
  },
);

module.exports = GeneralAvailabilitiesSchema;
