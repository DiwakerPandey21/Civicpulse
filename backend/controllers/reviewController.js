const Review = require('../models/Review');
const Toilet = require('../models/Toilet');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
    try {
        const { toiletId, rating, comment } = req.body;

        const toilet = await Toilet.findById(toiletId);

        if (!toilet) {
            res.status(404);
            throw new Error('Toilet not found');
        }

        // Check if user already reviewed
        const alreadyReviewed = await Review.findOne({
            user: req.user._id,
            toilet: toiletId
        });

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('You have already reviewed this toilet');
        }

        const review = await Review.create({
            user: req.user._id,
            toilet: toiletId,
            rating: Number(rating),
            comment,
        });

        // AWARD POINTS: +5 for rating a toilet
        await User.findByIdAndUpdate(req.user._id, { $inc: { points: 5 } });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get reviews for a toilet
// @route   GET /api/reviews/:toiletId
// @access  Public
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ toilet: req.params.toiletId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addReview, getReviews };
