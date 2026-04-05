import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import BookSession from './pages/BookSession';
import MeditationTimer from './pages/MeditationTimer';
import ContentLibrary from './pages/ContentLibrary';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'therapist') return <Navigate to="/therapist" />;
    return <Navigate to="/dashboard" />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
          <Route path="/therapist" element={<PrivateRoute role="therapist"><TherapistDashboard /></PrivateRoute>} />
          <Route path="/book-session" element={<PrivateRoute role="student"><BookSession /></PrivateRoute>} />
          <Route path="/meditation" element={<PrivateRoute role="student"><MeditationTimer /></PrivateRoute>} />
          <Route path="/library" element={<PrivateRoute role="student"><ContentLibrary /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}