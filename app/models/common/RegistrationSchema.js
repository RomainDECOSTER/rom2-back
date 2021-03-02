const mongoose = require('mongoose');

class RegistrationSchema {
  static getSchema() {
    const schema = new mongoose.Schema(
      {
        date: { type: Date },
        number: { type: Number },
        fresh: { type: Boolean },
        first_date: { type: Date },
        know_lacle: { type: String },
        other_known: { type: String },
      },
      {
        _id: false,
      },
    );
    return schema;
  }
}
exports.default = RegistrationSchema.getSchema();
