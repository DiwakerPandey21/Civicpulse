const Bin = require('../models/Bin');
const Complaint = require('../models/Complaint');

// @desc    Get all bins
// @route   GET /api/bins
// @access  Public
const getBins = async (req, res) => {
    try {
        const bins = await Bin.find();
        res.json(bins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset a bin (Emptied)
// @route   PUT /api/bins/:id/empty
// @access  Private (Official)
const emptyBin = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);
        if (bin) {
            bin.fillLevel = 0;
            bin.status = 'Normal';
            bin.lastEmptied = Date.now();
            await bin.save();
            res.json(bin);
        } else {
            res.status(404).json({ message: 'Bin not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// SIMULATION LOGIC (To be called by server.js loop)
const simulateBinUpdates = async () => {
    try {
        const bins = await Bin.find();
        if (bins.length === 0) return;

        // Fetch a system user (Admin) to assign as creator
        const User = require('../models/User');
        const adminUser = await User.findOne({ role: 'admin' });

        if (!adminUser) {
            console.log("Simulation Skipped: No Admin user found to create complaints.");
            return;
        }

        // Pick 3 random bins to update
        for (let i = 0; i < 3; i++) {
            const randomBin = bins[Math.floor(Math.random() * bins.length)];

            // Increase fill level by random 5-15%
            const increase = Math.floor(Math.random() * 10) + 5;
            let newLevel = randomBin.fillLevel + increase;

            if (newLevel > 100) newLevel = 100;

            randomBin.fillLevel = newLevel;

            // Check Critical Threshold
            if (newLevel >= 90 && randomBin.status !== 'Critical') {
                randomBin.status = 'Critical';

                // AUTO-CREATE COMPLAINT
                await Complaint.create({
                    title: `🚨 IoT Alert: Bin ${randomBin.id} Overflow`,
                    description: `Automated Sensor Alert: Bin at ${randomBin.location.address} is ${newLevel}% full. Dispatch truck immediately.`,
                    category: "Garbage dump",
                    severity: "Critical",
                    location: {
                        lat: randomBin.location.lat,
                        lng: randomBin.location.lng,
                        address: randomBin.location.address
                    },
                    status: "Pending",
                    createdBy: adminUser._id // System Admin ID
                });
                console.log(`🚨 IoT ALERT: Complaint filed for Bin ${randomBin.id}`);
            }

            await randomBin.save();
        }
    } catch (error) {
        console.error("Simulation Error:", error.message);
    }
};

module.exports = { getBins, emptyBin, simulateBinUpdates };
