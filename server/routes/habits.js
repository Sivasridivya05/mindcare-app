const router = require('express').Router();
const Habit = require('../models/Habit');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const habit = await Habit.create({ ...req.body, userId: req.user.id });
    res.json(habit);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    res.json(habits);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Mark habit done for today
router.put('/:id/check', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const habit = await Habit.findById(req.params.id);
    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today);
      await habit.save();
    }
    res.json(habit);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;