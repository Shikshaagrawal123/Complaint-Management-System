// pages/ComplaintDetailPage.jsx - View + AI analysis
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { PriorityBadge } from '../components/StatusBadge';
import toast from 'react-hot-toast';

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data.complaint);
    } catch (err) {
      toast.error('Complaint not found');
      navigate('/complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleAiAnalyze = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/analyze', { complaintId: id });
      setComplaint((prev) => ({ ...prev, aiAnalysis: data.analysis }));
      toast.success('AI analysis complete! 🤖');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI analysis failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      toast.success('Complaint deleted');
      navigate('/complaints');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (loading) return <LoadingSpinner message="Loading complaint..." />;
  if (!complaint) return null;

  const hasAI = complaint.aiAnalysis?.priority;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/complaints" className="hover:text-blue-600">Complaints</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Detail</span>
      </nav>

      {/* Main Card */}
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">{complaint.title}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={complaint.status} />
              <span className="text-xs text-gray-400">📂 {complaint.category}</span>
              <span className="text-xs text-gray-400">📍 {complaint.location}</span>
              <span className="text-xs text-gray-400">
                🕐 {new Date(complaint.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to={`/complaints/${id}/edit`} className="btn-secondary text-sm">Edit</Link>
            <button onClick={handleDelete} className="btn-danger text-sm">Delete</button>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Submitted by:</span>
            <p className="font-medium">{complaint.name}</p>
            <p className="text-gray-400">{complaint.email}</p>
          </div>
          <div>
            <span className="text-gray-500">Last updated:</span>
            <p className="font-medium">{new Date(complaint.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">🤖 AI Analysis</h2>
          <button
            onClick={handleAiAnalyze}
            disabled={aiLoading}
            className="btn-primary text-sm py-1.5"
          >
            {aiLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                Analyzing...
              </span>
            ) : hasAI ? '🔄 Re-analyze' : '✨ Analyze with AI'}
          </button>
        </div>

        {hasAI ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Priority Level</p>
                <PriorityBadge priority={complaint.aiAnalysis.priority} />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Assigned Department</p>
                <p className="font-semibold text-sm text-gray-900">{complaint.aiAnalysis.department}</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-xs font-medium text-blue-600 mb-1">AI Summary</p>
              <p className="text-sm text-gray-700">{complaint.aiAnalysis.summary}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-xs font-medium text-green-600 mb-1">📨 Auto-generated Response to Citizen</p>
              <p className="text-sm text-gray-700 italic">"{complaint.aiAnalysis.userResponse}"</p>
            </div>

            {complaint.aiAnalysis.analyzedAt && (
              <p className="text-xs text-gray-400 text-right">
                Analyzed: {new Date(complaint.aiAnalysis.analyzedAt).toLocaleString()}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">🤖</p>
            <p className="text-gray-500 text-sm">Click "Analyze with AI" to get:</p>
            <ul className="text-sm text-gray-400 mt-2 space-y-1">
              <li>• Priority Detection (High / Medium / Low)</li>
              <li>• Department Routing</li>
              <li>• Complaint Summary</li>
              <li>• Auto-generated Citizen Response</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintDetailPage;
