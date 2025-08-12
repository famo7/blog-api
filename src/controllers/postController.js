const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Post Controller

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const simplifiedPosts = posts.map((post) => ({
      ...post,
      author: post.author?.user ? { name: post.author.user.name } : null,
    }));

    res.status(200).json(simplifiedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const simplifiedPost = {
      ...post,
      author: post.author?.user ? { name: post.author.user.name } : null,
    };

    res.status(200).json(simplifiedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};

exports.createPost = async (req, res) => {
  try {
    // Check if user has AUTHOR role
    if (req.user.role !== 'AUTHOR') {
      return res.status(403).json({ message: 'Only authors can create posts' });
    }

    const { title, content } = req.body;

    // Get the author record for the user
    const author = await prisma.author.findUnique({
      where: { userId: req.user.id },
    });

    if (!author) {
      return res.status(403).json({ message: 'Author profile not found' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: author.id,
      },
      include: {
        author: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { author: { select: { userId: true } } },
    });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to update this post' });
    }
    const { title, content } = req.body;
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { title, content },
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Error updating post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { author: { select: { userId: true } } },
    });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to delete this post' });
    }
    await prisma.post.delete({ where: { id: postId } });
    res.status(200).json({ message: `Post ${postId} deleted` });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
};
