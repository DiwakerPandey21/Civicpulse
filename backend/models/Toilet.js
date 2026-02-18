const mongoose = require('mongoose');

const toiletSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a toilet name'],
            trim: true,
        },
        address: {
            type: String,
            required: [true, 'Please add a location address'],
        },
        location: {
            // GeoJSON Point
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: '2dsphere', // Important for geospatial queries
            },
        },
        facilities: {
            type: [String],
            enum: ['Western', 'Indian', 'Handwash', 'Disabled Access', 'Baby Care'],
            default: ['Indian', 'Handwash'],
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['Operational', 'Maintenance', 'Closed'],
            default: 'Operational',
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create geospatial index
toiletSchema.index({ location: '2dsphere' });

const Toilet = mongoose.model('Toilet', toiletSchema);

module.exports = Toilet;
