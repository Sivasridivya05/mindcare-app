import { useState, useEffect } from 'react';
import api from '../api';

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const load = () => api.get('/habits').then(r => setHabits(r.data));
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!name) return;
    await api.post('/habits', { name });
    setName(''); load();
  };

  const check = async (id) => {
    await api.put(`/habits/${id}/check`);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/habits/${id}`);
    load();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-medium mb-4">✅ Habit Tracker</h2>
      <div className="flex gap-2 mb-4">
        <input value={name} onChange={e => setName(e.target.value)}
          className="flex-1 border rounded-lg p-2 text-sm" placeholder="Add new habit..." />
        <button onClick={add}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
          Add
        </button>
      </div>
      <div className="space-y-2">
        {habits.map(h => {
          const done = h.completedDates.includes(today);
          return (
            <div key={h._id} className={`flex items-center justify-between p-3 rounded-lg ${done ? 'bg-green-50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => check(h._id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                    done ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                  }`}>
                  {done ? '✓' : ''}
                </button>
                <span className={`text-sm ${done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {h.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{h.completedDates.length} days</span>
                <button onClick={() => remove(h._id)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
              </div>
            </div>
          );
        })}
        {habits.length === 0 && <p className="text-sm text-gray-400">No habits yet. Add one above!</p>}
      </div>
    </div>
  );
}