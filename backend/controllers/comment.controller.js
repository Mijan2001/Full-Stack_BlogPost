const Comment = require('../models/comment.model');
const Post = require('../models/post.model');

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
exports.getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            comments: comments.map(comment => ({
                _id: comment._id,
                content: comment.content,
                author: {
                    _id: comment.author._id,
                    name: comment.author.name
                },
                postId: comment.post,
                createdAt: comment.createdAt
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
exports.createComment = async (req, res) => {
    try {
        const { postId, content } = req.body;

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            content,
            post: postId,
            author: req.user._id
        });

        const populatedComment = await Comment.findById(comment._id).populate(
            'author',
            'name'
        );

        res.status(201).json({
            _id: populatedComment._id,
            content: populatedComment.content,
            author: {
                _id: populatedComment.author._id,
                name: populatedComment.author.name
            },
            postId,
            createdAt: populatedComment.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all comments by a specific post ID
// @route   GET /api/comments?postId={postId}
// @access  Public
exports.getAllCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.query;

        if (!postId) {
            return res.status(400).json({ message: 'Post ID is required' });
        }

        const comments = await Comment.find({ post: postId })
            .populate('author', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(
            comments.map(comment => ({
                _id: comment._id,
                content: comment.content,
                author: {
                    _id: comment.author._id,
                    name: comment.author.name
                },
                createdAt: comment.createdAt,
                postId: comment.post // include post ID if needed
            }))
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is comment author
        if (
            comment.author.toString() !== req.user?._id.toString() &&
            !req.user.isAdmin
        ) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        comment.content = req.body.content || comment.content;

        const updatedComment = await comment.save();
        const populatedComment = await Comment.findById(
            updatedComment._id
        ).populate('author', 'name');

        res.status(200).json({
            _id: populatedComment._id,
            content: populatedComment.content,
            author: {
                _id: populatedComment.author._id,
                name: populatedComment.author.name
            },
            postId: populatedComment.post,
            createdAt: populatedComment.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is comment author or admin
        if (
            comment.author.toString() !== req.user._id.toString() &&
            !req.user.isAdmin
        ) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await comment.deleteOne();

        res.status(200).json({ message: 'Comment removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
