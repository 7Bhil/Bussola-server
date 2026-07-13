const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String // Tableau de URLs ou Base64 pour plusieurs photos
  }],
  status: {
    type: String,
    enum: ['En attente', 'En cours', 'Terminé'],
    default: 'En cours'
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Santé', 'Éducation', 'Droit', 'Social', 'Environnement'],
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  beneficiaries: {
    type: String
  },
  archived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Action', actionSchema);
