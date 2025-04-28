const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv');
dotenv.config();

// Authentication middleware
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            console.log('protected token == >', token);

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('protected decoded == >', decoded);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            console.log('protected req.user == >', req.user);

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Admin middleware
exports.admin = (req, res, next) => {
    // Check if user is an admin
    console.log('req.user admin check == >', req.user);
    if (req.user && req.user?.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
