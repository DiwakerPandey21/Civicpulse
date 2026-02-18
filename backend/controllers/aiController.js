const { analyzeComplaint } = require('../utils/aiSystem');

// @desc    Analyze complaint text
// @route   POST /api/analytics/ai-triage
// @access  Public (or Private)
const analyzeText = (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ message: "Description required" });
    }

    const result = analyzeComplaint(description);

    // Simulate "thinking" time for AI feel
    setTimeout(() => {
        res.json(result);
    }, 800);
};

module.exports = { analyzeText };
