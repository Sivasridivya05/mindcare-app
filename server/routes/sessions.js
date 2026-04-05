const router = require('express').Router();
const Session = require('../models/Session');
const auth = require('../middleware/auth');

// Student books a session
router.post('/', auth, async (req, res) => {
  try {
    const session = await Session.create({ ...req.body, studentId: req.user.id });
    res.json(session);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Student views their sessions
router.get('/my', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ studentId: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Therapist views all pending sessions
router.get('/all', auth, async (req, res) => {
  try {
    const sessions = await Session.find().populate('studentId', 'name email').sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Therapist accepts or declines
router.put('/:id/status', auth, async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, therapistId: req.user.id },
      { new: true }
    );
    res.json(session);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Student submits feedback
router.put('/:id/feedback', auth, async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { feedback: req.body.feedback },
      { new: true }
    );
    res.json(session);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;