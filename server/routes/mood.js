const router = require('express').Router();
const MoodLog = require('../models/MoodLog');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const log = await MoodLog.create({ ...req.body, userId: req.user.id });
  res.json(log);
});

router.get('/history', auth, async (req, res) => {
  const logs = await MoodLog.find({ userId: req.user.id }).sort({ date: -1 }).limit(30);
  res.json(logs);
});

module.exports = router;