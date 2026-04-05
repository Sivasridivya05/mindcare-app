const router = require('express').Router();
const MoodLog = require('../models/MoodLog');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all students — newest first
router.get('/students', auth, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get mood logs for a specific student
router.get('/student/:id/moods', auth, async (req, res) => {
  try {
    const logs = await MoodLog.find({ userId: req.params.id })
      .sort({ date: -1 })
      .limit(30);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get flagged high stress students
router.get('/flagged', auth, async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const logs = await MoodLog.find({
      stressLevel: { $gte: 8 },
      date: { $gte: threeDaysAgo }
    }).populate('userId', 'name email');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Weekly report
router.get('/report', auth, async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const logs = await MoodLog.find({ date: { $gte: weekAgo } })
      .populate('userId', 'name');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public availability — student can see this
router.get('/availability', async (req, res) => {
  try {
    res.json({
      therapistName: 'Dr. Smith',
      availability: {
        Mon: { enabled: true,  from: '09:00', to: '17:00' },
        Tue: { enabled: true,  from: '09:00', to: '17:00' },
        Wed: { enabled: false, from: '09:00', to: '17:00' },
        Thu: { enabled: true,  from: '09:00', to: '17:00' },
        Fri: { enabled: true,  from: '09:00', to: '15:00' },
        Sat: { enabled: false, from: '09:00', to: '12:00' },
        Sun: { enabled: false, from: '09:00', to: '12:00' },
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;