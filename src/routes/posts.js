const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const postController = require('../controllers/postController');

// Public routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Protected routes
router.post('/', protect, postController.createPost);
router.put('/:id', protect, postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

module.exports = router;
