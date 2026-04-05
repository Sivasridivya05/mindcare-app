const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String, required: true },
  time: { type: String, required: true },
  reason: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);