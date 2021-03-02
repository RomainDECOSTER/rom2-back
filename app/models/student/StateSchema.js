const mongoose = require('mongoose');

class State {
  static getSchema() {
    const schema = new mongoose.Schema(
      {
        salary: { type: Boolean, default: false },
        plainTime: { type: Boolean, default: false },
        middleTime: { type: Boolean, default: false },
        CDD: { type: Boolean, default: false },
        CDI: { type: Boolean, default: false },
        INTERIM: { type: Boolean, default: false },
        help: { type: Boolean, default: false },
        employmentAsker: { type: Boolean, default: false },
        homeChildren: { type: Boolean, default: false },
        countryAsker: { type: Boolean, default: false },
        home: { type: Boolean, default: false },
        AAH: { type: Boolean, default: false },
        ESAT: { type: Boolean, default: false },
        youngAlone: { type: Boolean, default: false },
        other: { type: Boolean, default: false },
        ESATDetails: { type: String },
        employmentAskerDate: { type: Date },
        otherDetails: { type: String },
        comment: { type: String },
        RSA: { type: Boolean },
      },
      {
        _id: false,
        timestamps: false,
      },
    );
    return schema;
  }
}
exports.default = State.getSchema();
