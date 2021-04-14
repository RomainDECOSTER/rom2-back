const mongoose = require('mongoose');
const { mongoDatabase } = require('db');
const AvailabilitiesSchema = require('./common/GeneralAvailabilitiesSchema');

const MongooseSchema = mongoose.Schema;

const InterviewSchema = new MongooseSchema(
  {
    interviewed_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    interviewed_type: { type: String, enum: ['volunteer', 'student'] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    interviewed_classmate_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    interviewed_classmate_type: { type: String, enum: ['volunteer', 'student'] },
    school_subject: { type: String },
    school_subject_hours: { type: AvailabilitiesSchema },
    stop_date: { type: Date },
    volunteer_stop: { type: Boolean },
    student_stop: { type: Boolean },
    details: { type: String },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

module.exports = mongoDatabase.model('Interview', InterviewSchema);
