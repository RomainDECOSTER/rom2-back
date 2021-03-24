const mongoose = require('mongoose');
const { mongoDatabase } = require('db');
const common = require('../common');
const ProposedSubectSchema = require('./ProposedSubectSchema');
const StateSchema = require('../student/StateSchema');

const VoluteerSchema = new mongoose.Schema(
  {
    draft: {
      type: mongoose.Schema.Types.Boolean,
      required: true,
      default: true,
    },
    uuid: { type: mongoose.Schema.Types.String },
    registration_information: { type: common.RegistrationSchema },
    general_information: { type: common.GeneralInformationSchema },
    availabilities_information: [{ type: common.GeneralAvailabilitiesSchema }],
    proposed_subject: [{ type: ProposedSubectSchema }],
    family_ressources: { type: common.FamilyRessourcesSchema },
    life_state: { type: StateSchema },
    workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }],
    comment: { type: mongoose.Schema.Types.String },
    other_intervention: { type: mongoose.Schema.Types.String },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
    campaign_history: [{ type: mongoose.Schema.Types.Mixed, default: [] }],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoDatabase.model('Volunteer', VoluteerSchema);
