const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['citizen', 'admin', 'official'],
            default: 'citizen',
        },
        department: {
            type: String,
            enum: ['Traffic', 'Water', 'Health', 'Infrastructure', 'Sanitation', 'None'],
            default: 'None',
        },
        phone: {
            type: String,
            unique: true,
            sparse: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isPhoneVerified: {
            type: Boolean,
            default: false,
        },
        emailOtp: String,
        emailOtpExpires: Date,
        phoneOtp: String,
        phoneOtpExpires: Date,
        // Gamification
        points: {
            type: Number,
            default: 0,
        },
        badges: {
            type: [String], // e.g., ["Swachhata Warrior", "Top Reporter"]
            default: [],
        },
        // Login OTP (separate from registration)
        otp: {
            type: String,
        },
        otpExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
