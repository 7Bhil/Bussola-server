const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  image: {
    type: String // URL ou Base64
  },
  category: {
    type: String,
    enum: ['Action', 'Événement', 'Partenariat', 'Information'],
    default: 'Information'
  },
  author: {
    type: String,
    default: 'Équipe Busola'
  },
  date: {
    type: Date,
    default: Date.now
  },
  published: {
    type: Boolean,
    default: true
  },
  archived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('News', newsSchema);
