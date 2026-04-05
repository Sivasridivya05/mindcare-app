import { useState } from 'react';
import Navbar from '../components/Navbar';

const content = [
  { category: 'Videos', emoji: '🎥', items: [
    {
      title: 'Managing Exam Stress',
      duration: '8 min', tag: 'stress',
      description: 'Learn proven techniques to manage exam stress effectively.',
      tips: [
        'Break study sessions into 25-minute focused blocks',
        'Practice deep breathing before exams',
        'Get at least 7-8 hours of sleep the night before',
        'Avoid cramming — review notes instead',
        'Stay hydrated and eat a proper meal'
      ],
      url: 'https://www.youtube.com/results?search_query=managing+exam+stress'
    },
    {
      title: 'Sleep Better Tonight',
      duration: '12 min', tag: 'sleep',
      description: 'Simple habits to improve your sleep quality as a student.',
      tips: [
        'Set a consistent sleep schedule every day',
        'Avoid screens 30 minutes before bed',
        'Keep your room cool and dark',
        'Avoid caffeine after 3pm',
        'Try the 4-7-8 breathing technique to fall asleep faster'
      ],
      url: 'https://www.youtube.com/results?search_query=better+sleep+for+students'
    },
    {
      title: 'Overcoming Anxiety',
      duration: '15 min', tag: 'anxiety',
      description: 'Practical strategies to manage anxiety in daily student life.',
      tips: [
        'Identify your anxiety triggers and write them down',
        'Practice mindfulness for 5 minutes daily',
        'Talk to a trusted friend or counselor',
        'Exercise regularly — even a 15 min walk helps',
        'Challenge negative thoughts with positive reframes'
      ],
      url: 'https://www.youtube.com/results?search_query=overcoming+anxiety+students'
    },
  ]},
  { category: 'Articles', emoji: '📖', items: [
    {
      title: 'The Pomodoro Technique',
      duration: '5 min read', tag: 'study',
      description: 'A time management method that boosts focus and reduces burnout.',
      tips: [
        'Work for 25 minutes, then take a 5-minute break',
        'After 4 pomodoros, take a longer 15-30 min break',
        'Write down distractions instead of acting on them',
        'Use a timer — physical or app-based',
        'Track how many pomodoros each task takes'
      ],
      url: 'https://en.wikipedia.org/wiki/Pomodoro_Technique'
    },
    {
      title: 'Mindfulness for Students',
      duration: '7 min read', tag: 'mindfulness',
      description: 'How mindfulness practice can transform your academic experience.',
      tips: [
        'Start with just 5 minutes of meditation daily',
        'Focus on your breath when feeling overwhelmed',
        'Do a body scan before sleeping',
        'Practice gratitude — write 3 things you are thankful for',
        'Be present during meals — avoid phone use'
      ],
      url: 'https://www.headspace.com/mindfulness/students'
    },
    {
      title: 'Healthy Study Habits',
      duration: '6 min read', tag: 'study',
      description: 'Build study habits that actually stick and improve performance.',
      tips: [
        'Study at the same time and place every day',
        'Use active recall instead of re-reading notes',
        'Teach concepts to someone else to solidify learning',
        'Review material within 24 hours of learning it',
        'Prioritize tasks using the Eisenhower Matrix'
      ],
      url: 'https://www.google.com/search?q=healthy+study+habits+for+students'
    },
  ]},
  { category: 'Exercises', emoji: '🏃', items: [
    {
      title: 'Morning Stretch Routine',
      duration: '10 min', tag: 'fitness',
      description: 'Start your day energized with this simple stretch routine.',
      tips: [
        'Neck rolls — 10 seconds each side',
        'Shoulder shrugs — 10 reps',
        'Forward fold — hold 30 seconds',
        'Cat-cow stretch — 10 reps',
        'Child\'s pose — hold 1 minute'
      ],
      url: 'https://www.youtube.com/results?search_query=morning+stretch+routine+students'
    },
    {
      title: 'Desk Yoga for Students',
      duration: '8 min', tag: 'fitness',
      description: 'Quick yoga poses you can do right at your study desk.',
      tips: [
        'Seated spinal twist — hold 20 seconds each side',
        'Wrist and finger stretches — 30 seconds',
        'Seated forward bend — hold 30 seconds',
        'Eye exercises — look far away for 20 seconds',
        'Shoulder blade squeeze — 10 reps'
      ],
      url: 'https://www.youtube.com/results?search_query=desk+yoga+for+students'
    },
    {
      title: 'Evening Wind-Down',
      duration: '15 min', tag: 'relax',
      description: 'Calm your mind and body after a long day of studying.',
      tips: [
        'Light stretching for 5 minutes',
        'Journal your thoughts and wins of the day',
        'Prepare your study plan for tomorrow',
        'Do 4-7-8 breathing for 5 minutes',
        'Dim your lights and avoid screens'
      ],
      url: 'https://www.youtube.com/results?search_query=evening+wind+down+routine'
    },
  ]},
];

const tagColor = {
  stress: 'bg-red-100 text-red-700',
  sleep: 'bg-blue-100 text-blue-700',
  anxiety: 'bg-yellow-100 text-yellow-700',
  study: 'bg-green-100 text-green-700',
  mindfulness: 'bg-purple-100 text-purple-700',
  fitness: 'bg-orange-100 text-orange-700',
  relax: 'bg-teal-100 text-teal-700',
};

export default function ContentLibrary() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-medium text-gray-800 mb-6">📚 Relaxation Content Library</h2>

        {/* Content Grid */}
        {content.map((section, i) => (
          <div key={i} className="mb-8">
            <h3 className="font-medium text-gray-700 mb-3">{section.emoji} {section.category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.items.map((item, j) => (
                <div key={j}
                  onClick={() => setSelected(item)}
                  className="bg-white rounded-xl p-5 shadow hover:shadow-md cursor-pointer hover:border-purple-300 border-2 border-transparent transition-all">
                  <p className="font-medium text-gray-800 mb-1">{item.title}</p>
                  <p className="text-sm text-gray-400 mb-3">{item.duration}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${tagColor[item.tag]}`}>
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Modal Popup */}
        {selected && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelected(null)}>
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={e => e.stopPropagation()}>

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{selected.title}</h3>
                  <p className="text-sm text-gray-400">{selected.duration}</p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-medium">✕</button>
              </div>

              <p className="text-sm text-gray-600 mb-4">{selected.description}</p>

              <h4 className="font-medium text-gray-700 mb-2">Key Tips:</h4>
              <ul className="space-y-2 mb-5">
                {selected.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-purple-500 mt-0.5">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <a href={selected.url} target="_blank" rel="noreferrer"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-xl text-center text-sm hover:bg-purple-700">
                  Open Resource
                </a>
                <button onClick={() => setSelected(null)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}