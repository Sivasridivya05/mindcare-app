const mongoose = require('mongoose');  // ← add this line

const moodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: Number, min: 1, max: 10, required: true },
  stressLevel: { type: Number, min: 1, max: 10 },
  sleepHours: { type: Number },
  studyHours: { type: Number },
  notes: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoodLog', moodSchema);