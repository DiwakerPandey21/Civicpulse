const mongoose = require('mongoose');

const binSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true }, // e.g., BIN-001
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        address: { type: String, required: true }
    },
    fillLevel: { type: Number, default: 0 }, // 0 to 100
    status: {
        type: String,
        enum: ['Normal', 'Critical'],
        default: 'Normal'
    },
    lastEmptied: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bin', binSchema);
