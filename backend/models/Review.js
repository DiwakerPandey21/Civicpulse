const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        toilet: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Toilet',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent user from submitting multiple reviews for same toilet
reviewSchema.index({ toilet: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function (toiletId) {
    const obj = await this.aggregate([
        {
            $match: { toilet: toiletId },
        },
        {
            $group: {
                _id: '$toilet',
                averageRating: { $avg: '$rating' },
                numReviews: { $sum: 1 },
            },
        },
    ]);

    try {
        await this.model('Toilet').findByIdAndUpdate(toiletId, {
            averageRating: obj[0]?.averageRating || 0,
            numReviews: obj[0]?.numReviews || 0,
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.toilet);
});

// Call getAverageRating before remove (if we implement delete review)
// reviewSchema.pre('remove', function () {
//     this.constructor.getAverageRating(this.toilet);
// });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
