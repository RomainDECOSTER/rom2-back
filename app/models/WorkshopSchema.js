const mongoose = require('mongoose');
const { mongoDatabase } = require('db');

class WorkshopSchema {
  static getSchema() {
    const schema = new mongoose.Schema(
      {
        name: { type: mongoose.Schema.Types.String },
      },
      {
        timestamps: true,
      },
    );
    return schema;
  }
}
const schema = mongoDatabase.mongooseConnection.model('Workshop', WorkshopSchema.getSchema());
exports.default = schema;
