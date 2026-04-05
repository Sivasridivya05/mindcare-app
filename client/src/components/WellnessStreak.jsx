import { useState, useEffect } from 'react';
import api from '../api';

const badges = [
  { id: 'first_log',    icon: '🌱', title: 'First Step',      desc: 'Logged mood for the first time',        requirement: 1,  type: 'streak' },
  { id: 'three_days',   icon: '🔥', title: 'On Fire',         desc: '3 day streak',                          requirement: 3,  type: 'streak' },
  { id: 'week_warrior', icon: '⚡', title: 'Week Warrior',    desc: '7 day streak',                          requirement: 7,  type: 'streak' },
  { id: 'two_weeks',    icon: '💎', title: 'Diamond Mind',    desc: '14 day streak',                         requirement: 14, type: 'streak' },
  { id: 'month_master', icon: '👑', title: 'Wellness Master', desc: '30 day streak',                         requirement: 30, type: 'streak' },
  { id: 'calm_soul',    icon: '😌', title: 'Calm Soul',       desc: 'Logged stress below 4 three times',     requirement: 3,  type: 'low_stress' },
  { id: 'happy_mind',   icon: '😄', title: 'Happy Mind',      desc: 'Logged mood above 8 three times',       requirement: 3,  type: 'high_mood' },
  { id: 'sleep_champ',  icon: '😴', title: 'Sleep Champion',  desc: 'Slept 8+ hours three times',            requirement: 3,  type: 'good_sleep' },
  { id: 'study_star',   icon: '📚', title: 'Study Star',      desc: 'Studied 6+ hours three times',          requirement: 3,  type: 'study_hard' },
  { id: 'consistent',   icon: '🎯', title: 'Consistent',      desc: 'Logged mood 10 times total',            requirement: 10, type: 'total_logs' },
  { id: 'mindful',      icon: '🧘', title: 'Mindful',         desc: 'Logged mood 20 times total',            requirement: 20, type: 'total_logs' },
  { id: 'wellness_pro', icon: '🏆', title: 'Wellness Pro',    desc: 'Logged mood 30 times total',            requirement: 30, type: 'total_logs' },
];

const motivationalMessages = [
  "Every day you show up for yourself is a win! 💪",
  "Your mental health journey matters. Keep going! 🌟",
  "Small steps every day lead to big changes! 🚀",
  "You are doing amazing — one day at a time! 💙",
  "Consistency is the key to well-being! 🔑",
  "Be proud of yourself for tracking your wellness! 🌈",
];

