import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', category: 'general' });

  const fetchPosts = () => api.get('/forum').then(res => setPosts(res.data));

  useEffect(() => { fetchPosts(); }, []);

  const submit = async () => {
    if (!form.title || !form.content) return;
    await api.post('/forum', form);
    setForm({ title: '', content: '', category: 'general' });
    fetchPosts();
  };

  const like = async (id) => {
    await api.put(`/forum/${id}/like`);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-xl font-medium text-gray-700 mb-6">💬 Peer Support Forum</h2>

        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <input className="border rounded-lg p-3 w-full mb-3" placeholder="Post title..."
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea className="border rounded-lg p-3 w-full mb-3" rows={3} placeholder="Share your thoughts..."
            value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          <select className="border rounded-lg p-3 w-full mb-3"
            value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="general">General</option>
            <option value="stress">Stress</option>
            <option value="motivation">Motivation</option>
            <option value="study-tips">Study Tips</option>
          </select>
          <button onClick={submit}
            className="bg-purple-600 text-white w-full py-3 rounded-lg hover:bg-purple-700">
            Post
          </button>
        </div>

        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className="bg-white rounded-xl p-6 shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800">{post.title}</h3>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>by {post.userId?.name || 'Anonymous'}</span>
                <button onClick={() => like(post._id)}
                  className="flex items-center gap-1 hover:text-purple-600">
                  ❤️ {post.likes?.length || 0}
                </button>
                <span>💬 {post.comments?.length || 0} comments</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}