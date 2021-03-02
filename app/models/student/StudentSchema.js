const mongoose = require('mongoose');
const common = require('../common');
const FamilySituationSchema = require('./FamilySituationSchema');
const SocialMediationSchema = require('./SocialMediationSchema');
const StateSchema = require('./StateSchema');
const { mongoDatabase } = require('../../../db');

class StudentSchema {
  static getSchema() {
    const schema = new mongoose.Schema(
      {
        draft: {
          type: Boolean,
          required: true,
          default: true,
        },
        registrationInformation: { type: common.RegistrationSchema },
        generalInformation: { type: common.GeneralInformationSchema },
        availabilitiesInformation: { type: [common.GeneralAvailabilitiesSchema] },
        type: { type: String, enum: ['AS', 'FLE', 'MSB', 'AA'], required: true },
        familySituation: FamilySituationSchema.default,
        familyRessources: common.FamilyRessourcesSchema,
        lifeState: StateSchema.default,
        socialMediation: SocialMediationSchema.default,
        workshops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' }],
        initial_level: { type: String },
        final_level: { type: String },
        certification: { type: String },
        school_path: { type: String },
        courses_as: [{ type: String }],
        MIFE: { type: String },
        levelComment: { type: String },
        comment: { type: String },
        schoolComment: { type: String },
        schoolName: { type: String },
        certification_final: { type: String },
        workshopsComment: { type: String },
        level: { type: String },
        classRoom: [{ type: String }],
        option1: { type: String },
        option2: { type: String },
        option3: { type: String },
        campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
        campaign_history: { type: mongoose.Schema.Types.Mixed },
      },
      {
        timestamps: true,
      },
    );
    return schema;
  }
}
const schema = mongoDatabase.mongooseConnection.model('Student', StudentSchema.getSchema());
exports.default = schema;
