const mongoose = require('mongoose');

const MongooseSchema = mongoose.Schema;

const LevelSchema = new MongooseSchema(
  {
    initial_level: { type: String },
    final_level: { type: String },
    certification: { type: String },
    certification_final: { type: String },
    MIFE: { type: String },
    level_comment: { type: String },
  },
  {
    _id: false,
    versionKey: false,
  },
);

module.exports = LevelSchema;
