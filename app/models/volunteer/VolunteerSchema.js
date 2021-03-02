const mongoose = require('mongoose');
const common = require('../common');
const ProposedSubectSchema = require('./ProposedSubectSchema');
const StateSchema = require('../student/StateSchema');
const { mongoDatabase } = require('../../../db');

class VoluteerSchema {
  static getSchema() {
    const schema = new mongoose.Schema(
      {
        draft: {
          type: mongoose.Schema.Types.Boolean,
          required: true,
          default: true,
        },
        registrationInformation: { type: common.RegistrationSchema },
        generalInformation: { type: common.GeneralInformationSchema },
        availabilitiesInformation: [{ type: common.GeneralAvailabilitiesSchema }],
        proposedSubject: [{ type: ProposedSubectSchema.default }],
        familyRessources: common.FamilyRessourcesSchema,
        lifeState: StateSchema.default,
        workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }],
        comment: { type: mongoose.Schema.Types.String },
        otherIntervention: { type: mongoose.Schema.Types.String },
        campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
        campaign_history: [{ type: mongoose.Schema.Types.Mixed, default: [] }],
      },
      {
        timestamps: true,
      },
    );
    return schema;
  }
}
const volunteerSchema = mongoDatabase.mongooseConnection.model('Volunteer', VoluteerSchema.getSchema());
exports.default = volunteerSchema;
