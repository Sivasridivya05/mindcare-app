export default function SleepStudyCard() {
  const tips = [
    { icon: '😴', tip: 'Aim for 7–9 hours of sleep every night' },
    { icon: '📚', tip: 'Study in 25-min focused blocks (Pomodoro)' },
    { icon: '🧘', tip: 'Take 5-min breaks to reduce stress' },
    { icon: '💧', tip: 'Stay hydrated throughout the day' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-medium mb-4">💡 Well-Being Tips</h2>
      <div className="space-y-3">
        {tips.map((t, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-xl">{t.icon}</span>
            <p className="text-sm text-gray-600">{t.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}