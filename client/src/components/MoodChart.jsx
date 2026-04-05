import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api';

export default function MoodChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get('/mood/history').then(res => {
      setData(res.data.reverse().map(log => ({
        date: new Date(log.date).toLocaleDateString(),
        mood: log.mood,
        stress: log.stressLevel,
        sleep: log.sleepHours
      })));
    });
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-medium mb-4">Your Well-Being Trends</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[1, 10]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="mood" stroke="#7c3aed" strokeWidth={2} />
          <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} />
          <Line type="monotone" dataKey="sleep" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
