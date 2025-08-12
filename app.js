const express = require('express');
require('dotenv').config();

const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./src/routes/auth');
const postRoutes = require('./src/routes/posts');
const commentRoutes = require('./src/routes/comments');
const app = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
