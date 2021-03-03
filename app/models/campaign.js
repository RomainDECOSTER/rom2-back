const mongoose = require('mongoose');
const { mongoDatabase } = require('db');

const MongooseSchema = mongoose.Schema;

const CampaignSchema = new MongooseSchema(
  {
    name: { type: mongoose.Schema.Types.String, required: true, unique: true },
    description: { type: mongoose.Schema.Types.String },
  },
  { timestamps: true },
);

module.exports = mongoDatabase.model('Campaign', CampaignSchema);
