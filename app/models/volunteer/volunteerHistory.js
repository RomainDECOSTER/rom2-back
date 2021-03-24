const mongoose = require('mongoose');
const { mongoDatabase } = require('db');

const { Schema } = mongoose;
const { Types } = Schema;

const VolunteerHistory = new Schema(
  {
    user: { type: Types.String },
    action: { type: Types.String },
    volunteer: { type: Types.Mixed },
  },
  { timestamps: true },
);

module.exports = mongoDatabase.model('VolunteerHistory', VolunteerHistory);
