import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HabitTracker from '../components/HabitTracker';
import MentalHealthGames from '../components/MentalHealthGames';
import SmartBreakReminder from '../components/SmartBreakReminder';
import FocusMusicPlayer from '../components/FocusMusicPlayer';
import GuidedMoodAssessment from '../components/GuidedMoodAssessment';
import WellnessStreak from '../components/WellnessStreak';
import api from '../api';

const quotes = [
  { text: "You don't have to be perfect to be amazing.", author: "Unknown" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Small progress is still progress.", author: "Unknown" },
  { text: "Your mental health is a priority.", author: "Unknown" },
  { text: "Every day is a second chance.", author: "Unknown" },
  { text: "You are stronger than you think.", author: "Unknown" },
  { text: "Take it one day at a time.", author: "Unknown" },
  { text: "Rest is productive too.", author: "Unknown" },
];

const todayQuote = quotes[new Date().getDay() % quotes.length];

const studyTips = [
  "📌 Break big tasks into small steps",
  "⏰ Use 25-min focused study blocks",
  "💧 Drink water every 30 minutes",
  "🚶 Take a 5-min walk between sessions",
  "📵 Put your phone on silent while studying",
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [planner, setPlanner] = useState([
    { task: 'Math assignment', priority: 'high', done: false },
    { task: 'Read chapter 5', priority: 'medium', done: false },
    { task: 'Prepare presentation', priority: 'low', done: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    api.get('/sessions/my').then(r => setSessions(r.data)).catch(() => {});
    const interval = setInterval(() => {
      setTipIndex(i => (i + 1) % studyTips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    setPlanner(prev => [...prev, { task: newTask, priority, done: false }]);
    setNewTask('');
  };

  const toggleTask = (i) => {
    setPlanner(prev => prev.map((t, idx) =>
      idx === i ? { ...t, done: !t.done } : t
    ));
  };

  const removeTask = (i) => {
    setPlanner(prev => prev.filter((_, idx) => idx !== i));
  };

  const priorityStyle = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  };

  const upcomingSessions = sessions.filter(s => s.status !== 'declined').slice(0, 3);
  const completedTasks = planner.filter(t => t.done).length;
  const totalTasks = planner.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const circumference = 2 * Math.PI * 36;
  const strokeDash = (progressPercent / 100) * circumference;

  const quickLinks = [
    { label: '🧘 Meditation', path: '/meditation', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
    { label: '📅 Book Session', path: '/book-session', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { label: '📚 Content Library', path: '/library', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-2xl font-medium mb-1">Welcome back, {user?.name} 👋</h2>
          <p className="text-purple-200 text-sm mb-3">Here's your well-being overview for today</p>
          <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 inline-block">
            <p className="text-sm transition-all duration-500">{studyTips[tipIndex]}</p>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow border-l-4 border-purple-500">
          <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Quote of the day</p>
          <p className="text-gray-800 font-medium text-lg">"{todayQuote.text}"</p>
          <p className="text-purple-500 text-sm mt-1">— {todayQuote.author}</p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 mb-6">
          {quickLinks.map((l, i) => (
            <button key={i} onClick={() => navigate(l.path)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${l.color}`}>
              {l.label}
            </button>
          ))}
        </div>

        {/* Main Grid — Planner + Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Study & Stress Planner */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">📋 Study & Stress Planner</h2>
              <svg width="44" height="44" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r="36" fill="none" stroke="#f3f4f6" strokeWidth="8"/>
                <circle cx="44" cy="44" r="36" fill="none" stroke="#7c3aed" strokeWidth="8"
                  strokeDasharray={`${strokeDash} ${circumference}`}
                  strokeLinecap="round"
                  transform="rotate(-90 44 44)"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}/>
                <text x="44" y="49" textAnchor="middle" fontSize="16" fill="#7c3aed" fontWeight="500">
                  {progressPercent}%
                </text>
              </svg>
            </div>

            <div className="flex gap-2 mb-4">
              <input value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:border-purple-400"
                placeholder="Add a task..." />
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className="border rounded-lg p-2 text-sm">
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
              <button onClick={addTask}
                className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-700">
                Add
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {planner.map((t, i) => (
                <div key={i}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    t.done ? 'bg-gray-50 opacity-60' : 'bg-white'
                  }`}>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleTask(i)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                        t.done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                      }`}>
                      {t.done ? '✓' : ''}
                    </button>
                    <span className={`text-sm ${t.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {t.task}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${priorityStyle[t.priority]}`}>
                      {t.priority}
                    </span>
                    <button onClick={() => removeTask(i)}
                      className="text-gray-300 hover:text-red-400 text-sm">✕</button>
                  </div>
                </div>
              ))}
              {planner.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No tasks yet. Add one above!</p>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-right">
              {completedTasks}/{totalTasks} tasks completed
            </p>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">📅 Upcoming Sessions</h2>
              <button onClick={() => navigate('/book-session')}
                className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200">
                + Book New
              </button>
            </div>
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-400 text-sm mb-4">No sessions booked yet</p>
                <button onClick={() => navigate('/book-session')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-xl text-sm hover:bg-purple-700">
                  Book a Session
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map(s => (
                  <div key={s._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">📆 {s.date}</p>
                      <p className="text-xs text-gray-500">🕐 {s.time}</p>
                      <p className="text-xs text-gray-400 mt-1">{s.reason || 'General counselling'}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      s.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      s.status === 'declined' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {s.status === 'accepted' ? '✅ Confirmed' :
                       s.status === 'declined' ? '❌ Declined' : '⏳ Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
{/* Bottom Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <GuidedMoodAssessment />
  <WellnessStreak />
  <FocusMusicPlayer />
  <MentalHealthGames />
  <SmartBreakReminder />
</div>

      </div>
    </div>
  );
}