import { useState } from 'react';
import api from '../api';

const questions = [
  {
    id: 'anxiety',
    category: 'stress',
    question: 'How many times did you feel anxious or nervous today?',
    options: [
      { label: 'Not at all', value: 0, emoji: '😌' },
      { label: 'Once or twice', value: 1, emoji: '🙂' },
      { label: 'Several times', value: 2, emoji: '😟' },
      { label: 'Almost constantly', value: 3, emoji: '😰' },
    ]
  },
  {
    id: 'concentration',
    category: 'stress',
    question: 'Did you have trouble concentrating or focusing today?',
    options: [
      { label: 'No, I focused well', value: 0, emoji: '🎯' },
      { label: 'Slightly distracted', value: 1, emoji: '😐' },
      { label: 'Hard to concentrate', value: 2, emoji: '😕' },
      { label: 'Could not focus at all', value: 3, emoji: '🤯' },
    ]
  },
  {
    id: 'overwhelmed',
    category: 'stress',
    question: 'Did you feel overwhelmed by your tasks or responsibilities?',
    options: [
      { label: 'Not at all', value: 0, emoji: '😎' },
      { label: 'A little bit', value: 1, emoji: '🙂' },
      { label: 'Quite overwhelmed', value: 2, emoji: '😓' },
      { label: 'Completely overwhelmed', value: 3, emoji: '😵' },
    ]
  },
  {
    id: 'energy',
    category: 'mood',
    question: 'How was your energy level throughout the day?',
    options: [
      { label: 'Very energetic', value: 3, emoji: '⚡' },
      { label: 'Moderate energy', value: 2, emoji: '🙂' },
      { label: 'Low energy', value: 1, emoji: '😴' },
      { label: 'Completely drained', value: 0, emoji: '🪫' },
    ]
  },
  {
    id: 'happiness',
    category: 'mood',
    question: 'How happy or positive did you feel today?',
    options: [
      { label: 'Very happy', value: 3, emoji: '😄' },
      { label: 'Fairly good', value: 2, emoji: '😊' },
      { label: 'Not great', value: 1, emoji: '😕' },
      { label: 'Very sad or low', value: 0, emoji: '😢' },
    ]
  },
  {
    id: 'motivation',
    category: 'mood',
    question: 'How motivated were you to study or do your work today?',
    options: [
      { label: 'Very motivated', value: 3, emoji: '🚀' },
      { label: 'Somewhat motivated', value: 2, emoji: '👍' },
      { label: 'Low motivation', value: 1, emoji: '😑' },
      { label: 'No motivation at all', value: 0, emoji: '😩' },
    ]
  },
  {
    id: 'sleep',
    category: 'sleep',
    question: 'How well did you sleep last night?',
    options: [
      { label: 'Very well (7-9 hrs)', value: 9, emoji: '😴' },
      { label: 'Fairly well (6-7 hrs)', value: 7, emoji: '🙂' },
      { label: 'Poorly (4-6 hrs)', value: 5, emoji: '😕' },
      { label: 'Barely slept (<4 hrs)', value: 3, emoji: '😵' },
    ]
  },
  {
    id: 'study',
    category: 'study',
    question: 'How many hours did you study or work today?',
    options: [
      { label: 'More than 6 hours', value: 7, emoji: '📚' },
      { label: '4 to 6 hours', value: 5, emoji: '📖' },
      { label: '2 to 4 hours', value: 3, emoji: '📝' },
      { label: 'Less than 2 hours', value: 1, emoji: '😴' },
    ]
  },
  {
    id: 'physical',
    category: 'stress',
    question: 'Did you experience any physical symptoms of stress today?',
    options: [
      { label: 'None at all', value: 0, emoji: '💪' },
      { label: 'Mild headache or fatigue', value: 1, emoji: '😐' },
      { label: 'Headache and tension', value: 2, emoji: '🤕' },
      { label: 'Chest tightness or racing heart', value: 3, emoji: '💔' },
    ]
  },
  {
    id: 'social',
    category: 'mood',
    question: 'How did your interactions with others feel today?',
    options: [
      { label: 'Great, enjoyed socializing', value: 3, emoji: '🤝' },
      { label: 'Normal, nothing special', value: 2, emoji: '😊' },
      { label: 'Avoided people a bit', value: 1, emoji: '😶' },
      { label: 'Isolated or lonely', value: 0, emoji: '😔' },
    ]
  },
];

