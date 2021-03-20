const mongoose = require('mongoose');

const FamilySituation = new mongoose.Schema(
  {
    alone: { type: Boolean, default: false },
    couple: { type: Boolean, default: false },
    children: { type: Boolean, default: false },
  },
  {
    _id: false,
    timestamps: false,
  },
);
module.exports = FamilySituation;
