const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bin = require('./models/Bin');

dotenv.config();

const seedBins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Bin Seeding');

        // Sample Smart Bins (IoT)
        const bins = [
            {
                id: "IoT-BIN-001",
                location: { lat: 31.3260, lng: 75.5762, address: "Model Town Market" },
                fillLevel: 45,
                status: "Normal"
            },
            {
                id: "IoT-BIN-002",
                location: { lat: 31.3300, lng: 75.5800, address: "Bus Stand Jalandhar" },
                fillLevel: 88, // Close to critical
                status: "Normal"
            },
            {
                id: "IoT-BIN-003",
                location: { lat: 31.3400, lng: 75.5900, address: "Railway Station" },
                fillLevel: 20,
                status: "Normal"
            },
            {
                id: "IoT-BIN-004",
                location: { lat: 31.3500, lng: 75.6000, address: "PPR Mall" },
                fillLevel: 10,
                status: "Normal"
            },
            {
                id: "IoT-BIN-005",
                location: { lat: 31.3100, lng: 75.5500, address: "Football Chowk" },
                fillLevel: 92, // Critical!
                status: "Critical"
            }
        ];

        await Bin.deleteMany(); // Clear existing bins
        await Bin.insertMany(bins);

        console.log('Smart Bins (IoT) Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedBins();
