const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    likePost,
    dislikePost,
    searchPosts,
    getPostsByUser
} = require('../controllers/post.controller');

// Public routes
router.get('/', getPosts);
router.get('/search', searchPosts);
router.get('/user/:userId', getPostsByUser);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, upload.single('image'), createPost);
// router.post('/', upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);
router.put('/:id/dislike', protect, dislikePost);

module.exports = router;
