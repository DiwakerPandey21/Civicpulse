const express = require('express');
const router = express.Router();
const { getDashboardStats, getCategoryBreakdown, getComplaintTrends } = require('../controllers/analyticsController');
const { analyzeText } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, getDashboardStats);
router.get('/categories', protect, getCategoryBreakdown);
router.get('/trends', protect, getComplaintTrends);
router.post('/ai-triage', protect, analyzeText);

module.exports = router;
