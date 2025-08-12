const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getComments = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // Get all comments for the post
    const comments = await prisma.comment.findMany({
      where: { postId: postId },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      message: 'Error fetching comments',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = parseInt(req.params.postId);
    const userId = req.user.id;

    // Validate input
    if (!content || content.trim() === '') {
      return res.status(400).json({
        message: 'Comment content is required',
      });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, title: true },
    });

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: postId,
        userId: userId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      message: 'Error creating comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // Get the specific comment
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        postId: postId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!comment) {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({
      message: 'Error fetching comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);
    const userId = req.user.id;

    // Validate input
    if (!content || content.trim() === '') {
      return res.status(400).json({
        message: 'Comment content is required',
      });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // Check if comment exists and belongs to the user
    const existingComment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        postId: postId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!existingComment) {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }

    // Check if user owns the comment
    if (existingComment.userId !== userId) {
      return res.status(403).json({
        message: 'You can only update your own comments',
      });
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({
      message: 'Error updating comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);
    const userId = req.user.id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      });
    }

    // Check if comment exists and belongs to the user
    const existingComment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        postId: postId,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!existingComment) {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }

    // Check if user owns the comment
    if (existingComment.userId !== userId) {
      return res.status(403).json({
        message: 'You can only delete your own comments',
      });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      message: 'Error deleting comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
