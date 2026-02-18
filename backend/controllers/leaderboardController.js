const User = require('../models/User');

// @desc    Get top users by points
// @route   GET /api/leaderboard
// @access  Public (or Private)
const getLeaderboard = async (req, res) => {
    try {
        // Fetch top 10 users, sorted by points descending
        // Select only necessary fields to protect privacy
        const leaders = await User.find({ role: 'citizen' }) // Only citizens on leaderboard?
            .sort({ points: -1 })
            .limit(10)
            .select('name points badges');

        res.json(leaders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLeaderboard };
