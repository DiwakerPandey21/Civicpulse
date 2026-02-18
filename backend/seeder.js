const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Toilet = require('./models/Toilet');
const User = require('./models/User');

dotenv.config();

const seedToilets = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Allow seeding without admin if necessary, just create a dummy one
        let admin = await User.findOne({ role: 'admin' });

        if (!admin) {
            console.log('No Admin found. Creating a fallback admin for data ownership...');
            admin = await User.create({
                name: 'Seeder Admin',
                email: 'admin@civicpulse.com',
                password: 'password123',
                role: 'admin',
                phone: '9999999999',
                isEmailVerified: true,
                isPhoneVerified: true
            });
        }

        const toilets = [
            {
                name: "SBM Community Toilet - Market",
                address: "Sector 17 Market, Near Plaza",
                location: { type: 'Point', coordinates: [76.7794, 30.7333] }, // Chandigarh example
                facilities: ['Western', 'Indian', 'Handwash', 'Disabled Access'],
                status: 'Operational',
                addedBy: admin._id
            },
            {
                name: "Sulabh Shauchalaya",
                address: "ISBT Bus Stand, Sector 43",
                location: { type: 'Point', coordinates: [76.7681, 30.7189] },
                facilities: ['Indian', 'Handwash'],
                status: 'Operational',
                addedBy: admin._id
            },
            {
                name: "Public Toilet - Lake",
                address: "Sukhna Lake Entrance",
                location: { type: 'Point', coordinates: [76.8041, 30.7421] },
                facilities: ['Western', 'Indian', 'Baby Care'],
                status: 'Operational',
                addedBy: admin._id
            },
            {
                name: "SBM Toilet - Phagwara",
                address: "Near Phagwara Bus Stand",
                location: { type: 'Point', coordinates: [75.7708, 31.2240] }, // Phagwara Coordinates
                facilities: ['Indian', 'Handwash', 'Disabled Access'],
                status: 'Operational',
                addedBy: admin._id
            }
        ];

        await Toilet.deleteMany(); // Clear existing
        await Toilet.insertMany(toilets);

        console.log('Toilets Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedToilets();
