const mongoose = require('mongoose');
const { mongoDatabase } = require('../../db');

class CampaignSchema {
  static getSchema() {
    const schema = new mongoose.Schema(
      {
        name: { type: mongoose.Schema.Types.String },
        description: { type: mongoose.Schema.Types.String },
      },
      { timestamps: true },
    );
    return schema;
  }
}
const schema = mongoDatabase.mongooseConnection.model('Campaign', CampaignSchema.getSchema());
exports.default = schema;
