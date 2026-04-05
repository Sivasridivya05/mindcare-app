import { useEffect, useState, useRef } from 'react';

const suggestions = [
  {
    type: 'stretch',
    icon: '🤸',
    title: 'Stretch Break!',
    color: 'bg-yellow-50 border-yellow-300',
    badge: 'bg-yellow-100 text-yellow-700',
    steps: [
      'Stand up and reach both arms overhead',
      'Roll your shoulders backward 5 times',
      'Tilt your neck left and right gently',
      'Stretch your wrists by pulling fingers back',
      'Do 10 slow calf raises'
    ]
  },
  {
    type: 'breathing',
    icon: '🌬️',
    title: 'Breathing Break!',
    color: 'bg-purple-50 border-purple-300',
    badge: 'bg-purple-100 text-purple-700',
    steps: [
      'Close your eyes and sit comfortably',
      'Inhale slowly for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly for 4 counts',
      'Repeat 5 times'
    ]
  },
  {
    type: 'walk',
    icon: '🚶',
    title: 'Short Walk Break!',
    color: 'bg-green-50 border-green-300',
    badge: 'bg-green-100 text-green-700',
    steps: [
      'Step away from your screen',
      'Walk around your room for 2–3 minutes',
      'Look out a window and focus on something far',
      'Get a glass of water while you\'re up',
      'Take 3 deep breaths before sitting back'
    ]
  },
];

export default function SmartBreakReminder() {
  const [studyMinutes, setStudyMinutes] = useState(0);
  const [breakDue, setBreakDue] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [interval, setIntervalVal] = useState(25);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!tracking) return;
    timerRef.current = setInterval(() => {
      setStudyMinutes(m => {
        const next = m + 1;
        if (next >= interval) {
          const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
          setSuggestion(pick);
          setBreakDue(true);
          setTracking(false);
          return 0;
        }
        return next;
      });
    }, 60000); // every real minute
    return () => clearInterval(timerRef.current);
  }, [tracking, interval]);

  const startTracking = () => {
    setStudyMinutes(0);
    setBreakDue(false);
    setSuggestion(null);
    setShowSteps(false);
    setTracking(true);
  };

  const takeBreak = () => {
    setBreaksTaken(b => b + 1);
    setShowSteps(true);
  };

  const dismissBreak = () => {
    setBreakDue(false);
    setSuggestion(null);
    setShowSteps(false);
    startTracking();
  };

  const progressPercent = Math.min((studyMinutes / interval) * 100, 100);

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-800">⏰ Smart Break Reminder</h2>
          <p className="text-sm text-gray-400">Tracks your study time and reminds you to rest</p>
        </div>
        {breaksTaken > 0 && (
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
            {breaksTaken} breaks taken ✅
          </span>
        )}
      </div>

      {/* Break Alert */}
      {breakDue && suggestion && (
        <div className={`border-2 rounded-xl p-4 mb-4 ${suggestion.color}`}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{suggestion.icon}</span>
              <div>
                <p className="font-medium text-gray-800">{suggestion.title}</p>
                <p className="text-xs text-gray-500">You've been studying for {interval} minutes</p>
              </div>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${suggestion.badge}`}>
              {suggestion.type}
            </span>
          </div>

          {showSteps && (
            <div className="mt-3 space-y-2">
              {suggestion.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-purple-500 font-medium">{i + 1}.</span>
                  {step}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-3">
            {!showSteps && (
              <button onClick={takeBreak}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700">
                Show Me How
              </button>
            )}
            <button onClick={dismissBreak}
              className={`${showSteps ? 'flex-1' : ''} border border-gray-300 text-gray-600 py-2 px-4 rounded-lg text-sm hover:bg-gray-50`}>
              {showSteps ? '✅ Done! Resume Studying' : 'Skip'}
            </button>
          </div>
        </div>
      )}

      {/* Timer Settings */}
      {!tracking && !breakDue && (
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">
            Remind me every:
          </label>
          <div className="flex gap-2 mb-4">
            {[15, 25, 30, 45].map(min => (
              <button key={min} onClick={() => setIntervalVal(min)}
                className={`px-3 py-1 rounded-lg text-sm border ${
                  interval === min
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}>
                {min} min
              </button>
            ))}
          </div>
          <button onClick={startTracking}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 font-medium">
            🚀 Start Study Session
          </button>
        </div>
      )}

      {/* Active Tracking */}
      {tracking && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Study time</span>
            <span className="text-sm font-medium text-purple-600">
              {studyMinutes}/{interval} min
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
            <div
              className="bg-purple-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              Next break in <span className="text-purple-600 font-medium">{interval - studyMinutes} min</span>
            </p>
            <button onClick={() => { clearInterval(timerRef.current); setTracking(false); setStudyMinutes(0); }}
              className="text-xs text-red-400 hover:text-red-600">
              Stop Session
            </button>
          </div>

          {/* For testing — simulate time passing */}
          <button
            onClick={() => setStudyMinutes(interval - 1)}
            className="mt-3 w-full border border-dashed border-gray-300 text-gray-400 py-1 rounded-lg text-xs hover:bg-gray-50">
            ⚡ Test: Trigger break now
          </button>
        </div>
      )}
    </div>
  );
}