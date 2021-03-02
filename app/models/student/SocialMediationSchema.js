const mongoose = require('mongoose');

class SocialMediation {
  static getSchema() {
    const schema = new mongoose.Schema(
      {
        active: { type: Boolean },
        details: { type: String },
      },
      {
        _id: false,
        timestamps: false,
      },
    );
    return schema;
  }
}
exports.default = SocialMediation.getSchema();
