const express = require('express');
const router = express.Router();
const { registerUser, loginUser, sendOtp, verifyOtp, verifyRegistration } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/verify-registration', verifyRegistration);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
