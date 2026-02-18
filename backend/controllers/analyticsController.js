const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Toilet = require('../models/Toilet');

// @desc    Get Dashboard Statistics (High Level)
// @route   GET /api/analytics/dashboard
// @access  Private (Admin/Official)
const getDashboardStats = async (req, res) => {
    try {
        // Parallel execution for speed
        const [
            totalComplaints,
            resolvedComplaints,
            pendingComplaints,
            totalCitizens,
            totalOfficials,
            toilets
        ] = await Promise.all([
            Complaint.countDocuments(),
            Complaint.countDocuments({ status: 'Resolved' }),
            Complaint.countDocuments({ status: { $ne: 'Resolved' } }),
            User.countDocuments({ role: 'citizen' }),
            User.countDocuments({ role: 'official' }),
            Toilet.find({}, 'averageRating') // Fetch only avg rating to calculate global avg
        ]);

        // Calculate Global Average Toilet Rating
        const totalRating = toilets.reduce((acc, t) => acc + (t.averageRating || 0), 0);
        const avgToiletRating = toilets.length > 0 ? (totalRating / toilets.length).toFixed(1) : 0;

        res.json({
            complaints: {
                total: totalComplaints,
                resolved: resolvedComplaints,
                pending: pendingComplaints,
                resolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0
            },
            users: {
                citizens: totalCitizens,
                officials: totalOfficials
            },
            toilets: {
                count: toilets.length,
                averageRating: Number(avgToiletRating)
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Complaint Category Breakdown
// @route   GET /api/analytics/categories
// @access  Private
const getCategoryBreakdown = async (req, res) => {
    try {
        const breakdown = await Complaint.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } } // Highest first
        ]);

        // Format for Recharts: [{ name: 'Garbage', value: 10 }, ...]
        const formatted = breakdown.map(item => ({
            name: item._id,
            value: item.count
        }));

        res.json(formatted);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Complaint Trends (Last 7 Days)
// @route   GET /api/analytics/trends
// @access  Private
const getComplaintTrends = async (req, res) => {
    try {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 6);
        last7Days.setHours(0, 0, 0, 0);

        const trends = await Complaint.aggregate([
            {
                $match: {
                    createdAt: { $gte: last7Days }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Populate missing days with 0 (important for charts)
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const found = trends.find(t => t._id === dateStr);
            result.push({
                date: dateStr,
                complaints: found ? found.count : 0
            });
        }

        res.json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getCategoryBreakdown,
    getComplaintTrends
};
