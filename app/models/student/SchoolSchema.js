const mongoose = require('mongoose');

const MongooseSchema = mongoose.Schema;

const SchoolSchema = new MongooseSchema(
  {
    school_path: { type: String },
    courses_as: [{ type: String }],
    comment: { type: String },
    school_name: { type: String },
    level: { type: String },
    class_room: [{ type: String }],
    option1: { type: String },
    option2: { type: String },
    option3: { type: String },
  },
  { _id: false, versionKey: false },
);

module.exports = SchoolSchema;
