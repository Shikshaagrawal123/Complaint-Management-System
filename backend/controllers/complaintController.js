// controllers/complaintController.js - Full CRUD for complaints
const Complaint = require('../models/Complaint');

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res, next) => {
  try {
    const { name, email, title, description, category, location } = req.body;

    const complaint = await Complaint.create({
      user: req.user._id,
      name,
      email,
      title,
      description,
      category,
      location,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (with optional filters)
// @route   GET /api/complaints
// @access  Private
const getAllComplaints = async (req, res, next) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    const filter = {};

    // Non-admins see only their own complaints
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: complaints.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Allow owner or admin
    if (
      complaint.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint (status update)
// @route   PUT /api/complaints/:id
// @access  Private
const updateComplaint = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Only owner or admin can update
    if (
      complaint.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const allowedFields = ['status', 'title', 'description', 'category', 'location'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully.',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    if (
      complaint.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search complaints by location
// @route   GET /api/complaints/search?location=Ghaziabad
// @access  Private
const searchComplaints = async (req, res, next) => {
  try {
    const { location, category, status } = req.query;
    const filter = {};

    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (category) filter.category = category;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchComplaints,
};
