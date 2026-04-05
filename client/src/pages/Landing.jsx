import { useNavigate } from 'react-router-dom';

const features = [
  { icon: '🧠', title: 'AI Chat Support', desc: 'Talk to our AI assistant 24/7 for mental health guidance', color: 'bg-purple-50 border-purple-100' },
  { icon: '🎮', title: 'Mental Health Games', desc: 'Fun mini-games designed to reduce anxiety and improve focus', color: 'bg-blue-50 border-blue-100' },
  { icon: '🎵', title: 'Focus Music', desc: 'Study music, white noise and rain sounds to boost concentration', color: 'bg-green-50 border-green-100' },
  { icon: '📅', title: 'Book Counselling', desc: 'Schedule sessions with professional therapists easily', color: 'bg-yellow-50 border-yellow-100' },
  { icon: '⏰', title: 'Smart Break Reminder', desc: 'Detects study time and suggests stretches and breathing breaks', color: 'bg-pink-50 border-pink-100' },
  { icon: '📊', title: 'Mood Analytics', desc: 'Track your emotional patterns with beautiful charts', color: 'bg-teal-50 border-teal-100' },
];

const stats = [
  { value: '500+', label: 'Students Supported' },
  { value: '98%', label: 'Feel Less Stressed' },
  { value: '24/7', label: 'AI Support Available' },
  { value: '50+', label: 'Therapists Available' },
];

const testimonials = [
  { name: 'Priya S.', role: 'Engineering Student', text: 'The breathing games really helped me calm down before exams. I feel so much better!', avatar: '👩‍💻' },
  { name: 'Arjun K.', role: 'Medical Student', text: 'Booking sessions with my therapist is so easy now. The dashboard tracks everything perfectly.', avatar: '👨‍⚕️' },
  { name: 'Meera R.', role: 'Arts Student', text: 'The focus music and smart break reminders have completely changed how I study.', avatar: '👩‍🎨' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <span className="font-medium text-gray-800 text-lg">MindCare</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#features" className="hover:text-purple-600 transition-colors">Features</a>
          <a href="#stats" className="hover:text-purple-600 transition-colors">Impact</a>
          <a href="#testimonials" className="hover:text-purple-600 transition-colors">Stories</a>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm text-purple-600 border border-purple-200 rounded-xl hover:bg-purple-50 transition-all">
            Login
          </button>
          <button onClick={() => navigate('/register')}
            className="px-4 py-2 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-md">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 opacity-10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-indigo-300 opacity-10 rounded-full blur-2xl" />

        <div className="max-w-6xl mx-auto px-8 py-24 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Supporting students every day
            </div>
            <h1 className="text-5xl md:text-6xl font-medium leading-tight mb-6 max-w-3xl">
              Your Mental Health
              <span className="block text-yellow-300">Matters Most 💛</span>
            </h1>
            <p className="text-purple-100 text-lg mb-8 leading-relaxed max-w-xl">
              A safe space built for students. Track your mood, play calming games,
              book therapy sessions — all in one place.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => navigate('/register')}
                className="bg-white text-purple-600 px-8 py-3 rounded-xl font-medium hover:bg-purple-50 transition-all shadow-lg text-sm">
                Start Free Today →
              </button>
              <button onClick={() => navigate('/login')}
                className="border border-white border-opacity-40 text-white px-8 py-3 rounded-xl font-medium hover:bg-white hover:bg-opacity-10 transition-all text-sm">
                Already a member? Login
              </button>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 justify-center mt-10">
              {['🎮 Mental Games', '🎵 Focus Music', '📅 Book Sessions', '⏰ Break Reminders', '✅ Habit Tracker'].map((f, i) => (
                <span key={i} className="bg-white bg-opacity-15 border border-white border-opacity-20 px-4 py-1.5 rounded-full text-sm text-white">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-100">
                <p className="text-4xl font-medium text-purple-600 mb-1">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-14">
            <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full">
              Everything you need
            </span>
            <h2 className="text-3xl font-medium text-gray-800 mt-3 mb-3">
              Built for Student Well-Being
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              From mood tracking to therapy booking — every feature is designed to help you thrive academically and mentally.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i}
                className={`p-6 rounded-2xl border-2 ${f.color} hover:shadow-md transition-all cursor-default`}>
                <span className="text-4xl mb-4 block">{f.icon}</span>
                <h3 className="font-medium text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-14">
            <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
              Simple & Easy
            </span>
            <h2 className="text-3xl font-medium text-gray-800 mt-3 mb-3">
              Get Started in 3 Steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '✍️', title: 'Create Account', desc: 'Sign up as a student or therapist in under 30 seconds' },
              { step: '02', icon: '📊', title: 'Track Your Mood', desc: 'Log your daily mood, stress, sleep and study hours' },
              { step: '03', icon: '💬', title: 'Get Support', desc: 'Book sessions, play calming games and use break reminders' },
            ].map((s, i) => (
              <div key={i} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-3/4 w-1/2 border-t-2 border-dashed border-purple-200" />
                )}
                <div className="w-16 h-16 bg-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">
                  {s.icon}
                </div>
                <span className="text-xs text-purple-400 font-medium">Step {s.step}</span>
                <h3 className="font-medium text-gray-800 mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-14">
            <span className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full">
              Real Stories
            </span>
            <h2 className="text-3xl font-medium text-gray-800 mt-3 mb-3">
              Students Love MindCare
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{t.avatar}</span>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
                <div className="flex gap-1 mt-4">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <span className="text-5xl mb-6 block">💙</span>
          <h2 className="text-4xl font-medium mb-4">You Are Not Alone</h2>
          <p className="text-purple-200 text-lg mb-8 leading-relaxed">
            Thousands of students are already taking care of their mental health with MindCare.
            Join them today — it's completely free to start.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => navigate('/register')}
              className="bg-white text-purple-600 px-10 py-4 rounded-xl font-medium hover:bg-purple-50 transition-all shadow-lg">
              Join MindCare Free →
            </button>
            <button onClick={() => navigate('/login')}
              className="border border-white border-opacity-40 text-white px-10 py-4 rounded-xl hover:bg-white hover:bg-opacity-10 transition-all">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="text-white font-medium">MindCare</span>
          </div>
          <p className="text-sm text-center">Built with 💙 for student mental health</p>
          <div className="flex gap-6 text-sm">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <button onClick={() => navigate('/register')}
              className="hover:text-white transition-colors">Register</button>
            <button onClick={() => navigate('/login')}
              className="hover:text-white transition-colors">Login</button>
          </div>
        </div>
      </footer>

    </div>
  );
}