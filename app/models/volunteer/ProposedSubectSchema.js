const mongoose = require('mongoose');

const ProposedSubectSchema = new mongoose.Schema(
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

module.exports = ProposedSubectSchema;
