const mongoose = require('mongoose');
const { mongoDatabase } = require('db');

const MongooseSchema = mongoose.Schema;

const PositionedWorkshopSchema = new MongooseSchema(
  {
    workshop: { type: MongooseSchema.Types.ObjectId, ref: 'Workshop' },
    positioned_date: { type: Date },
    animator: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  },
  { timestamps: true },
);

module.exports = mongoDatabase.model('PositionedWorkshop', PositionedWorkshopSchema);
