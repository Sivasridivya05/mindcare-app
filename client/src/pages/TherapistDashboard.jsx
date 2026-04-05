import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const statusStyle = (s) =>
  s === 'accepted' ? 'bg-green-100 text-green-700' :
  s === 'declined' ? 'bg-red-100 text-red-700' :
  'bg-yellow-100 text-yellow-700';

const statusIcon = (s) =>
  s === 'accepted' ? '✅' :
  s === 'declined' ? '❌' : '⏳';

const moodBadge = (v) =>
  v >= 7 ? 'bg-green-100 text-green-700' :
  v >= 5 ? 'bg-yellow-100 text-yellow-700' :
  'bg-red-100 text-red-700';

const stressBadge = (v) =>
  v >= 7 ? 'bg-red-100 text-red-700' :
  v >= 5 ? 'bg-yellow-100 text-yellow-700' :
  'bg-green-100 text-green-700';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function TherapistDashboard() {
  const [students, setStudents] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentMoods, setStudentMoods] = useState([]);
  const [notes, setNotes] = useState({});
  const [newNote, setNewNote] = useState('');
  const [calMonth, setCalMonth] = useState(new Date());
  const [availSaved, setAvailSaved] = useState(false);
  const [availability, setAvailability] = useState({
    Mon: { enabled: true,  from: '09:00', to: '17:00' },
    Tue: { enabled: true,  from: '09:00', to: '17:00' },
    Wed: { enabled: false, from: '09:00', to: '17:00' },
    Thu: { enabled: true,  from: '09:00', to: '17:00' },
    Fri: { enabled: true,  from: '09:00', to: '15:00' },
    Sat: { enabled: false, from: '09:00', to: '12:00' },
    Sun: { enabled: false, from: '09:00', to: '12:00' },
  });

  useEffect(() => {
    api.get('/therapist/students').then(r => setStudents(r.data)).catch(() => {});
    api.get('/therapist/flagged').then(r => setFlagged(r.data)).catch(() => {});
    api.get('/sessions/all').then(r => setSessions(r.data)).catch(() => {});
  }, []);

  const loadStudentProfile = async (student) => {
    setSelectedStudent(student);
    setActiveTab('profiles');
    try {
      const res = await api.get(`/therapist/student/${student._id}/moods`);
      setStudentMoods(res.data);
    } catch { setStudentMoods([]); }
  };

  const updateSession = async (id, status) => {
    await api.put(`/sessions/${id}/status`, { status });
    api.get('/sessions/all').then(r => setSessions(r.data));
  };

  const saveNote = (studentId) => {
    if (!newNote.trim()) return;
    setNotes(prev => ({
      ...prev,
      [studentId]: [...(prev[studentId] || []), {
        text: newNote, date: new Date().toLocaleDateString()
      }]
    }));
    setNewNote('');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('MindCare — Weekly Well-Being Report', 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    autoTable(doc, {
      startY: 40,
      head: [['Student', 'Email', 'Stress Alerts']],
      body: students.map(s => [s.name, s.email,
        flagged.filter(f => f.userId?._id === s._id).length]),
    });
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [['#', 'Student', 'Date', 'Time', 'Status']],
      body: sessions.map((s, i) => [
        i + 1, s.studentId?.name || 'Unknown',
        s.date, s.time, s.status
      ]),
    });
    doc.save('mindcare-report.pdf');
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const getSessionsForDay = (day) => {
    const year = calMonth.getFullYear();
    const month = String(calMonth.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${year}-${month}-${d}`;
    return sessions.filter(s => s.date === dateStr && s.status === 'accepted');
  };

  const { firstDay, daysInMonth } = getDaysInMonth(calMonth);

  const tabs = [
    { id: 'overview',     label: '📊 Overview' },
    { id: 'sessions',     label: '📅 Sessions' },
    { id: 'calendar',     label: '🗓️ Calendar' },
    { id: 'profiles',     label: '👤 Students' },
    { id: 'availability', label: '⏰ Availability' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-2xl p-6 mb-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-medium mb-1">Therapist Dashboard 👨‍⚕️</h2>
            <p className="text-teal-100 text-sm">
              Monitor, support and manage your students
            </p>
          </div>
          <button onClick={exportPDF}
            className="bg-white text-teal-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-teal-50 shadow">
            📄 Export PDF Report
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Students', value: students.length, color: 'text-teal-600', bg: 'bg-teal-50', icon: '👥' },
            { label: 'Pending Sessions', value: sessions.filter(s => s.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '⏳' },
            { label: 'High Stress Alerts', value: flagged.length, color: 'text-red-500', bg: 'bg-red-50', icon: '⚠️' },
            { label: 'Confirmed Sessions', value: sessions.filter(s => s.status === 'accepted').length, color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-5 shadow text-center`}>
              <p className="text-3xl mb-1">{s.icon}</p>
              <p className={`text-4xl font-medium ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === t.id
                  ? 'bg-teal-600 text-white shadow'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* All Students */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-medium text-gray-700 mb-1">👥 All Students</h3>
              <p className="text-xs text-gray-400 mb-4">
                Click any student to view their submitted data
              </p>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.map(s => (
                  <div key={s._id}
                    onClick={() => loadStudentProfile(s)}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-teal-50 cursor-pointer transition-all border hover:border-teal-200">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center font-medium text-teal-700">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {flagged.some(f => f.userId?._id === s._id) && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          ⚠️ High Stress
                        </span>
                      )}
                      <span className="text-xs text-teal-500 font-medium">View →</span>
                    </div>
                  </div>
                ))}
                {students.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">
                    No students registered yet.
                  </p>
                )}
              </div>
            </div>

            {/* High Stress Alerts */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-medium text-gray-700 mb-1">🚨 High Stress Alerts</h3>
              <p className="text-xs text-gray-400 mb-4">
                Students who reported stress ≥ 8 in the last 3 days
              </p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {flagged.map((log, i) => (
                  <div key={i} className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center font-medium text-red-700 text-sm">
                          {log.userId?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-red-800 text-sm">
                            {log.userId?.name}
                          </p>
                          <p className="text-xs text-red-400">{log.userId?.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(log.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">Mood</p>
                        <p className={`text-sm font-medium ${
                          log.mood >= 7 ? 'text-green-600' :
                          log.mood >= 5 ? 'text-yellow-600' : 'text-red-600'
                        }`}>{log.mood}/10</p>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">Stress</p>
                        <p className="text-sm font-medium text-red-600">
                          {log.stressLevel}/10
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">Sleep</p>
                        <p className="text-sm font-medium text-blue-600">
                          {log.sleepHours}h
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-400">Study</p>
                        <p className="text-sm font-medium text-teal-600">
                          {log.studyHours}h
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {flagged.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-4xl mb-2">✅</p>
                    <p className="text-sm text-gray-500 font-medium">All students are doing well!</p>
                    <p className="text-xs text-gray-400 mt-1">No high stress alerts right now</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── SESSIONS TAB ── */}
        {activeTab === 'sessions' && (
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium text-gray-700">📅 All Sessions</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Accept or decline session requests from students
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                  ⏳ {sessions.filter(s => s.status === 'pending').length} Pending
                </span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  ✅ {sessions.filter(s => s.status === 'accepted').length} Accepted
                </span>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  ❌ {sessions.filter(s => s.status === 'declined').length} Declined
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {sessions.map(s => (
                <div key={s._id}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    s.status === 'pending'
                      ? 'border-yellow-200 bg-yellow-50'
                      : s.status === 'accepted'
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-70'
                  }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-medium text-teal-700 border border-teal-200 shadow-sm">
                        {s.studentId?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {s.studentId?.name || 'Unknown Student'}
                        </p>
                        <p className="text-xs text-gray-400">{s.studentId?.email}</p>
                        <div className="flex gap-3 mt-1.5 text-xs text-gray-600">
                          <span>📅 {s.date}</span>
                          <span>🕐 {s.time}</span>
                        </div>
                        {s.reason && (
                          <p className="text-xs text-gray-500 mt-1">
                            Reason: {s.reason}
                          </p>
                        )}
                        {s.feedback && (
                          <p className="text-xs text-teal-600 mt-1 italic">
                            💬 "{s.feedback}"
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${statusStyle(s.status)}`}>
                      {statusIcon(s.status)} {s.status}
                    </span>
                  </div>
                  {s.status === 'pending' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-yellow-200">
                      <button onClick={() => updateSession(s._id, 'accepted')}
                        className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm hover:bg-green-600 font-medium">
                        ✅ Accept Session
                      </button>
                      <button onClick={() => updateSession(s._id, 'declined')}
                        className="flex-1 bg-red-500 text-white py-2 rounded-xl text-sm hover:bg-red-600 font-medium">
                        ❌ Decline Session
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-gray-500 font-medium">No sessions booked yet</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Students can book sessions from their dashboard
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CALENDAR TAB ── */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-medium text-gray-700">
                  {MONTHS[calMonth.getMonth()]} {calMonth.getFullYear()}
                </h3>
                <p className="text-xs text-gray-400">Confirmed sessions shown on dates</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1))}
                  className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">←</button>
                <button onClick={() => setCalMonth(new Date())}
                  className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 text-teal-600 font-medium">
                  Today
                </button>
                <button
                  onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1))}
                  className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50">→</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array(firstDay).fill(null).map((_, i) => (
                <div key={`e-${i}`} className="h-20 rounded-xl" />
              ))}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1;
                const daySessions = getSessionsForDay(day);
                const isToday =
                  new Date().getDate() === day &&
                  new Date().getMonth() === calMonth.getMonth() &&
                  new Date().getFullYear() === calMonth.getFullYear();
                return (
                  <div key={day}
                    className={`h-20 rounded-xl border p-1.5 ${
                      isToday
                        ? 'border-teal-400 bg-teal-50'
                        : daySessions.length > 0
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}>
                    <p className={`text-xs font-medium mb-1 ${
                      isToday ? 'text-teal-600' :
                      daySessions.length > 0 ? 'text-green-600' : 'text-gray-500'
                    }`}>{day}</p>
                    {daySessions.slice(0, 2).map((s, idx) => (
                      <div key={idx}
                        className="bg-teal-100 text-teal-700 rounded px-1 py-0.5 truncate text-xs mb-0.5">
                        {s.studentId?.name?.split(' ')[0]} {s.time}
                      </div>
                    ))}
                    {daySessions.length > 2 && (
                      <p className="text-gray-400 text-xs">+{daySessions.length - 2} more</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 mt-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-teal-200 inline-block"></span>
                Today
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-green-200 inline-block"></span>
                Has sessions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gray-100 border inline-block"></span>
                No sessions
              </span>
            </div>
          </div>
        )}

        {/* ── STUDENT PROFILES TAB ── */}
        {activeTab === 'profiles' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Student List */}
            <div className="bg-white rounded-2xl p-4 shadow">
              <h3 className="font-medium text-gray-700 mb-1 text-sm">Select Student</h3>
              <p className="text-xs text-gray-400 mb-3">
                View exact data submitted by each student
              </p>
              <div className="space-y-2">
                {students.map(s => (
                  <button key={s._id} onClick={() => loadStudentProfile(s)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-all ${
                      selectedStudent?._id === s._id
                        ? 'bg-teal-100 border-2 border-teal-400'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        selectedStudent?._id === s._id
                          ? 'bg-teal-600 text-white'
                          : 'bg-teal-100 text-teal-700'
                      }`}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </div>
                    </div>
                    {flagged.some(f => f.userId?._id === s._id) && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full mt-2 inline-block">
                        ⚠️ High Stress Alert
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Data */}
            {selectedStudent ? (
              <div className="md:col-span-2 space-y-4">

                {/* Student Header */}
                <div className="bg-white rounded-2xl p-5 shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center text-2xl font-medium text-teal-700">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {selectedStudent.name}
                      </h3>
                      <p className="text-sm text-gray-400">{selectedStudent.email}</p>
                      <p className="text-xs text-teal-600 mt-0.5">
                        {studentMoods.length} mood logs submitted
                      </p>
                    </div>
                    {flagged.some(f => f.userId?._id === selectedStudent._id) && (
                      <div className="ml-auto bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-center">
                        <p className="text-red-600 font-medium text-sm">⚠️ High Stress</p>
                        <p className="text-red-400 text-xs">Needs attention</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary row */}
                {studentMoods.length > 0 && (
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      {
                        label: 'Avg Mood', icon: '😊',
                        value: (studentMoods.reduce((a,b) => a+b.mood,0)/studentMoods.length).toFixed(1) + '/10',
                        color: 'bg-purple-50 text-purple-600 border-purple-100'
                      },
                      {
                        label: 'Avg Stress', icon: '😰',
                        value: (studentMoods.reduce((a,b) => a+b.stressLevel,0)/studentMoods.length).toFixed(1) + '/10',
                        color: 'bg-red-50 text-red-500 border-red-100'
                      },
                      {
                        label: 'Avg Sleep', icon: '😴',
                        value: (studentMoods.reduce((a,b) => a+(b.sleepHours||0),0)/studentMoods.length).toFixed(1) + 'h',
                        color: 'bg-blue-50 text-blue-600 border-blue-100'
                      },
                      {
                        label: 'Avg Study', icon: '📚',
                        value: (studentMoods.reduce((a,b) => a+(b.studyHours||0),0)/studentMoods.length).toFixed(1) + 'h',
                        color: 'bg-green-50 text-green-600 border-green-100'
                      },
                    ].map((c, i) => (
                      <div key={i} className={`${c.color} rounded-xl p-3 text-center border`}>
                        <p className="text-xl mb-1">{c.icon}</p>
                        <p className="text-lg font-medium">{c.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Exact Data Table */}
                <div className="bg-white rounded-2xl p-5 shadow">
                  <h3 className="font-medium text-gray-700 mb-1">
                    📋 Submitted Mood Logs
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Exact data entered by {selectedStudent.name} from their daily assessment
                  </p>

                  {studentMoods.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                            <th className="text-left p-3 rounded-l-xl">Date</th>
                            <th className="text-center p-3">😊 Mood</th>
                            <th className="text-center p-3">😰 Stress</th>
                            <th className="text-center p-3">😴 Sleep</th>
                            <th className="text-center p-3">📚 Study</th>
                            <th className="text-left p-3 rounded-r-xl">Notes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {studentMoods.map((log, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="p-3 text-xs text-gray-500">
                                {new Date(log.date).toLocaleDateString('en', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                                })}
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${moodBadge(log.mood)}`}>
                                  {log.mood}/10
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${stressBadge(log.stressLevel)}`}>
                                  {log.stressLevel}/10
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                  log.sleepHours >= 7
                                    ? 'bg-green-100 text-green-700'
                                    : log.sleepHours >= 5
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {log.sleepHours || '–'}h
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                                  {log.studyHours || '–'}h
                                </span>
                              </td>
                              <td className="p-3 text-xs text-gray-400 max-w-32 truncate">
                                {log.notes || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-3xl mb-2">📭</p>
                      <p className="text-sm text-gray-500">No mood logs yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {selectedStudent.name} hasn't submitted any assessments yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Private Notes */}
                <div className="bg-white rounded-2xl p-5 shadow">
                  <h3 className="font-medium text-gray-700 mb-1">
                    📝 My Private Notes
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Only visible to you — not shown to the student
                  </p>
                  <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
                    {(notes[selectedStudent._id] || []).map((note, i) => (
                      <div key={i} className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex justify-between items-start">
                        <p className="text-sm text-gray-700">{note.text}</p>
                        <p className="text-xs text-gray-400 ml-3 flex-shrink-0">{note.date}</p>
                      </div>
                    ))}
                    {!(notes[selectedStudent._id]?.length) && (
                      <p className="text-sm text-gray-400 italic">
                        No notes yet. Add your observations below.
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && saveNote(selectedStudent._id)}
                      placeholder="Write your clinical observation..."
                      className="flex-1 border rounded-xl p-2.5 text-sm focus:outline-none focus:border-teal-400" />
                    <button onClick={() => saveNote(selectedStudent._id)}
                      className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm hover:bg-teal-700 font-medium">
                      Save
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="md:col-span-2 bg-white rounded-2xl shadow flex items-center justify-center min-h-64">
                <div className="text-center p-10">
                  <p className="text-5xl mb-4">👈</p>
                  <p className="text-gray-600 font-medium">Select a student</p>
                  <p className="text-gray-400 text-sm mt-1">
                    See their exact submitted mood, stress, sleep and study data
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AVAILABILITY TAB ── */}
        {activeTab === 'availability' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Set Availability */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-medium text-gray-700 mb-1">⏰ Set Your Availability</h3>
              <p className="text-sm text-gray-400 mb-5">
                Students will see these hours when booking a session
              </p>
              <div className="space-y-3">
                {Object.entries(availability).map(([day, val]) => (
                  <div key={day} className={`flex items-center gap-3 p-3 rounded-xl border ${
                    val.enabled
                      ? 'bg-teal-50 border-teal-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <label className="flex items-center gap-2 w-20 cursor-pointer">
                      <input type="checkbox" checked={val.enabled}
                        onChange={e => setAvailability(prev => ({
                          ...prev, [day]: { ...prev[day], enabled: e.target.checked }
                        }))}
                        className="accent-teal-600 w-4 h-4" />
                      <span className={`text-sm font-medium ${
                        val.enabled ? 'text-teal-700' : 'text-gray-400'
                      }`}>{day}</span>
                    </label>
                    {val.enabled ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input type="time" value={val.from}
                          onChange={e => setAvailability(prev => ({
                            ...prev, [day]: { ...prev[day], from: e.target.value }
                          }))}
                          className="border rounded-lg p-1.5 text-sm focus:outline-none focus:border-teal-400 flex-1" />
                        <span className="text-gray-400 text-sm">–</span>
                        <input type="time" value={val.to}
                          onChange={e => setAvailability(prev => ({
                            ...prev, [day]: { ...prev[day], to: e.target.value }
                          }))}
                          className="border rounded-lg p-1.5 text-sm focus:outline-none focus:border-teal-400 flex-1" />
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Unavailable</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => {
                    setAvailSaved(true);
                    setTimeout(() => setAvailSaved(false), 2000);
                  }}
                  className="flex-1 bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 font-medium">
                  {availSaved ? '✅ Saved!' : 'Save Availability'}
                </button>
                <button
                  onClick={() => setAvailability(Object.fromEntries(
                    Object.keys(availability).map(d => [
                      d, { enabled: true, from: '09:00', to: '17:00' }
                    ])
                  ))}
                  className="border border-gray-300 text-gray-600 px-5 py-3 rounded-xl hover:bg-gray-50 text-sm">
                  Reset
                </button>
              </div>
            </div>

            {/* Preview — what student sees */}
            <div className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-medium text-gray-700 mb-1">👁️ Student View Preview</h3>
              <p className="text-sm text-gray-400 mb-5">
                This is exactly what students see when booking a session
              </p>
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-medium">
                    Dr
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">Dr. Smith</p>
                    <p className="text-xs text-teal-600">Licensed Therapist</p>
                  </div>
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Available
                  </span>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Available Hours
                </p>
                <div className="space-y-1.5">
                  {Object.entries(availability).map(([day, val]) => (
                    <div key={day} className={`flex justify-between items-center p-2 rounded-lg text-sm ${
                      val.enabled ? 'bg-white' : 'bg-gray-100 opacity-50'
                    }`}>
                      <span className={`font-medium ${
                        val.enabled ? 'text-gray-700' : 'text-gray-400'
                      }`}>{day}</span>
                      <span className={`text-xs ${
                        val.enabled ? 'text-teal-600' : 'text-gray-400'
                      }`}>
                        {val.enabled ? `${val.from} – ${val.to}` : 'Unavailable'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}