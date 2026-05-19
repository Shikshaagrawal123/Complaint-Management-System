// models/Complaint.js - Complaint schema with all required fields
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Water',
        'Electricity',
        'Garbage',
        'Roads',
        'Sanitation',
        'Noise',
        'Other',
      ],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    aiAnalysis: {
      priority: { type: String, default: null },
      department: { type: String, default: null },
      summary: { type: String, default: null },
      userResponse: { type: String, default: null },
      analyzedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

// Index for location search
complaintSchema.index({ location: 'text', title: 'text', description: 'text' });

module.exports = mongoose.model('Complaint', complaintSchema);
