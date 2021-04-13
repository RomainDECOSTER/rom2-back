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
    uuid: { type: mongoose.Schema.Types.String },
    registration_information: { type: common.RegistrationSchema },
    general_information: { type: common.GeneralInformationSchema },
    availabilities_information: { type: [common.GeneralAvailabilitiesSchema] },
    type: { type: String, enum: ['AS', 'FLE', 'MSB', 'AA'], required: true },
    family_situation: { type: FamilySituationSchema },
    family_ressources: { type: common.FamilyRessourcesSchema },
    life_state: { type: StateSchema },
    social_mediation: { type: SocialMediationSchema },
    workshop: { type: common.WorkshopSchema },
    level: { type: LevelSchema },
    school: { type: SchoolSchema },
    comment: { type: String },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  },
  {
    timestamps: true,
  },
);

StudentSchema.methods.export = function _export() {
  const doc = {
    ...this,
  };
  // eslint-disable-next-line no-underscore-dangle
  doc._id = this.id;
  return doc;
};

module.exports = mongoDatabase.model('Student', StudentSchema);
