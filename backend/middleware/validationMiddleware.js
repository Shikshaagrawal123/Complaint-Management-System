// middleware/validationMiddleware.js - express-validator rules
const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Auth validation rules
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors,
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Complaint validation rules
const complaintValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category')
    .isIn(['Water', 'Electricity', 'Garbage', 'Roads', 'Sanitation', 'Noise', 'Other'])
    .withMessage('Invalid category'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  handleValidationErrors,
];

const statusValidation = [
  body('status')
    .isIn(['Pending', 'In Progress', 'Resolved', 'Rejected'])
    .withMessage('Invalid status value'),
  handleValidationErrors,
];

module.exports = {
  signupValidation,
  loginValidation,
  complaintValidation,
  statusValidation,
};
