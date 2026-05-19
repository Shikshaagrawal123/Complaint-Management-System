// pages/ComplaintListPage.jsx - List with search & filter
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import toast from 'react-hot-toast';

const CATEGORIES = ['', 'Water', 'Electricity', 'Garbage', 'Roads', 'Sanitation', 'Noise', 'Other'];
const STATUSES = ['', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

const ComplaintListPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ category: '', status: '', location: '' });
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    if (filters.location) {
      handleSearch();
    } else {
      fetchComplaints();
    }
  }, [filters.category, filters.status, pagination.page]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: 8,
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
      });
      const { data } = await api.get(`/complaints?${params}`);
      setComplaints(data.complaints);
      setPagination((p) => ({ ...p, totalPages: data.totalPages, total: data.total }));
      setSearchMode(false);
    } catch (err) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!filters.location.trim()) return fetchComplaints();
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(filters.location && { location: filters.location }),
        ...(filters.category && { category: filters.category }),
        ...(filters.status && { status: filters.status }),
      });
      const { data } = await api.get(`/complaints/search?${params}`);
      setComplaints(data.complaints);
      setPagination({ page: 1, totalPages: 1, total: data.count });
      setSearchMode(true);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      toast.success('Complaint deleted');
      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((p) => ({ ...p, [key]: value }));
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearFilters = () => {
    setFilters({ category: '', status: '', location: '' });
    setPagination((p) => ({ ...p, page: 1 }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {pagination.total} complaint{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link to="/complaints/new" className="btn-primary">+ New Complaint</Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="card mb-6">
        <div className="grid md:grid-cols-4 gap-3">
          {/* Location Search */}
          <div className="md:col-span-2 relative">
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="🔍 Search by location (e.g., Ghaziabad)"
              className="input-field pr-20"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="input-field"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c || 'All Categories'}</option>)}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input-field"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
          </select>
        </div>

        {(filters.category || filters.status || filters.location) && (
          <button onClick={clearFilters} className="mt-3 text-xs text-blue-600 hover:underline">
            ✕ Clear all filters
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <LoadingSpinner />
      ) : complaints.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-500 text-lg">No complaints found</p>
          <Link to="/complaints/new" className="btn-primary mt-4 inline-block">Submit First Complaint</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c._id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Link to={`/complaints/${c._id}`} className="font-semibold text-gray-900 hover:text-blue-600">
                        {c.title}
                      </Link>
                      <StatusBadge status={c.status} />
                      {c.aiAnalysis?.priority && (
                        <span className={`badge-${c.aiAnalysis.priority.toLowerCase()} text-xs px-2 py-0.5 rounded-full`}>
                          {c.aiAnalysis.priority} Priority
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{c.description}</p>
                    <div className="flex gap-3 mt-1 text-xs text-gray-400">
                      <span>📂 {c.category}</span>
                      <span>📍 {c.location}</span>
                      <span>🕐 {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <Link to={`/complaints/${c._id}`} className="btn-secondary text-xs py-1.5">View</Link>
                    <Link to={`/complaints/${c._id}/edit`} className="btn-secondary text-xs py-1.5">Edit</Link>
                    <button onClick={() => handleDelete(c._id)} className="btn-danger text-xs py-1.5">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {!searchMode && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="btn-secondary text-sm disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="btn-secondary text-sm disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ComplaintListPage;
