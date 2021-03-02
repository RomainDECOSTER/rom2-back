const mongoose = require('mongoose');

class FamilySituation {
  static getSchema() {
    const schema = new mongoose.Schema(
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
    return schema;
  }
}
exports.default = FamilySituation.getSchema();
