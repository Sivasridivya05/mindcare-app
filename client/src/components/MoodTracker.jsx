import { useState } from 'react';
import api from '../api';

export default function MoodTracker() {
  const [form, setForm] = useState({
    mood: 5,
    stressLevel: 5,
    sleepHours: 7,
    studyHours: 4,
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const moodEmoji = (val) => {
    if (val <= 2) return '😢';
    if (val <= 4) return '😕';
    if (val <= 6) return '😐';
    if (val <= 8) return '😊';
    return '😄';
  };

  const stressEmoji = (val) => {
    if (val <= 3) return '😌';
    if (val <= 6) return '😤';
    return '😰';
  };

  const moodColor = (val) => {
    if (val <= 3) return 'text-red-500';
    if (val <= 6) return 'text-yellow-500';
    return 'text-green-500';
  };

  const stressColor = (val) => {
    if (val <= 3) return 'text-green-500';
    if (val <= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const submit = async () => {
    setLoading(true);
    try {
      await api.post('/mood', form);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      alert('Failed to log mood. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium text-gray-800">📝 Daily Mood Log</h2>
        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
          {new Date().toLocaleDateString('en', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Your data is shared with your therapist to track your well-being
      </p>

      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
          ✅ Mood logged successfully! Your therapist can now see your update.
        </div>
      )}

      {/* Mood Slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            😊 How is your mood today?
          </label>
          <div className="flex items-center gap-1">
            <span className="text-xl">{moodEmoji(form.mood)}</span>
            <span className={`text-lg font-medium ${moodColor(form.mood)}`}>
              {form.mood}/10
            </span>
          </div>
        </div>
        <input type="range" min="1" max="10" value={form.mood}
          onChange={e => setForm({ ...form, mood: +e.target.value })}
          className="w-full accent-purple-600" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Very Bad 😢</span>
          <span>Excellent 😄</span>
        </div>
      </div>

      {/* Stress Slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            😰 What is your stress level?
          </label>
          <div className="flex items-center gap-1">
            <span className="text-xl">{stressEmoji(form.stressLevel)}</span>
            <span className={`text-lg font-medium ${stressColor(form.stressLevel)}`}>
              {form.stressLevel}/10
            </span>
          </div>
        </div>
        <input type="range" min="1" max="10" value={form.stressLevel}
          onChange={e => setForm({ ...form, stressLevel: +e.target.value })}
          className="w-full accent-red-500" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Very Calm 😌</span>
          <span>Very Stressed 😰</span>
        </div>
        {form.stressLevel >= 8 && (
          <div className="mt-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
            ⚠️ High stress detected! Your therapist will be notified automatically.
          </div>
        )}
      </div>

      {/* Sleep & Study Hours */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            😴 Sleep hours last night
          </label>
          <div className="flex items-center gap-2">
            <input type="number" min="0" max="24" value={form.sleepHours}
              onChange={e => setForm({ ...form, sleepHours: +e.target.value })}
              className="w-full border rounded-xl p-2.5 text-sm focus:outline-none focus:border-purple-400 text-center font-medium" />
            <span className="text-gray-400 text-sm">hrs</span>
          </div>
          {form.sleepHours < 6 && (
            <p className="text-xs text-yellow-600 mt-1">⚠️ Less than 6 hours!</p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            📚 Study hours today
          </label>
          <div className="flex items-center gap-2">
            <input type="number" min="0" max="24" value={form.studyHours}
              onChange={e => setForm({ ...form, studyHours: +e.target.value })}
              className="w-full border rounded-xl p-2.5 text-sm focus:outline-none focus:border-purple-400 text-center font-medium" />
            <span className="text-gray-400 text-sm">hrs</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-5">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          📔 Any notes? (optional)
        </label>
        <textarea
          placeholder="How are you feeling today? Any specific worries or wins?"
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-purple-400 resize-none"
          rows={3} />
      </div>

      {/* Submit Button */}
      <button onClick={submit} disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2 shadow-md">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          '📊 Log Today\'s Mood'
        )}
      </button>

      {/* Info note */}
      <p className="text-xs text-gray-300 text-center mt-3">
        Your mood data helps your therapist understand your well-being patterns
      </p>
    </div>
  );
}