const prisma = require('../lib/prisma');

const formatTraffic = (t) => t ? { ...t, _id: t.id } : null;

exports.trackVisit = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await prisma.traffic.upsert({
      where: { date: today },
      update: { visits: { increment: 1 } },
      create: { date: today, visits: 1 }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackPageView = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await prisma.traffic.upsert({
      where: { date: today },
      update: { pageViews: { increment: 1 } },
      create: { date: today, pageViews: 1 }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackAdminVisit = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await prisma.traffic.upsert({
      where: { date: today },
      update: { adminVisits: { increment: 1 } },
      create: { date: today, adminVisits: 1 }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackLogin = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await prisma.traffic.upsert({
      where: { date: today },
      update: { logins: { increment: 1 } },
      create: { date: today, logins: 1 }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retourne les 30 derniers jours triés du plus récent au plus ancien
exports.getStats = async (req, res) => {
  try {
    const stats = await prisma.traffic.findMany({
      orderBy: { date: 'desc' },
      take: 30
    });
    res.status(200).json(stats.map(formatTraffic));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Résumé global avec tendances semaine N vs N-1
exports.getSummary = async (req, res) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const prevWeekEnd = new Date(today);
    prevWeekEnd.setDate(today.getDate() - 7);
    const prevWeekStart = new Date(today);
    prevWeekStart.setDate(today.getDate() - 13);
    const prevWeekStartStr = prevWeekStart.toISOString().split('T')[0];
    const prevWeekEndStr = prevWeekEnd.toISOString().split('T')[0];

    const [thisWeek, lastWeek, allTimeRaw] = await Promise.all([
      prisma.traffic.findMany({ where: { date: { gte: weekStartStr, lte: todayStr } } }),
      prisma.traffic.findMany({ where: { date: { gte: prevWeekStartStr, lte: prevWeekEndStr } } }),
      prisma.traffic.findMany({ orderBy: { date: 'desc' }, take: 30 }),
    ]);

    const allTime = allTimeRaw.map(formatTraffic);

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
      daily: allTime.slice().reverse(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
