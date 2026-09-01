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

exports.trackLogin = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await Traffic.findOneAndUpdate(
      { date: today },
      { $inc: { logins: 1 } },
      { upsert: true, new: true }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retourne les 30 derniers jours triés du plus récent au plus ancien
exports.getStats = async (req, res) => {
  try {
    const stats = await Traffic.find().sort({ date: -1 }).limit(30);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Résumé global avec tendances semaine N vs N-1
exports.getSummary = async (req, res) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Semaine courante : J-6 → aujourd'hui
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    // Semaine précédente : J-13 → J-7
    const prevWeekEnd = new Date(today);
    prevWeekEnd.setDate(today.getDate() - 7);
    const prevWeekStart = new Date(today);
    prevWeekStart.setDate(today.getDate() - 13);
    const prevWeekStartStr = prevWeekStart.toISOString().split('T')[0];
    const prevWeekEndStr = prevWeekEnd.toISOString().split('T')[0];

    const [thisWeek, lastWeek, allTime] = await Promise.all([
      Traffic.find({ date: { $gte: weekStartStr, $lte: todayStr } }),
      Traffic.find({ date: { $gte: prevWeekStartStr, $lte: prevWeekEndStr } }),
      Traffic.find().sort({ date: -1 }).limit(30),
    ]);

    const sum = (arr, key) => arr.reduce((a, b) => a + (b[key] || 0), 0);

    const thisWeekVisits = sum(thisWeek, 'visits');
    const lastWeekVisits = sum(lastWeek, 'visits');
    const thisWeekViews = sum(thisWeek, 'pageViews');
    const lastWeekViews = sum(lastWeek, 'pageViews');

    const trend = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const todayData = allTime.find(s => s.date === todayStr) || { visits: 0, pageViews: 0, logins: 0 };

    res.status(200).json({
      totalVisits30d: sum(allTime, 'visits'),
      totalPageViews30d: sum(allTime, 'pageViews'),
      totalLogins30d: sum(allTime, 'logins'),
      todayVisits: todayData.visits,
      todayPageViews: todayData.pageViews,
      thisWeekVisits,
      lastWeekVisits,
      thisWeekViews,
      lastWeekViews,
      visitsTrend: trend(thisWeekVisits, lastWeekVisits),
      viewsTrend: trend(thisWeekViews, lastWeekViews),
      daily: allTime.slice().reverse(), // du plus ancien au plus récent pour les graphes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
