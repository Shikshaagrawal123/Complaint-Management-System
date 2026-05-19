// pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/complaints?limit=5');
      const all = data.complaints;

      setStats({
        total: data.total,
        pending: all.filter((c) => c.status === 'Pending').length,
        inProgress: all.filter((c) => c.status === 'In Progress').length,
        resolved: all.filter((c) => c.status === 'Resolved').length,
      });
      setRecentComplaints(all.slice(0, 5));
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const StatCard = ({ icon, label, value, color }) => (
    <div className="card flex items-center gap-4">
      <div className={`text-3xl p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's an overview of your complaints</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📋" label="Total Complaints" value={stats.total} color="bg-blue-50" />
        <StatCard icon="⏳" label="Pending" value={stats.pending} color="bg-yellow-50" />
        <StatCard icon="🔄" label="In Progress" value={stats.inProgress} color="bg-blue-50" />
        <StatCard icon="✅" label="Resolved" value={stats.resolved} color="bg-green-50" />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <h3 className="text-lg font-semibold mb-2">Submit New Complaint</h3>
          <p className="text-blue-100 text-sm mb-4">Report an issue in your area quickly</p>
          <Link to="/complaints/new" className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors inline-block">
            + New Complaint
          </Link>
        </div>
        <div className="card bg-gradient-to-br from-purple-600 to-pink-600 text-white">
          <h3 className="text-lg font-semibold mb-2">View All Complaints</h3>
          <p className="text-purple-100 text-sm mb-4">Track status and AI analysis</p>
          <Link to="/complaints" className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors inline-block">
            View Complaints →
          </Link>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
          <Link to="/complaints" className="text-blue-600 text-sm hover:underline">View all →</Link>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500">No complaints yet.</p>
            <Link to="/complaints/new" className="btn-primary mt-4 inline-block">Submit First Complaint</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentComplaints.map((c) => (
              <div key={c._id} className="py-3 flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <Link to={`/complaints/${c._id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block">
                    {c.title}
                  </Link>
                  <p className="text-xs text-gray-400">{c.category} • {c.location}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
