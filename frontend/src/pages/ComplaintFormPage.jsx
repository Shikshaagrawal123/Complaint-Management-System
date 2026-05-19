// pages/ComplaintFormPage.jsx - Register new complaint
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Water', 'Electricity', 'Garbage', 'Roads', 'Sanitation', 'Noise', 'Other'];

const ComplaintFormPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: '',
    description: '',
    category: '',
    location: '',
  });

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid email required';
    if (!formData.title.trim() || formData.title.length < 5) errs.title = 'Title must be at least 5 characters';
    if (!formData.description.trim() || formData.description.length < 10) errs.description = 'Description must be at least 10 characters';
    if (!formData.category) errs.category = 'Category is required';
    if (!formData.location.trim()) errs.location = 'Location is required';
    return errs;
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      const { data } = await api.post('/complaints', formData);
      toast.success('Complaint submitted successfully! 🎉');
      navigate(`/complaints/${data.complaint._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder, required = true, children }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`input-field ${errors[name] ? 'border-red-400' : ''}`}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Submit a Complaint</h1>
        <p className="text-gray-500 mt-1">Report an issue and we'll route it to the right department</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Full Name" name="name" placeholder="Your full name" />
            <Field label="Email" name="email" type="email" placeholder="your@email.com" />
          </div>

          <Field label="Complaint Title" name="title" placeholder="Brief title of the issue (min. 5 chars)" />

          <Field label="Description" name="description">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Describe the issue in detail (min. 10 characters)..."
              className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Category" name="category">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input-field ${errors.category ? 'border-red-400' : ''}`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </Field>

            <Field label="Location" name="location" placeholder="e.g., Ghaziabad, Sector 5" />
          </div>

          {/* Category hint */}
          {formData.category && (
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
              💡 <strong>{formData.category}</strong> complaints are analyzed by our AI for priority and department routing.
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Submitting...
                </span>
              ) : '📤 Submit Complaint'}
            </button>
            <button type="button" onClick={() => navigate('/complaints')} className="btn-secondary px-6">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintFormPage;
