const mongoose = require('mongoose');

class AddressSchema {
  static getSchema() {
    const schema = new mongoose.Schema(
      {
        address_description: { type: String },
        district: { type: String },
        city: { type: String },
        zip_code: { type: String },
        district_priority: { type: Boolean },
      },
      {
        timestamps: false,
        _id: false,
      },
    );
    return schema;
  }
}
exports.default = AddressSchema.getSchema();
