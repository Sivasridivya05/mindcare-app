import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const [activeTab, setActiveTab] = useState('student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      const user = res.data.user;
      if (activeTab === 'student' && user.role !== 'student') {
        setError('This account is not a student account. Please use Therapist Login.');
        setLoading(false);
        return;
      }
      if (activeTab === 'therapist' && user.role !== 'therapist') {
        setError('This account is not a therapist account. Please use Student Login.');
        setLoading(false);
        return;
      }
      login(res.data.token, user);
      if (user.role === 'therapist') navigate('/therapist');
      else navigate('/dashboard');
    } catch {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-3xl">🧠</span>
          <span className="font-medium text-gray-800 text-2xl">MindCare</span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setActiveTab('student'); setError(''); setForm({ email: '', password: '' }); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'student'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              👨‍🎓 Student Login
            </button>
            <button
              onClick={() => { setActiveTab('therapist'); setError(''); setForm({ email: '', password: '' }); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'therapist'
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}>
              👨‍⚕️ Therapist Login
            </button>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-gray-800 mb-1">
              {activeTab === 'student' ? 'Student Sign In 👋' : 'Therapist Sign In 👨‍⚕️'}
            </h1>
            <p className="text-gray-400 text-sm">
              {activeTab === 'student'
                ? 'Access your well-being dashboard'
                : 'Access your therapist dashboard'}
            </p>
          </div>

          {/* Role Badge */}
          <div className={`rounded-xl p-3 mb-5 flex items-center gap-3 ${
            activeTab === 'student' ? 'bg-purple-50' : 'bg-teal-50'
          }`}>
            <span className="text-2xl">{activeTab === 'student' ? '🎓' : '🏥'}</span>
            <div>
              <p className={`text-sm font-medium ${activeTab === 'student' ? 'text-purple-700' : 'text-teal-700'}`}>
                {activeTab === 'student' ? 'Logging in as Student' : 'Logging in as Therapist'}
              </p>
              <p className={`text-xs ${activeTab === 'student' ? 'text-purple-400' : 'text-teal-400'}`}>
                {activeTab === 'student'
                  ? 'Track mood, book sessions, play games'
                  : 'Manage students, sessions and reports'}
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">✉️</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-white transition-all ${
                    activeTab === 'student'
                      ? 'focus:border-purple-400 focus:ring-purple-100'
                      : 'focus:border-teal-400 focus:ring-teal-100'
                  } border-gray-200`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && submit()}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-white transition-all ${
                    activeTab === 'student'
                      ? 'focus:border-purple-400 focus:ring-purple-100'
                      : 'focus:border-teal-400 focus:ring-teal-100'
                  } border-gray-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={submit}
            disabled={loading}
            className={`w-full py-3 rounded-xl font-medium transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4 text-white ${
              activeTab === 'student'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-200'
                : 'bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 shadow-teal-200'
            }`}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              `Sign In as ${activeTab === 'student' ? 'Student' : 'Therapist'} →`
            )}
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 font-medium hover:text-purple-700">
              Create one free →
            </Link>
          </p>

          {/* Back to home */}
          <p className="text-center mt-3">
            <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">
              ← Back to home
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}