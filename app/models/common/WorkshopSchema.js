const mongoose = require('mongoose');

const MongooseSchema = mongoose.Schema;

const WorkshopManagmentSchema = new MongooseSchema(
  {
    positioned_workshop: { type: MongooseSchema.Types.ObjectId, ref: 'PositionedWorkshop' },
    accepted: { type: Boolean, default: false },
    accepted_date: { type: Date },
    present: { type: Boolean, default: false },
  },
  {
    _id: false,
    timestamps: false,
  },
);

const WorkshopSchema = new MongooseSchema(
  {
    workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }],
    workshops_comment: { type: String },
    workshop_managments: [{ type: WorkshopManagmentSchema }],
  },
  {
    _id: false,
    timestamps: false,
  },
);

module.exports = WorkshopSchema;
