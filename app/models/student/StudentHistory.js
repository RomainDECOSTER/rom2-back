const mongoose = require('mongoose');
const { mongoDatabase } = require('db');

const { Schema } = mongoose;
const { Types } = Schema;

const StudentHistory = new Schema(
  {
    user: { type: Types.String },
    action: { type: Types.String },
    student: { type: Types.Mixed },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoDatabase.model('StudentHistory', StudentHistory);
