import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="bg-purple-700 text-white px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className="text-xl">🧠</span>
        <h1 className="text-lg font-medium">MindCare</h1>
      </div>
      <div className="flex gap-6 items-center">
        {user?.role === 'student' && (
          <>
            <Link to="/dashboard" className="hover:text-purple-200 text-sm">Dashboard</Link>
            <Link to="/book-session" className="hover:text-purple-200 text-sm">Book Session</Link>
            <Link to="/meditation" className="hover:text-purple-200 text-sm">Meditation</Link>
            <Link to="/library" className="hover:text-purple-200 text-sm">Library</Link>
          </>
        )}
        {user?.role === 'therapist' && (
          <Link to="/therapist" className="hover:text-purple-200 text-sm">Dashboard</Link>
        )}
        <span className="text-purple-300 text-sm">{user?.name}</span>
        <button onClick={handleLogout}
          className="bg-purple-500 px-3 py-1 rounded-lg hover:bg-purple-400 text-sm">
          Logout
        </button>
      </div>
    </nav>
  );
}