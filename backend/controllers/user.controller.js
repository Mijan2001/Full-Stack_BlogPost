const User = require('../models/user.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

// @desc    Get all users (admin only) with pagination
// @route   GET /api/users?page=1&limit=10
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    console.log('admin getUsers ==>', req.user);

    try {
        const page = Number(req.query.page) || 1; // default page 1
        const limit = Number(req.query.limit) || 5; // default limit 5
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments(); // total number of users

        const users = await User.find()
            .select(
                '-password -resetPasswordToken -resetPasswordExpire -verificationToken'
            )
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // optional: latest users first

        res.status(200).json({
            users: users.map(user => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isVerified: user.isVerified,
                createdAt: user.createdAt
            })),
            page,
            pages: Math.ceil(totalUsers / limit),
            totalUsers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select(
            '-password -resetPasswordToken -resetPasswordExpire -verificationToken'
        );

        console.log('user.controller.js user == >', user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            isAdmin: user.isAdmin,
            isVerified: user.isVerified,
            createdAt: user.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Admins can update any user, users can only update themselves
        if (req.params.id !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update user fields
        user.name = req.body.name || user.name;

        // Update profileImage if provided
        if (req.body.profileImage) {
            user.profileImage = req.body.profileImage;
        }

        // Admin can update isAdmin status
        if (req.user.isAdmin) {
            user.isAdmin =
                req.body.isAdmin !== undefined
                    ? req.body.isAdmin
                    : user.isAdmin;
        }

        // If email is being changed
        if (req.body.email && req.body.email !== user.email) {
            // Check if new email already exists
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res
                    .status(400)
                    .json({ message: 'Email already in use' });
            }
            user.email = req.body.email;
        }

        // If password is being updated
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
            isAdmin: updatedUser.isAdmin,
            isVerified: updatedUser.isVerified,
            createdAt: updatedUser.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only admin can delete users (or users can delete themselves)
        if (req.params.id !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete user's posts
        const userPosts = await Post.find({ author: user._id });
        for (const post of userPosts) {
            // Delete comments on this post
            await Comment.deleteMany({ post: post._id });
            // Delete post
            await post.deleteOne();
        }

        // Delete user's comments
        await Comment.deleteMany({ author: user._id });

        // Delete user
        await user.deleteOne();

        res.status(200).json({ message: 'User removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
