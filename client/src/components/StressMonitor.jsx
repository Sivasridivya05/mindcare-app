import { useEffect, useState } from 'react';
import api from '../api';

export default function StressMonitor() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/analytics/weekly').then(res => setStats(res.data));
  }, []);

  const color = (val) => val <= 3 ? 'text-green-500' : val <= 6 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-medium mb-4">📊 Weekly Averages</h2>
      {stats ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <p className="text-3xl font-medium text-purple-600">{stats.avgMood}</p>
            <p className="text-sm text-gray-500 mt-1">Avg Mood</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className={`text-3xl font-medium ${color(stats.avgStress)}`}>{stats.avgStress}</p>
            <p className="text-sm text-gray-500 mt-1">Avg Stress</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-3xl font-medium text-green-600">{stats.avgSleep}h</p>
            <p className="text-sm text-gray-500 mt-1">Avg Sleep</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-3xl font-medium text-blue-600">{stats.avgStudy}h</p>
            <p className="text-sm text-gray-500 mt-1">Avg Study</p>
          </div>
        </div>
      ) : <p className="text-gray-400">Loading stats...</p>}
    </div>
  );
}