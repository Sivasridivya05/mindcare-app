import Navbar from '../components/Navbar';
import MoodTracker from '../components/MoodTracker';
import MoodChart from '../components/MoodChart';
import StressMonitor from '../components/StressMonitor';
import SleepStudyCard from '../components/SleepStudyCard';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-medium text-gray-700 mb-6">Your Well-Being Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoodTracker />
          <StressMonitor />
          <SleepStudyCard />
          <MoodChart />
        </div>
      </div>
    </div>
  );
}