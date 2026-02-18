const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            console.log("Token received:", token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded ID:", decoded.id);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.error("User not found with ID:", decoded.id);
                throw new Error("User not found");
            }

            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed: ' + error.message });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    }
}

module.exports = { protect, authorize };