const getStressLevel = (score) => {
  if (score <= 2) return { level: 'Very Low', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', emoji: '😌', desc: 'You are handling things very well today!' };
  if (score <= 4) return { level: 'Low', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', emoji: '🙂', desc: 'Mild stress — completely normal and manageable.' };
  if (score <= 6) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', emoji: '😟', desc: 'Some stress detected. Take breaks and stay hydrated.' };
  if (score <= 8) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', emoji: '😰', desc: 'High stress! Your therapist will be notified.' };
  return { level: 'Very High', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', emoji: '😵', desc: 'Critical stress level. Please talk to your therapist immediately.' };
};

const getMoodLevel = (score) => {
  if (score >= 9) return { level: 'Excellent', color: 'text-green-600', emoji: '😄' };
  if (score >= 7) return { level: 'Good', color: 'text-teal-600', emoji: '😊' };
  if (score >= 5) return { level: 'Fair', color: 'text-yellow-600', emoji: '😐' };
  if (score >= 3) return { level: 'Low', color: 'text-orange-600', emoji: '😕' };
  return { level: 'Very Low', color: 'text-red-600', emoji: '😢' };
};

export default function GuidedMoodAssessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);

  const current = questions[step];
  const progress = ((step) / questions.length) * 100;

  const selectAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const next = () => {
    if (step < questions.length - 1) {
      setStep(s => s + 1);
    } else {
      calculateResult();
    }
  };

  const prev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const calculateResult = () => {
    // Stress score (0-10)
    const stressQuestions = questions.filter(q => q.category === 'stress');
    const stressRaw = stressQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const stressMax = stressQuestions.length * 3;
    const stressScore = Math.round((stressRaw / stressMax) * 10);

    // Mood score (0-10)
    const moodQuestions = questions.filter(q => q.category === 'mood');
    const moodRaw = moodQuestions.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    const moodMax = moodQuestions.length * 3;
    const moodScore = Math.round((moodRaw / moodMax) * 10);

    // Sleep hours
    const sleepHours = answers['sleep'] || 7;

    // Study hours
    const studyHours = answers['study'] || 4;

    setResult({
      stressScore,
      moodScore,
      sleepHours,
      studyHours,
      stressInfo: getStressLevel(stressScore),
      moodInfo: getMoodLevel(moodScore),
    });
  };

  const saveToDatabase = async () => {
    if (!result) return;
    setLoading(true);
    try {
      await api.post('/mood', {
        mood: result.moodScore,
        stressLevel: result.stressScore,
        sleepHours: result.sleepHours,
        studyHours: result.studyHours,
        notes: `Auto-calculated from guided assessment. Stress: ${result.stressInfo.level}, Mood: ${result.moodInfo.level}`
      });
      setSubmitted(true);
    } catch {
      alert('Failed to save. Please try again.');
    }
    setLoading(false);
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setSubmitted(false);
    setStarted(false);
  };

  // Start Screen
  if (!started) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow">
        <div className="text-center py-4">
          <p className="text-4xl mb-3">🧠</p>
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            Daily Well-Being Assessment
          </h2>
          <p className="text-sm text-gray-500 mb-2 max-w-sm mx-auto">
            Answer 10 simple questions and we will automatically calculate your mood and stress score for today.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Takes about 2 minutes · Your therapist can see your results
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6 text-left">
            {[
              { icon: '😊', label: 'Mood score', desc: 'Auto-calculated from your answers' },
              { icon: '😰', label: 'Stress level', desc: 'Based on anxiety and focus questions' },
              { icon: '😴', label: 'Sleep quality', desc: 'From your sleep experience answer' },
              { icon: '📊', label: 'Saved to profile', desc: 'Therapist sees your daily data' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-purple-50 rounded-xl">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-xs font-medium text-purple-700">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setStarted(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 shadow-md">
            Start Assessment →
          </button>
        </div>
      </div>
    );
  }

  // Result Screen
  if (result) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow">
        <div className="text-center mb-6">
          <p className="text-3xl mb-2">🎯</p>
          <h2 className="text-lg font-medium text-gray-800">Your Assessment Results</h2>
          <p className="text-xs text-gray-400">
            Calculated from your {questions.length} answers
          </p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
            <p className="text-xs text-purple-500 uppercase tracking-wide mb-1">Mood Score</p>
            <p className="text-4xl font-medium text-purple-600 mb-1">{result.moodScore}<span className="text-lg text-purple-400">/10</span></p>
            <p className="text-2xl mb-1">{result.moodInfo.emoji}</p>
            <p className={`text-sm font-medium ${result.moodInfo.color}`}>{result.moodInfo.level}</p>
          </div>
          <div className={`${result.stressInfo.bg} rounded-2xl p-4 text-center border ${result.stressInfo.border}`}>
            <p className={`text-xs uppercase tracking-wide mb-1 ${result.stressInfo.color}`}>Stress Level</p>
            <p className={`text-4xl font-medium mb-1 ${result.stressInfo.color}`}>{result.stressScore}<span className="text-lg opacity-60">/10</span></p>
            <p className="text-2xl mb-1">{result.stressInfo.emoji}</p>
            <p className={`text-sm font-medium ${result.stressInfo.color}`}>{result.stressInfo.level}</p>
          </div>
        </div>

        {/* Sleep & Study */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
            <p className="text-xl mb-1">😴</p>
            <p className="text-lg font-medium text-blue-600">{result.sleepHours}h</p>
            <p className="text-xs text-gray-400">Sleep hours</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
            <p className="text-xl mb-1">📚</p>
            <p className="text-lg font-medium text-green-600">{result.studyHours}h</p>
            <p className="text-xs text-gray-400">Study hours</p>
          </div>
        </div>

        {/* Stress description */}
        <div className={`${result.stressInfo.bg} border ${result.stressInfo.border} rounded-xl p-4 mb-5`}>
          <p className={`text-sm font-medium ${result.stressInfo.color} mb-1`}>
            {result.stressInfo.emoji} {result.stressInfo.level} Stress Detected
          </p>
          <p className="text-xs text-gray-600">{result.stressInfo.desc}</p>
        </div>

        {/* Recommendations */}
        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <p className="text-sm font-medium text-gray-700 mb-2">💡 Recommendations for you</p>
          <div className="space-y-1.5">
            {result.stressScore >= 7 && (
              <p className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">→</span>
                Consider booking a session with your therapist today
              </p>
            )}
            {result.sleepHours < 6 && (
              <p className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">→</span>
                Try to sleep earlier tonight — aim for at least 7 hours
              </p>
            )}
            {result.moodScore < 5 && (
              <p className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">→</span>
                Try the breathing game or meditation timer to lift your mood
              </p>
            )}
            {result.stressScore >= 5 && (
              <p className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-yellow-500 mt-0.5">→</span>
                Take a 5-minute break using the Smart Break Reminder
              </p>
            )}
            {result.stressScore < 5 && result.moodScore >= 7 && (
              <p className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-green-500 mt-0.5">→</span>
                Great day! Keep up your current routine and habits
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {!submitted ? (
          <div className="flex gap-3">
            <button onClick={saveToDatabase} disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                '📊 Save to My Profile'
              )}
            </button>
            <button onClick={restart}
              className="border border-gray-300 text-gray-600 px-4 py-3 rounded-xl hover:bg-gray-50 text-sm">
              Redo
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p className="text-green-700 font-medium text-sm">
                ✅ Results saved! Your therapist can now see your assessment.
              </p>
            </div>
            <button onClick={restart}
              className="text-sm text-purple-600 hover:text-purple-700 underline">
              Take assessment again tomorrow
            </button>
          </div>
        )}
      </div>
    );
  }

  // Question Screen
  return (
    <div className="bg-white rounded-2xl p-6 shadow">

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Question {step + 1} of {questions.length}</span>
          <span className="text-xs text-purple-600 font-medium">{Math.round(progress)}% done</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-4">
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          current.category === 'stress' ? 'bg-red-100 text-red-600' :
          current.category === 'mood' ? 'bg-purple-100 text-purple-600' :
          current.category === 'sleep' ? 'bg-blue-100 text-blue-600' :
          'bg-green-100 text-green-600'
        }`}>
          {current.category === 'stress' ? '😰 Stress Check' :
           current.category === 'mood' ? '😊 Mood Check' :
           current.category === 'sleep' ? '😴 Sleep Check' :
           '📚 Study Check'}
        </span>
      </div>

      {/* Question */}
      <h3 className="text-base font-medium text-gray-800 mb-5 leading-relaxed">
        {current.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {current.options.map((option, i) => (
          <button key={i}
            onClick={() => selectAnswer(current.id, option.value)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
              answers[current.id] === option.value
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-100 bg-gray-50 hover:border-purple-200 hover:bg-purple-50'
            }`}>
            <span className="text-2xl">{option.emoji}</span>
            <span className={`text-sm font-medium ${
              answers[current.id] === option.value
                ? 'text-purple-700'
                : 'text-gray-700'
            }`}>
              {option.label}
            </span>
            {answers[current.id] === option.value && (
              <span className="ml-auto text-purple-500">✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={prev}
            className="border border-gray-300 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 text-sm">
            ← Back
          </button>
        )}
        <button
          onClick={next}
          disabled={answers[current.id] === undefined}
          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
          {step === questions.length - 1 ? '🎯 Calculate My Score' : 'Next →'}
        </button>
      </div>
    </div>
  );
}