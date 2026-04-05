import { useState, useEffect, useRef } from 'react';

// ── Game 1: Breathing Rhythm ──────────────────────────────
function BreathingGame({ onBack }) {
  const [phase, setPhase] = useState('ready');
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [size, setSize] = useState(100);
  const intervalRef = useRef(null);

  const phases = [
    { name: 'inhale', label: 'Breathe In', duration: 4, targetSize: 180 },
    { name: 'hold', label: 'Hold', duration: 4, targetSize: 180 },
    { name: 'exhale', label: 'Breathe Out', duration: 4, targetSize: 100 },
  ];
  const [phaseIdx, setPhaseIdx] = useState(0);

  const start = () => {
    setPhase('inhale');
    setPhaseIdx(0);
    setCount(4);
    setSize(100);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setPhase('ready');
    setCount(4);
    setSize(100);
    setPhaseIdx(0);
  };

  useEffect(() => {
    if (phase === 'ready') return;
    const current = phases[phaseIdx];
    setSize(current.targetSize);
    setCount(current.duration);

    intervalRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          clearInterval(intervalRef.current);
          const next = (phaseIdx + 1) % phases.length;
          if (next === 0) setCycles(cy => cy + 1);
          setPhaseIdx(next);
          setPhase(phases[next].name);
          return phases[next].duration;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [phaseIdx, phase]);

  const phaseColor = {
    inhale: '#7c3aed', hold: '#f59e0b', exhale: '#10b981', ready: '#d1d5db'
  };
  const phaseLabel = {
    inhale: 'Breathe In', hold: 'Hold', exhale: 'Breathe Out', ready: 'Press Start'
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={onBack} className="self-start text-sm text-gray-400 hover:text-gray-600 mb-4">← Back</button>
      <h3 className="font-medium text-gray-800 mb-1">🌬️ Breathing Rhythm Game</h3>
      <p className="text-sm text-gray-400 mb-6">Follow the circle to calm your mind</p>

      <div className="relative flex items-center justify-center mb-6" style={{ width: 220, height: 220 }}>
        {/* Ripple rings */}
        {phase !== 'ready' && (
          <>
            <div className="absolute rounded-full opacity-20 animate-ping"
              style={{ width: size + 40, height: size + 40, backgroundColor: phaseColor[phase], transition: 'all 1s ease' }} />
            <div className="absolute rounded-full opacity-10"
              style={{ width: size + 70, height: size + 70, backgroundColor: phaseColor[phase], transition: 'all 1s ease' }} />
          </>
        )}
        {/* Main circle */}
        <div className="rounded-full flex flex-col items-center justify-center shadow-lg"
          style={{
            width: size, height: size,
            backgroundColor: phaseColor[phase],
            transition: 'all 1s ease',
          }}>
          <span className="text-white text-3xl font-medium">{phase === 'ready' ? '✨' : count}</span>
          <span className="text-white text-xs mt-1">{phaseLabel[phase]}</span>
        </div>
      </div>

      {cycles > 0 && (
        <p className="text-sm text-purple-600 mb-3 font-medium">🎉 {cycles} cycles completed!</p>
      )}

      <div className="flex gap-3">
        {phase === 'ready' ? (
          <button onClick={start}
            className="bg-purple-600 text-white px-8 py-2 rounded-xl hover:bg-purple-700">
            Start
          </button>
        ) : (
          <button onClick={stop}
            className="bg-red-500 text-white px-8 py-2 rounded-xl hover:bg-red-600">
            Stop
          </button>
        )}
      </div>
    </div>
  );
}

// ── Game 2: Focus Dot Game ────────────────────────────────
function FocusGame({ onBack }) {
  const [dots, setDots] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(0);
  const timerRef = useRef(null);
  const dotTimerRef = useRef(null);

  const spawnDot = () => {
    const id = Date.now();
    const x = Math.random() * 80 + 5;
    const y = Math.random() * 80 + 5;
    const color = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'][Math.floor(Math.random() * 5)];
    setDots(prev => [...prev, { id, x, y, color }]);
    setTimeout(() => setDots(prev => prev.filter(d => d.id !== id)), 1200);
  };

  const start = () => {
    setScore(0);
    setTimeLeft(30);
    setDots([]);
    setRunning(true);
  };

  const clickDot = (id) => {
    setDots(prev => prev.filter(d => d.id !== id));
    setScore(s => s + 1);
  };

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(dotTimerRef.current);
          setRunning(false);
          setDots([]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    dotTimerRef.current = setInterval(spawnDot, 600);
    return () => {
      clearInterval(timerRef.current);
      clearInterval(dotTimerRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (!running && score > 0) setBest(b => Math.max(b, score));
  }, [running]);

  return (
    <div className="flex flex-col items-center">
      <button onClick={onBack} className="self-start text-sm text-gray-400 hover:text-gray-600 mb-4">← Back</button>
      <h3 className="font-medium text-gray-800 mb-1">🎯 Focus Dot Game</h3>
      <p className="text-sm text-gray-400 mb-3">Tap the dots before they disappear!</p>

      <div className="flex gap-6 mb-3 text-sm">
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Score: {score}</span>
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Time: {timeLeft}s</span>
        {best > 0 && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">Best: {best}</span>}
      </div>

      <div className="relative bg-gray-50 border-2 border-gray-200 rounded-2xl overflow-hidden mb-4"
        style={{ width: 300, height: 250 }}>
        {!running && timeLeft === 30 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Press Start to play!</p>
          </div>
        )}
        {!running && timeLeft === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90">
            <p className="text-2xl mb-1">🎉</p>
            <p className="font-medium text-gray-800">Score: {score}</p>
            <p className="text-sm text-gray-400">Best: {best}</p>
          </div>
        )}
        {dots.map(dot => (
          <button key={dot.id} onClick={() => clickDot(dot.id)}
            className="absolute rounded-full shadow-md hover:scale-110 transition-transform animate-bounce"
            style={{
              left: `${dot.x}%`, top: `${dot.y}%`,
              width: 36, height: 36,
              backgroundColor: dot.color,
              transform: 'translate(-50%, -50%)'
            }} />
        ))}
      </div>

      {!running && (
        <button onClick={start}
          className="bg-purple-600 text-white px-8 py-2 rounded-xl hover:bg-purple-700">
          {timeLeft === 0 ? 'Play Again' : 'Start'}
        </button>
      )}
    </div>
  );
}

// ── Game 3: Memory Relaxation ─────────────────────────────
function MemoryGame({ onBack }) {
  const emojis = ['🌸', '🌊', '🌿', '☀️', '🦋', '🌙'];
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const init = () => {
    const deck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((e, i) => ({ id: i, emoji: e }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
  };

  useEffect(() => { init(); }, []);

  const flip = (id) => {
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = next.map(i => cards.find(c => c.id === i));
      if (a.emoji === b.emoji) {
        const newMatched = [...matched, ...next];
        setMatched(newMatched);
        setFlipped([]);
        if (newMatched.length === cards.length) setWon(true);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button onClick={onBack} className="self-start text-sm text-gray-400 hover:text-gray-600 mb-4">← Back</button>
      <h3 className="font-medium text-gray-800 mb-1">🧠 Memory Relaxation Game</h3>
      <p className="text-sm text-gray-400 mb-3">Match the pairs to relax your mind</p>

      <div className="flex gap-4 mb-4 text-sm">
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Moves: {moves}</span>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
          Matched: {matched.length / 2}/{emojis.length}
        </span>
      </div>

      {won && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-3 mb-4 text-center">
          <p className="text-green-700 font-medium">🎉 You won in {moves} moves!</p>
          <p className="text-green-500 text-sm">Great focus — your mind is sharp!</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 mb-4">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
          return (
            <button key={card.id} onClick={() => flip(card.id)}
              className={`w-14 h-14 rounded-xl text-2xl flex items-center justify-center shadow transition-all duration-300 ${
                isFlipped
                  ? matched.includes(card.id)
                    ? 'bg-green-100 scale-95'
                    : 'bg-purple-100'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}>
              {isFlipped ? card.emoji : '?'}
            </button>
          );
        })}
      </div>

      <button onClick={init}
        className="border border-purple-300 text-purple-600 px-6 py-2 rounded-xl hover:bg-purple-50 text-sm">
        Restart
      </button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function MentalHealthGames() {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'breathing',
      title: '🌬️ Breathing Rhythm',
      desc: 'Follow the animated circle to calm anxiety',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      badge: 'bg-purple-100 text-purple-700',
      badgeText: 'Calming'
    },
    {
      id: 'focus',
      title: '🎯 Focus Dot Game',
      desc: 'Tap dots to sharpen your focus and attention',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      badge: 'bg-blue-100 text-blue-700',
      badgeText: 'Focus'
    },
    {
      id: 'memory',
      title: '🧠 Memory Relaxation',
      desc: 'Match emoji pairs to exercise your memory',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      badge: 'bg-green-100 text-green-700',
      badgeText: 'Memory'
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow">
      <h2 className="text-lg font-medium text-gray-800 mb-1">🎮 Mental Health Mini-Games</h2>
      <p className="text-sm text-gray-400 mb-5">Quick games to reduce anxiety and improve focus</p>

      {!activeGame ? (
        <div className="space-y-3">
          {games.map(g => (
            <button key={g.id} onClick={() => setActiveGame(g.id)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${g.color}`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{g.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{g.desc}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${g.badge}`}>{g.badgeText}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="py-2">
          {activeGame === 'breathing' && <BreathingGame onBack={() => setActiveGame(null)} />}
          {activeGame === 'focus' && <FocusGame onBack={() => setActiveGame(null)} />}
          {activeGame === 'memory' && <MemoryGame onBack={() => setActiveGame(null)} />}
        </div>
      )}
    </div>
  );
}