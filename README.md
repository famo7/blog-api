# Blog API

A RESTful API for a blog platform built with Node.js, Express, and Prisma. Supports user authentication, post management, and commenting functionality.

## Features

- 🔐 **User Authentication** - JWT-based authentication with role-based access control
- 📝 **Post Management** - Create, read, update, and delete blog posts
- 💬 **Comments System** - Users can comment on posts
- 👥 **User Roles** - Support for different user types (Author, Reader)
- 🔒 **Protected Routes** - Secure endpoints with middleware authentication
- 📊 **Database** - PostgreSQL database with Prisma ORM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Security**: helmet, cors

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd blog-api
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
SECRET_KEY="your-super-secret-jwt-key"
PORT=3000
```

4. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Posts

- `GET /api/posts` - Get all published posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post (Authors only)
- `PUT /api/posts/:id` - Update a post (Authors only)
- `DELETE /api/posts/:id` - Delete a post (Authors only)

### Comments

- `GET /api/posts/:postId/comments` - Get comments for a post
- `POST /api/posts/:postId/comments` - Add a comment to a post
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

### Users

- `GET /api/users/profile` - Get user profile (Protected)

## Database Schema

The application uses the following main entities:

- **User** - Stores user information and authentication data
- **Post** - Blog posts with title, content, and metadata
- **Comment** - User comments on posts

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## User Roles

- **AUTHOR** - Can create, edit, and delete posts
- **USER** - Can read posts and add comments

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Run database migrations

## Project Structure

```
├── src/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
├── .env.example        # Environment variables template
└── app.js             # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Related Projects

- **blog-client** - Frontend application for readers
- **blog-admin** - Admin dashboard for authors
