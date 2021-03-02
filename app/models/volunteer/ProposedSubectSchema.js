const mongoose = require('mongoose');

class ProposedSubectSchema {
  static getSchema() {
    const schema = new mongoose.Schema(
      {
        name: { type: String },
        type: { type: String, enum: ['Enfant', 'Ado', 'Adulte'] },
        level: { type: String, enum: ['Primaire', 'Collège', 'Lycée', 'Grand Débutant', 'Débutant', 'Faux Débutant', 'Intermédiare', 'Avancé', ''] },
      },
      {
        _id: false,
        timestamps: false,
      },
    );
    return schema;
  }
}
exports.default = ProposedSubectSchema.getSchema();
