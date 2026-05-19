// routes/complaintRoutes.js
const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchComplaints,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const { complaintValidation, statusValidation } = require('../middleware/validationMiddleware');

// IMPORTANT: /search must come before /:id
router.get('/search', protect, searchComplaints);

router.route('/')
  .post(protect, complaintValidation, createComplaint)
  .get(protect, getAllComplaints);

router.route('/:id')
  .get(protect, getComplaintById)
  .put(protect, updateComplaint)
  .delete(protect, deleteComplaint);

module.exports = router;
