const mongoose = require('mongoose');

class GeneralAvailabilitiesSchema {
  static getSchema() {
    const schema = new mongoose.Schema(
      {
        day: { type: String },
        hours: { type: Array },
      },
      {
        _id: false,
        timestamps: false,
      },
    );
    return schema;
  }
}
exports.default = GeneralAvailabilitiesSchema.getSchema();
