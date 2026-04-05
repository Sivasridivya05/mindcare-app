const router = require('express').Router();
const MoodLog = require('../models/MoodLog');
const auth = require('../middleware/auth');

// Get weekly average stats
router.get('/weekly', auth, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const logs = await MoodLog.find({
      userId: req.user.id,
      date: { $gte: sevenDaysAgo }
    });

    const avg = (arr, key) => {
      const vals = arr.filter(l => l[key] != null);
      return vals.length ? (vals.reduce((s, l) => s + l[key], 0) / vals.length).toFixed(1) : 0;
    };

    res.json({
      avgMood: avg(logs, 'mood'),
      avgStress: avg(logs, 'stressLevel'),
      avgSleep: avg(logs, 'sleepHours'),
      avgStudy: avg(logs, 'studyHours'),
      totalLogs: logs.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;