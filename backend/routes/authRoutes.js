// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { signupValidation, loginValidation } = require('../middleware/validationMiddleware');

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/profile', protect, getProfile);

module.exports = router;
