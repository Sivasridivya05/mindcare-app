import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

export default function BookSession() {
  const [therapistAvail, setTherapistAvail] = useState(null);

useEffect(() => {
  api.get('/therapist/availability').then(r => setTherapistAvail(r.data)).catch(() => {});
  load();
}, []);
  const [form, setForm] = useState({ date: '', time: '', reason: '' });
  const [sessions, setSessions] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = () => api.get('/sessions/my').then(r => setSessions(r.data)).catch(console.error);

  useEffect(() => { load(); }, []);

  const submit = async () => {
    setMsg(''); setError('');
    if (!form.date || !form.time) {
      setError('Please select a date and time.');
      return;
    }
    try {
      await api.post('/sessions', form);
      setMsg('✅ Session booked! Waiting for therapist confirmation.');
      setForm({ date: '', time: '', reason: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Try again.');
    }
  };

  const submitFeedback = async (id, feedback) => {
    try {
      await api.put(`/sessions/${id}/feedback`, { feedback });
      load();
    } catch (err) { console.error(err); }
  };

  const statusStyle = (status) => {
    if (status === 'accepted') return 'bg-green-100 text-green-700';
    if (status === 'declined') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-medium text-gray-800 mb-6">📅 Book Counselling Session</h2>

        <div className="bg-white rounded-xl p-6 shadow mb-6">
          {msg && <p className="text-green-600 text-sm mb-4 p-3 bg-green-50 rounded-lg">{msg}</p>}
          {error && <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">{error}</p>}

          <label className="block text-sm text-gray-600 mb-1">Select Date</label>
          <input type="date" value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="border rounded-lg p-3 w-full mb-3" />

          <label className="block text-sm text-gray-600 mb-1">Select Time</label>
          <input type="time" value={form.time}
            onChange={e => setForm({ ...form, time: e.target.value })}
            className="border rounded-lg p-3 w-full mb-3" />

          <label className="block text-sm text-gray-600 mb-1">Reason for session</label>
          <textarea placeholder="e.g. Feeling stressed about exams..."
            value={form.reason}
            onChange={e => setForm({ ...form, reason: e.target.value })}
            className="border rounded-lg p-3 w-full mb-4" rows={3} />

          <button onClick={submit}
            className="bg-purple-600 text-white w-full py-3 rounded-xl hover:bg-purple-700 font-medium">
            Book Session
          </button>
        </div>

        {/* My Sessions List */}
        <h3 className="font-medium text-gray-700 mb-3">My Sessions ({sessions.length})</h3>
        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow text-center text-gray-400">
            No sessions booked yet.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s._id} className="bg-white rounded-xl p-5 shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800">📅 {s.date} at 🕐 {s.time}</p>
                    <p className="text-sm text-gray-500 mt-1">{s.reason || 'No reason provided'}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle(s.status)}`}>
                    {s.status === 'pending' ? '⏳ Pending' :
                     s.status === 'accepted' ? '✅ Accepted' : '❌ Declined'}
                  </span>
                </div>

                {s.status === 'accepted' && !s.feedback && (
                  <div className="mt-3 border-t pt-3">
                    <p className="text-sm text-gray-500 mb-2">Leave feedback for this session:</p>
                    <div className="flex gap-2">
                      <input
                        id={`feedback-${s._id}`}
                        placeholder="How was your session?"
                        className="flex-1 border rounded-lg p-2 text-sm" />
                      <button
                        onClick={() => {
                          const val = document.getElementById(`feedback-${s._id}`).value;
                          if (val) submitFeedback(s._id, val);
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                        Submit
                      </button>
                    </div>
                  </div>
                )}
                {/* Therapist Availability */}
{therapistAvail && (
  <div className="bg-white rounded-xl p-5 shadow mb-5">
    <h3 className="font-medium text-gray-700 mb-1">⏰ Therapist Available Hours</h3>
    <p className="text-xs text-gray-400 mb-3">
      Please book sessions during these available times
    </p>
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(therapistAvail.availability).map(([day, val]) => (
        <div key={day} className={`flex justify-between items-center p-2 rounded-lg text-sm border ${
          val.enabled
            ? 'bg-green-50 border-green-200'
            : 'bg-gray-50 border-gray-100 opacity-50'
        }`}>
          <span className="font-medium text-gray-700 text-xs">{day}</span>
          <span className={`text-xs ${val.enabled ? 'text-teal-600' : 'text-gray-400'}`}>
            {val.enabled ? `${val.from} – ${val.to}` : 'Unavailable'}
          </span>
        </div>
      ))}
    </div>
  </div>
)}

                {s.feedback && (
                  <div className="mt-3 border-t pt-3">
                    <p className="text-sm text-gray-500 italic">
                      Your feedback: <span className="text-gray-700">{s.feedback}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}