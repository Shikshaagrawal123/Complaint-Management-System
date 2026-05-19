// routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { analyzeComplaint, quickAnalyze } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/analyze', protect, analyzeComplaint);
router.post('/quick-analyze', protect, quickAnalyze);

module.exports = router;
