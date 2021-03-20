const mongoose = require('mongoose');
const { mongoDatabase } = require('db');
const common = require('../common');
const FamilySituationSchema = require('./FamilySituationSchema');
const SocialMediationSchema = require('./SocialMediationSchema');
const StateSchema = require('./StateSchema');
const LevelSchema = require('./LevelSchema');
const SchoolSchema = require('./SchoolSchema');

const StudentSchema = new mongoose.Schema(
  {
    draft: {
      type: Boolean,
      required: true,
      default: true,
    },
    registration_information: { type: common.RegistrationSchema },
    general_information: { type: common.GeneralInformationSchema },
    availabilities_information: { type: [common.GeneralAvailabilitiesSchema] },
    type: { type: String, enum: ['AS', 'FLE', 'MSB', 'AA'], required: true },
    family_situation: { type: FamilySituationSchema },
    family_ressources: { type: common.FamilyRessourcesSchema },
    life_state: { type: StateSchema },
    social_mediation: { type: SocialMediationSchema },
    workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }],
    workshopsComment: { type: String },
    level: { type: LevelSchema },
    school: { type: SchoolSchema },
    comment: { type: String },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    campaign_history: { type: mongoose.Schema.Types.Mixed },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoDatabase.model('Student', StudentSchema);
