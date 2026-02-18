const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedOfficials = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Official Seeding');

        const officials = [
            {
                name: "Dr. Anjali Gupta",
                email: "health@civicpulse.com",
                password: "password123",
                role: "official",
                department: "Health",
                isEmailVerified: true,
                isPhoneVerified: true
            },
            {
                name: "Mr. Raj Kumar",
                email: "sanitation@civicpulse.com",
                password: "password123",
                role: "official",
                department: "Sanitation",
                isEmailVerified: true,
                isPhoneVerified: true
            },
            {
                name: "Er. Vikram Singh",
                email: "infra@civicpulse.com",
                password: "password123",
                role: "official",
                department: "Infrastructure",
                isEmailVerified: true,
                isPhoneVerified: true
            },
            {
                name: "Ms. Priya Sharma",
                email: "water@civicpulse.com",
                password: "password123",
                role: "official",
                department: "Water",
                isEmailVerified: true,
                isPhoneVerified: true
            }
        ];

        for (const official of officials) {
            const exists = await User.findOne({ email: official.email });
            if (!exists) {
                await User.create(official);
                console.log(`Created: ${official.name} (${official.department})`);
            } else {
                console.log(`Skipped: ${official.email} (Already exists)`);
            }
        }

        console.log('Officials Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedOfficials();
