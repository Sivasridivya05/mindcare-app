import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async () => {
    try {
      console.log('Submitting form:', form); // ← check this in browser console
      if (!form.name || !form.email || !form.password) {
        setMsg('Please fill in all fields.');
        return;
      }
      await api.post('/auth/register', form);
      setMsg('Registered! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Error:', err.response?.data);
      setMsg(err.response?.data?.error || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-medium text-purple-700 mb-6">Create Account</h1>
        {msg && <p className="text-sm mb-4 text-purple-600">{msg}</p>}

        <input
          className="border rounded-lg p-3 w-full mb-3"
          placeholder="Full Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border rounded-lg p-3 w-full mb-3"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="border rounded-lg p-3 w-full mb-3"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="border rounded-lg p-3 w-full mb-4"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}>
          <option value="student">Student</option>
          <option value="therapist">Therapist / Counselor</option>
        </select>

        <button
          onClick={submit}
          className="bg-purple-600 text-white w-full py-3 rounded-lg hover:bg-purple-700">
          Register
        </button>

        <p className="text-center text-sm mt-4 text-gray-500">
          Have account? <Link to="/login" className="text-purple-600">Login</Link>
        </p>
      </div>
    </div>
  );
}