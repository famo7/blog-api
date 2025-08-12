const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// GET /api/posts/:postId/comments - Get all comments for a post
router.get('/', commentController.getComments);

// POST /api/posts/:postId/comments - Create a new comment (protected)
router.post('/', protect, commentController.createComment);

// GET /api/posts/:postId/comments/:commentId - Get a specific comment
router.get('/:commentId', commentController.getCommentById);

// PUT /api/posts/:postId/comments/:commentId - Update a comment (protected)
router.put('/:commentId', protect, commentController.updateComment);

// DELETE /api/posts/:postId/comments/:commentId - Delete a comment (protected)
router.delete('/:commentId', protect, commentController.deleteComment);

module.exports = router;
