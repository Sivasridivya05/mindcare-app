import { useState, useEffect, useRef } from 'react';
import api from '../api';

const tracks = [
  {
    category: 'Study Music',
    icon: '📚',
    color: 'bg-purple-50 border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    items: [
      { title: 'Lo-Fi Hip Hop', desc: 'Chill beats for deep focus', emoji: '🎵', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
      { title: 'Classical Focus', desc: 'Mozart & Bach for concentration', emoji: '🎻', url: 'https://www.youtube.com/watch?v=SRecDjMwJYo' },
      { title: 'Alpha Waves', desc: 'Binaural beats for studying', emoji: '🧠', url: 'https://www.youtube.com/watch?v=WPni755-Krg' },
    ]
  },
  {
    category: 'White Noise',
    icon: '🌫️',
    color: 'bg-gray-50 border-gray-200',
    badge: 'bg-gray-100 text-gray-700',
    items: [
      { title: 'Pure White Noise', desc: 'Block all distractions', emoji: '📻', url: 'https://www.youtube.com/watch?v=nMfPqeZjc2c' },
      { title: 'Brown Noise', desc: 'Deep rumble for focus', emoji: '🔊', url: 'https://www.youtube.com/watch?v=RqzGzwTY-6w' },
      { title: 'Pink Noise', desc: 'Balanced sound for sleep & study', emoji: '🎧', url: 'https://www.youtube.com/watch?v=ZXtimhT-ff4' },
    ]
  },
  {
    category: 'Rain Sounds',
    icon: '🌧️',
    color: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    items: [
      { title: 'Gentle Rain', desc: 'Soft rain on a window', emoji: '🌦️', url: 'https://www.youtube.com/watch?v=q76bMs-NwRk' },
      { title: 'Thunderstorm', desc: 'Heavy rain with thunder', emoji: '⛈️', url: 'https://www.youtube.com/watch?v=yIQd2Ya0Ziw' },
      { title: 'Forest Rain', desc: 'Rain in a peaceful forest', emoji: '🌲', url: 'https://www.youtube.com/watch?v=xNN7iTA57jM' },
    ]
  },
  {
    category: 'Focus Playlists',
    icon: '🎯',
    color: 'bg-green-50 border-green-200',
    badge: 'bg-green-100 text-green-700',
    items: [
      { title: 'Deep Work Mix', desc: '2 hours of pure focus music', emoji: '⚡', url: 'https://www.youtube.com/watch?v=lTRiuFIWV54' },
      { title: 'Coding Music', desc: 'Electronic beats for coders', emoji: '💻', url: 'https://www.youtube.com/watch?v=b1bLXUFiAoE' },
      { title: 'Exam Prep', desc: 'Calm instrumental for revision', emoji: '📝', url: 'https://www.youtube.com/watch?v=7NOSDKb0HlU' },
    ]
  },
];

// Built-in ambient sound generator using Web Audio API
function useAmbientSound() {
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const gainRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [type, setType] = useState('white');

  const stop = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    setPlaying(false);
  };

  const play = (noiseType) => {
    stop();
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (noiseType === 'white') {
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    } else if (noiseType === 'brown') {
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (last + 0.02 * white) / 1.02;
        last = data[i];
        data[i] *= 3.5;
      }
    } else if (noiseType === 'rain') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (Math.random() < 0.003 ? 0.8 : 0.05);
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0.4;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    sourceRef.current = source;
    gainRef.current = gain;
    setPlaying(true);
    setType(noiseType);
  };

  const setVolume = (v) => {
    if (gainRef.current) gainRef.current.gain.value = v;
  };

  return { play, stop, playing, type, setVolume };
}

export default function FocusMusicPlayer() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [stressAlert, setStressAlert] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [nowPlaying, setNowPlaying] = useState(null);
  const ambient = useAmbientSound();

  // Check stress level from recent mood log
  useEffect(() => {
    api.get('/mood/history').then(res => {
      if (res.data.length > 0) {
        const latest = res.data[0];
        if (latest.stressLevel >= 7) setStressAlert(true);
      }
    }).catch(() => {});
  }, []);

  const handleVolumeChange = (v) => {
    setVolume(v);
    ambient.setVolume(v);
  };

  const playAmbient = (type) => {
    if (ambient.playing && ambient.type === type) {
      ambient.stop();
      setNowPlaying(null);
    } else {
      ambient.play(type);
      setNowPlaying(type);
    }
  };

  const openTrack = (url, title) => {
    window.open(url, '_blank');
    setNowPlaying(title);
  };

  const ambientSounds = [
    { type: 'white', label: 'White Noise', emoji: '📻' },
    { type: 'brown', label: 'Brown Noise', emoji: '🔊' },
    { type: 'rain', label: 'Rain Sound', emoji: '🌧️' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow">

      {/* Stress Alert Banner */}
      {stressAlert && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <span className="text-2xl">😰</span>
          <div className="flex-1">
            <p className="font-medium text-red-700 text-sm">High stress detected from your last mood log!</p>
            <p className="text-red-500 text-xs mt-0.5">Music can help — try rain sounds or lo-fi beats</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { playAmbient('rain'); setStressAlert(false); }}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs hover:bg-blue-200">
              🌧️ Play Rain
            </button>
            <button onClick={() => setStressAlert(false)}
              className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-medium text-gray-800">🎵 Focus Music Generator</h2>
          <p className="text-sm text-gray-400">Music to boost focus, reduce stress & improve sleep</p>
        </div>
        {nowPlaying && (
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-purple-600 max-w-24 truncate">{nowPlaying}</span>
          </div>
        )}
      </div>

      {/* Built-in Ambient Sounds */}
      <div className="mb-5">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">▶ Play Instantly (built-in)</p>
        <div className="grid grid-cols-3 gap-2">
          {ambientSounds.map(s => (
            <button key={s.type}
              onClick={() => playAmbient(s.type)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                ambient.playing && ambient.type === s.type
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-100 bg-gray-50 hover:border-purple-200'
              }`}>
              <p className="text-xl mb-1">{s.emoji}</p>
              <p className="text-xs font-medium text-gray-700">{s.label}</p>
              {ambient.playing && ambient.type === s.type && (
                <p className="text-xs text-purple-500 mt-0.5">● Playing</p>
              )}
            </button>
          ))}
        </div>

        {/* Volume Slider */}
        {ambient.playing && (
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs text-gray-400">🔈</span>
            <input type="range" min="0" max="1" step="0.05" value={volume}
              onChange={e => handleVolumeChange(parseFloat(e.target.value))}
              className="flex-1 accent-purple-600" />
            <span className="text-xs text-gray-400">🔊</span>
            <button onClick={() => { ambient.stop(); setNowPlaying(null); }}
              className="text-xs text-red-400 hover:text-red-600 ml-1">Stop</button>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
        {tracks.map((cat, i) => (
          <button key={i} onClick={() => setActiveCategory(i)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === i
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {cat.icon} {cat.category}
          </button>
        ))}
      </div>

      {/* Track List */}
      <div className="space-y-2">
        {tracks[activeCategory].items.map((track, i) => (
          <button key={i}
            onClick={() => openTrack(track.url, track.title)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:shadow-md ${tracks[activeCategory].color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{track.emoji}</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">{track.title}</p>
                  <p className="text-xs text-gray-500">{track.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${tracks[activeCategory].badge}`}>
                  YouTube
                </span>
                <span className="text-gray-400 text-sm">▶</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-300 mt-4 text-center">
        Built-in sounds play directly • YouTube tracks open in new tab
      </p>
    </div>
  );
}