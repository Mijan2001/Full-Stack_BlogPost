const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
    getCommentsByPost,
    createComment,
    updateComment,
    deleteComment,
    getAllCommentsByPostId
} = require('../controllers/comment.controller');

// Public routes
router.get('/:postId', getCommentsByPost);
router.get('/', getAllCommentsByPostId);

// Protected routes
router.post('/', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
