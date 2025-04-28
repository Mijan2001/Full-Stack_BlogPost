const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth.middleware');
const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/user.controller');

// All routes are protected
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
