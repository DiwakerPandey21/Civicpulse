const Alert = require('../models/Alert');

// @desc    Create a new alert
// @route   POST /api/alerts
// @access  Private/Admin
const createAlert = async (req, res) => {
    try {
        const { title, message, type, durationHours } = req.body;

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + (durationHours || 24));

        const alert = await Alert.create({
            title,
            message,
            type,
            expiresAt,
            createdBy: req.user._id,
        });

        res.status(201).json(alert);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all active alerts
// @route   GET /api/alerts
// @access  Public
const getActiveAlerts = async (req, res) => {
    try {
        const now = new Date();
        const alerts = await Alert.find({
            isActive: true,
            expiresAt: { $gt: now }
        }).sort({ createdAt: -1 });

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAlert,
    getActiveAlerts,
};
