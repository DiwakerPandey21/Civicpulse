const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new citizen
// @route   POST /api/auth/register
// @access  Public
// @desc    Register a new citizen (Step 1: Send OTPs)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
        const userExists = await User.findOne({ $or: [{ email }, { phone }] });

        if (userExists) {
            return res.status(400).json({ message: 'User with this email or phone already exists' });
        }

        // Generate OTPs
        const emailOtp = Math.floor(1000 + Math.random() * 9000).toString();
        const phoneOtp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: 'citizen',
            emailOtp,
            emailOtpExpires: otpExpires,
            phoneOtp,
            phoneOtpExpires: otpExpires,
            isEmailVerified: false,
            isPhoneVerified: false
        });

        if (user) {
            // Send Email
            await sendEmail({
                email: user.email,
                subject: 'CivicPulse Registration OTP',
                message: `Your Email Verification OTP is: ${emailOtp}`
            });

            // Send SMS
            await sendSMS({ phone, message: `Your CivicPulse Phone Verification OTP is: ${phoneOtp}` });



            res.status(201).json({
                _id: user._id,
                message: "Verification OTPs sent to Email and Phone.",
                requiresVerification: true,
                devEmailOtp: emailOtp, // For ease of testing
                devPhoneOtp: phoneOtp
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Registration OTPs (Step 2)
// @route   POST /api/auth/verify-registration
// @access  Public
const verifyRegistration = async (req, res) => {
    const { userId, emailOtp, phoneOtp } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isEmailVerified && user.isPhoneVerified) {
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }

        let emailValid = false;
        let phoneValid = false;

        // Verify Email OTP
        if (user.emailOtp === emailOtp && user.emailOtpExpires > Date.now()) {
            user.isEmailVerified = true;
            user.emailOtp = undefined;
            user.emailOtpExpires = undefined;
            emailValid = true;
        }

        // Verify Phone OTP
        if (user.phoneOtp === phoneOtp && user.phoneOtpExpires > Date.now()) {
            user.isPhoneVerified = true;
            user.phoneOtp = undefined;
            user.phoneOtpExpires = undefined;
            phoneValid = true;
        }

        // Save changes
        await user.save();

        if (user.isEmailVerified && user.isPhoneVerified) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                message: "Registration Verified Successfully!"
            });
        } else {
            res.status(400).json({
                message: 'Verification failed. Check OTPs.',
                emailVerified: user.isEmailVerified,
                phoneVerified: user.isPhoneVerified
            });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send OTP to phone
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    const { phone } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ message: 'User not found with this phone number' });
        }

        // Generate 4 digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // Send SMS (Mocking for now as per updated plan, but using real structure)


        // Send SMS via RapidAPI
        await sendSMS({ phone, message: `Your CivicPulse OTP is: ${otp}` });

        res.json({ message: 'OTP sent successfully', devOtp: otp }); // returning otp for dev convenience
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify OTP and Login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.otp === otp && user.otpExpires > Date.now()) {
            // Clear OTP
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, sendOtp, verifyOtp, verifyRegistration };
