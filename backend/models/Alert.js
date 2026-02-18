const mongoose = require('mongoose');

const alertSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['Info', 'Warning', 'Critical', 'Success'],
            default: 'Info',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(+new Date() + 24 * 60 * 60 * 1000), // Default 24 hours
        },
    },
    {
        timestamps: true,
    }
);

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
