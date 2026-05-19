// pages/ComplaintEditPage.jsx - Update complaint & status
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['Water', 'Electricity', 'Garbage', 'Roads', 'Sanitation', 'Noise', 'Other'];
const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const ComplaintEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', location: '', status: 'Pending',
  });

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data } = await api.get(`/complaints/${id}`);
      const c = data.complaint;
      setFormData({
        title: c.title,
        description: c.description,
        category: c.category,
        location: c.location,
        status: c.status,
      });
    } catch (err) {
      toast.error('Could not load complaint');
      navigate('/complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.title.length < 5) {
      return toast.error('Title must be at least 5 characters');
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      return toast.error('Description must be at least 10 characters');
    }

    setSaving(true);
    try {
      await api.put(`/complaints/${id}`, formData);
      toast.success('Complaint updated successfully! ✅');
      navigate(`/complaints/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading..." />;

  const statusColors = {
    Pending: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    'In Progress': 'text-blue-700 bg-blue-50 border-blue-200',
    Resolved: 'text-green-700 bg-green-50 border-green-200',
    Rejected: 'text-red-700 bg-red-50 border-red-200',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/complaints" className="hover:text-blue-600">Complaints</Link>
        <span className="mx-2">/</span>
        <Link to={`/complaints/${id}`} className="hover:text-blue-600">Detail</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Edit</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Complaint</h1>
        <p className="text-gray-500 mt-1">Update complaint details or change status</p>
      </div>

      {/* Status Update - Highlighted */}
      <div className={`rounded-xl border p-5 mb-6 ${statusColors[formData.status]}`}>
        <h3 className="font-semibold mb-3">📊 Complaint Status</h3>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFormData((p) => ({ ...p, status: s }))}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                formData.status === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className="input-field resize-none" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
            <Link to={`/complaints/${id}`} className="btn-secondary px-6 py-3 text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintEditPage;
