# DevTinder 👩‍💻❤️👨‍💻

A platform for developers to connect, collaborate, and code together. DevTinder helps software developers find like-minded peers based on tech stack, interests, and project goals.

![DevTinder Logo](https://via.placeholder.com/800x200?text=DevTinder)

## Features

### 🔍 Developer Discovery
- Browse profiles of developers based on tech stack, experience level, and interests
- Advanced filtering to find the perfect coding partner
- Skill-based matching algorithm

### 💌 Connection System
- Send connection requests to developers you'd like to work with
- Express interest in specific projects or collaborations
- Accept or reject incoming connection requests

### 💬 Real-time Chat
- Instant messaging with your connections
- Code snippet sharing with syntax highlighting
- File and resource sharing capabilities

### 👩‍💻 Comprehensive Profiles
- Showcase your tech stack and programming languages
- Link your GitHub, portfolio, and other professional profiles
- Display past projects and contributions

### 🚀 Project Collaboration
- Create or join project proposals
- Define project goals and requirements
- Set team roles and responsibilities

## Tech Stack

- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: Socket.io
- **Frontend**: React.js (repository available separately)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/devtinder-backend.git
cd devtinder-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devtinder
JWT_SECRET=your_jwt_secret_key
SALT_ROUND=10
```

4. Start the development server:
```bash
npm run dev
```

<!-- ## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login and get JWT
- `GET /api/auth/profile` - Get current user profile

### User Management
- `GET /api/users/feed` - Get potential matches
- `GET /api/users/:id` - Get a specific user's profile
- `PATCH /api/users/:id` - Update user profile
- `GET /api/users/connections` - Get all connections

### Connection Requests
- `POST /api/requests/send/:userId` - Send a connection request
- `PATCH /api/requests/review/:status/:requestId` - Accept/reject a request
- `GET /api/requests/pending` - Get all pending requests
- `GET /api/requests/sent` - Get all sent requests

### Chat
- `GET /api/chats` - Get all chats
- `GET /api/chats/:connectionId` - Get chat with specific connection
- `POST /api/chats/:connectionId` - Send a message
- `DELETE /api/chats/:messageId` - Delete a message

## Project Structure

```
.
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middleware/         # Express middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Utility functions
├── .env                # Environment variables
├── .eslintrc.js        # ESLint configuration
├── .prettierrc         # Prettier configuration
├── app.js              # Express app setup
└── server.js           # Entry point
``` -->

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [uzair ansari](mailto:uzairans532@gmail.com)

Project Link: [https://github.com/uzairansari11/dev_tinder_backend](https://github.com/uzairansari11/dev_tinder_backend)
