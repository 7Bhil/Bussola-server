const mongoose = require('mongoose');

const trafficSchema = new mongoose.Schema({
  date: {
    type: String, // Format YYYY-MM-DD
    required: true,
    unique: true
  },
  visits: {
    type: Number,
    default: 0,
    description: "Unique visits (once per session)"
  },
  pageViews: {
    type: Number,
    default: 0,
    description: "Total number of pages viewed"
  },
  adminVisits: {
    type: Number,
    default: 0
  },
  logins: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Traffic', trafficSchema);
