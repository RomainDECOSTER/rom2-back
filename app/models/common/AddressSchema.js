const mongoose = require('mongoose');

const MongooseSchema = mongoose.Schema;

const AddressSchema = new MongooseSchema(
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

module.exports = AddressSchema;
