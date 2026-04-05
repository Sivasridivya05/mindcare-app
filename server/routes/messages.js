const router = require('express').Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const msg = await Message.create({ ...req.body, senderId: req.user.id });
    res.json(msg);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get conversation between two users
router.get('/:userId', auth, async (req, res) => {
  try {
    const msgs = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;