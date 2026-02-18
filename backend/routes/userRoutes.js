const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');
const User = require('../models/User');

// @desc    Get all officials
// @route   GET /api/users/officials
// @access  Private (Admin)
router.get('/officials', protect, roleCheck(['admin']), async (req, res) => {
    try {
        const officials = await User.find({ role: 'official' });
        res.json(officials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
