const crypto = require('crypto');
const User = require('../models/user.model');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/email');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            verificationToken
        });

        // Send verification email
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

        await sendEmail({
            email: user?.email,
            subject: 'Email Verification',
            html: `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" target="_blank">Verify Email</a>
      `
        });

        res.status(201).json({
            message:
                'User registered successfully. Please check your email for verification.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        console.log('auth.controller.js: token==', token);

        const user = await User.findOne({ verificationToken: token });

        console.log('auth.controller.js: user==', user);

        if (!user) {
            return res
                .status(400)
                .json({ message: 'Invalid verification token' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({
            message: 'Email verified successfully. You can now login.'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({
                message: 'Please verify your email before logging in'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res
                .status(401)
                .json({ message: 'Invalid email or password' });
        }

        // Create token
        const token = generateToken(user?._id);

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Set token and expiry on user
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        // Send email
        await sendEmail({
            email: user.email,
            subject: 'Password Reset',
            html: `
        <h1>Password Reset Request</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link is valid for 10 minutes only.</p>
      `
        });

        res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        console.error(error);

        // Clear fields on error
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.query.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