export default function WellnessStreak() {
  const [moodLogs, setMoodLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState(null);

  useEffect(() => {
    api.get('/mood/history')
      .then(r => { setMoodLogs(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Calculate current streak
  const calculateStreak = () => {
    if (moodLogs.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logDates = moodLogs.map(log => {
      const d = new Date(log.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });
    const uniqueDates = [...new Set(logDates)].sort((a, b) => b - a);
    let streak = 0;
    let checkDate = today.getTime();
    for (let date of uniqueDates) {
      if (date === checkDate || date === checkDate - 86400000) {
        streak++;
        checkDate = date - 86400000;
      } else {
        break;
      }
    }
    return streak;
  };

  // Calculate earned badges
  const calculateEarnedBadges = () => {
    const streak = calculateStreak();
    const totalLogs = moodLogs.length;
    const lowStressCount = moodLogs.filter(l => l.stressLevel <= 4).length;
    const highMoodCount = moodLogs.filter(l => l.mood >= 8).length;
    const goodSleepCount = moodLogs.filter(l => l.sleepHours >= 8).length;
    const studyHardCount = moodLogs.filter(l => l.studyHours >= 6).length;

    return badges.map(badge => {
      let earned = false;
      let progress = 0;
      if (badge.type === 'streak') {
        earned = streak >= badge.requirement;
        progress = Math.min((streak / badge.requirement) * 100, 100);
      } else if (badge.type === 'low_stress') {
        earned = lowStressCount >= badge.requirement;
        progress = Math.min((lowStressCount / badge.requirement) * 100, 100);
      } else if (badge.type === 'high_mood') {
        earned = highMoodCount >= badge.requirement;
        progress = Math.min((highMoodCount / badge.requirement) * 100, 100);
      } else if (badge.type === 'good_sleep') {
        earned = goodSleepCount >= badge.requirement;
        progress = Math.min((goodSleepCount / badge.requirement) * 100, 100);
      } else if (badge.type === 'study_hard') {
        earned = studyHardCount >= badge.requirement;
        progress = Math.min((studyHardCount / badge.requirement) * 100, 100);
      } else if (badge.type === 'total_logs') {
        earned = totalLogs >= badge.requirement;
        progress = Math.min((totalLogs / badge.requirement) * 100, 100);
      }
      return { ...badge, earned, progress };
    });
  };

  // Last 7 days activity
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const hasLog = moodLogs.some(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === date.getTime();
      });
      days.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        date: date.getDate(),
        hasLog,
        isToday: i === 0,
      });
    }
    return days;
  };

  const streak = calculateStreak();
  const earnedBadges = calculateEarnedBadges();
  const earnedCount = earnedBadges.filter(b => b.earned).length;
  const last7Days = getLast7Days();
  const totalLogs = moodLogs.length;
  const todayMessage = motivationalMessages[new Date().getDay() % motivationalMessages.length];

  // Wellness level
  const wellnessLevel = () => {
    if (streak >= 30) return { title: 'Wellness Master 👑', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (streak >= 14) return { title: 'Diamond Mind 💎', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (streak >= 7)  return { title: 'Week Warrior ⚡', color: 'text-purple-600', bg: 'bg-purple-50' };
    if (streak >= 3)  return { title: 'On Fire 🔥', color: 'text-orange-600', bg: 'bg-orange-50' };
    if (streak >= 1)  return { title: 'Getting Started 🌱', color: 'text-green-600', bg: 'bg-green-50' };
    return { title: 'Start Your Journey ✨', color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const level = wellnessLevel();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-800">🏅 Wellness Streak</h2>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${level.bg} ${level.color}`}>
          {level.title}
        </span>
      </div>

      {/* Motivational message */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-3 mb-5 border border-purple-100">
        <p className="text-sm text-purple-700 text-center">{todayMessage}</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-100">
          <p className="text-3xl font-medium text-orange-500">{streak}</p>
          <p className="text-xs text-gray-500 mt-0.5">Day Streak 🔥</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-100">
          <p className="text-3xl font-medium text-purple-600">{totalLogs}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Logs 📊</p>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded-xl border border-yellow-100">
          <p className="text-3xl font-medium text-yellow-600">{earnedCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">Badges 🏅</p>
        </div>
      </div>

      {/* Last 7 Days Activity */}
      <div className="mb-5">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Last 7 days</p>
        <div className="flex gap-1.5 justify-between">
          {last7Days.map((d, i) => (
            <div key={i} className="flex-1 text-center">
              <p className="text-xs text-gray-400 mb-1">{d.day}</p>
              <div className={`w-full aspect-square rounded-lg flex items-center justify-center text-sm ${
                d.isToday
                  ? d.hasLog
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-purple-200 text-purple-600 border-2 border-purple-400 border-dashed'
                  : d.hasLog
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {d.hasLog ? '✓' : d.isToday ? '?' : '·'}
              </div>
              <p className="text-xs text-gray-400 mt-1">{d.date}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-2 justify-center text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-green-400 inline-block"></span> Logged
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-gray-100 border inline-block"></span> Missed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-purple-200 border-2 border-purple-400 border-dashed inline-block"></span> Today
          </span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="mb-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
          Badges — {earnedCount}/{badges.length} earned
        </p>
        <div className="grid grid-cols-4 gap-2">
          {earnedBadges.map((badge, i) => (
            <button key={i}
              onClick={() => setSelectedBadge(selectedBadge?.id === badge.id ? null : badge)}
              className={`relative p-2 rounded-xl text-center transition-all border ${
                badge.earned
                  ? 'bg-gradient-to-b from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-md'
                  : 'bg-gray-50 border-gray-100 opacity-50 grayscale'
              }`}>
              <p className="text-2xl mb-0.5">{badge.icon}</p>
              <p className="text-xs font-medium text-gray-600 leading-tight">{badge.title}</p>
              {badge.earned && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </span>
              )}
              {!badge.earned && badge.progress > 0 && (
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-purple-400 h-1 rounded-full"
                    style={{ width: `${badge.progress}%` }} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Badge Detail Popup */}
      {selectedBadge && (
        <div className={`mt-3 p-4 rounded-xl border ${
          selectedBadge.earned
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedBadge.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{selectedBadge.title}</p>
              <p className="text-xs text-gray-500">{selectedBadge.desc}</p>
              {!selectedBadge.earned && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(selectedBadge.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${selectedBadge.progress}%` }} />
                  </div>
                </div>
              )}
              {selectedBadge.earned && (
                <p className="text-xs text-green-600 mt-1 font-medium">
                  ✅ Badge earned!
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Next badge hint */}
      {(() => {
        const nextBadge = earnedBadges.find(b => !b.earned && b.progress > 0);
        if (!nextBadge) return null;
        return (
          <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl p-3 flex items-center gap-3">
            <span className="text-xl grayscale">{nextBadge.icon}</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-purple-700">
                Next: {nextBadge.title}
              </p>
              <p className="text-xs text-gray-400">{nextBadge.desc}</p>
              <div className="w-full bg-purple-100 rounded-full h-1.5 mt-1">
                <div
                  className="bg-purple-500 h-1.5 rounded-full"
                  style={{ width: `${nextBadge.progress}%` }} />
              </div>
            </div>
            <span className="text-xs text-purple-500 font-medium">
              {Math.round(nextBadge.progress)}%
            </span>
          </div>
        );
      })()}

    </div>
  );
}