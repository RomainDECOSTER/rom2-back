const mongoose = require('mongoose');
const { mongoDatabase } = require('db');

const WorkshopSchema = new mongoose.Schema(
  {
    name: { type: mongoose.Schema.Types.String },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoDatabase.model('Workshop', WorkshopSchema);
