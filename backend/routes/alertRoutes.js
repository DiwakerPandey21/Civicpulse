const express = require('express');
const router = express.Router();
const { createAlert, getActiveAlerts } = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').post(protect, authorize('admin'), createAlert).get(getActiveAlerts);

module.exports = router;
