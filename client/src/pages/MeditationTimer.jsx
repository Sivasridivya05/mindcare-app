import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';

const exercises = [
  { name: '4-7-8 Breathing', inhale: 4, hold: 7, exhale: 8, desc: 'Calms anxiety instantly' },
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, desc: 'Used by Navy SEALs' },
  { name: 'Deep Breathing', inhale: 5, hold: 2, exhale: 5, desc: 'Simple stress relief' },
];

export default function MeditationTimer() {
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState('ready');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef(null);

  const ex = exercises[selected];

  const start = () => {
    setPhase('inhale');
    setCount(ex.inhale);
  };

  useEffect(() => {
    if (phase === 'ready') return;
    intervalRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          if (phase === 'inhale') { setPhase('hold'); return ex.hold; }
          if (phase === 'hold') { setPhase('exhale'); return ex.exhale; }
          if (phase === 'exhale') {
            setCycles(cy => cy + 1);
            setPhase('inhale');
            return ex.inhale;
          }
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [phase, selected]);

  const stop = () => {
    clearInterval(intervalRef.current);
    setPhase('ready');
    setCount(0);
  };

  const phaseColor = { inhale: 'text-blue-600', hold: 'text-yellow-600', exhale: 'text-green-600' };
  const phaseLabel = { inhale: 'Breathe In', hold: 'Hold', exhale: 'Breathe Out', ready: 'Ready' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-lg mx-auto p-6">
        <h2 className="text-xl font-medium text-gray-800 mb-6">🧘 Meditation & Breathing</h2>

        <div className="flex gap-3 mb-6">
          {exercises.map((e, i) => (
            <button key={i} onClick={() => { stop(); setSelected(i); }}
              className={`flex-1 p-3 rounded-xl text-sm border ${
                selected === i ? 'border-purple-500 bg-purple-50 text-purple-700' : 'bg-white text-gray-600'
              }`}>
              <p className="font-medium">{e.name}</p>
              <p className="text-xs mt-1 text-gray-400">{e.desc}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-10 shadow text-center mb-6">
          <div className={`text-6xl font-medium mb-3 ${phaseColor[phase] || 'text-gray-400'}`}>
            {phase === 'ready' ? '✨' : count}
          </div>
          <p className={`text-xl font-medium ${phaseColor[phase] || 'text-gray-500'}`}>
            {phaseLabel[phase]}
          </p>
          {cycles > 0 && <p className="text-sm text-gray-400 mt-2">{cycles} cycles completed</p>}
        </div>

        <div className="flex gap-3">
          {phase === 'ready' ? (
            <button onClick={start}
              className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700">
              Start
            </button>
          ) : (
            <button onClick={stop}
              className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600">
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}