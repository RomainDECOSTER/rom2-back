const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema(
  {
    salary: { type: Boolean, default: false },
    plain_time: { type: Boolean, default: false },
    middle_time: { type: Boolean, default: false },
    CDD: { type: Boolean, default: false },
    CDI: { type: Boolean, default: false },
    INTERIM: { type: Boolean, default: false },
    help: { type: Boolean, default: false },
    employment_asker: { type: Boolean, default: false },
    home_children: { type: Boolean, default: false },
    country_asker: { type: Boolean, default: false },
    home: { type: Boolean, default: false },
    AAH: { type: Boolean, default: false },
    ESAT: { type: Boolean, default: false },
    young_alone: { type: Boolean, default: false },
    other: { type: Boolean, default: false },
    ESAT_details: { type: String },
    employment_asker_date: { type: Date },
    other_details: { type: String },
    comment: { type: String },
    RSA: { type: Boolean },
  },
  {
    _id: false,
    timestamps: false,
  },
);

module.exports = StateSchema;
