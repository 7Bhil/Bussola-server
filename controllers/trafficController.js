const Traffic = require('../models/Traffic');

exports.trackVisit = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await Traffic.findOneAndUpdate(
      { date: today },
      { $inc: { visits: 1 } },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackPageView = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await Traffic.findOneAndUpdate(
      { date: today },
      { $inc: { pageViews: 1 } },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackAdminVisit = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await Traffic.findOneAndUpdate(
      { date: today },
      { $inc: { adminVisits: 1 } },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Traffic.find().sort({ date: -1 }).limit(30);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
