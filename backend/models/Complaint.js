const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: [
                'Traffic Violation', 'Pothole', 'Water Leak', 'Garbage', 'Street Light', // Old
                "Yellow Spot (Public Urination Spot)",
                "Overflow of Septic Tanks (New)",
                "Overflow of Sewerage or Storm Water",
                "Dead animal(s)",
                "Dustbins not cleaned",
                "Garbage dump",
                "Garbage vehicle not arrived",
                "Sweeping not done",
                "No electricity in public toilet(s)"
            ],
            required: true,
        },
        severity: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            required: true,
        },
        location: {
            lat: Number,
            lng: Number,
            address: String,
        },
        media: {
            type: String, // URL/Path to uploaded image/video
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
            default: 'Pending',
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        resolutionNote: String,
        resolutionImage: String, // Evidence of resolution
        resolutionDate: Date,

        // Dispatch Details
        vehicleNumber: String,
        driverName: String,
        dispatchTime: Date,
    },
    {
        timestamps: true,
    }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
