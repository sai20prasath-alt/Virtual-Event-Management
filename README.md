# Virtual Event Management Platform - Backend

A Node.js and Express.js based backend system for managing virtual events with user authentication, event scheduling, and participant management.

## Features

- **User Authentication**: Secure registration and login using bcrypt and JWT
- **Event Management**: Create, read, update, and delete events (organizers only)
- **Participant Management**: Register/unregister users for events
- **In-Memory Storage**: Uses arrays and objects for data persistence during runtime
- **Email Notifications**: Welcome emails on registration and event confirmation emails
- **Role-Based Access**: Support for 'organizer' and 'attendee' roles
- **RESTful API**: Clean API endpoints for all operations
- **Error Handling**: Comprehensive error handling and validation
- **Logging**: Request and error logging for debugging

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Testing**: Jest, Supertest
- **Development**: Nodemon

## Project Structure

```
src/
├── server.js              # Main application entry point
├── config/
│   └── constants.js       # Application constants and configuration
├── middleware/
│   ├── authMiddleware.js  # JWT verification middleware
│   ├── errorHandler.js    # Global error handling
│   └── validator.js       # Input validation middleware
├── routes/
│   ├── authRoutes.js      # Authentication endpoints
│   ├── eventRoutes.js     # Event management endpoints
│   └── participantRoutes.js # Participant management endpoints
├── controllers/
│   ├── authController.js  # Authentication business logic
│   ├── eventController.js # Event management logic
│   └── participantController.js # Participant management logic
├── models/
│   ├── user.js       # In-memory user data model
│   └── eventModel.js      # In-memory event data model
├── services/
│   ├── authService.js     # Authentication utilities (hashing, JWT)
│   ├── emailService.js    # Email sending service
│   └── eventService.js    # Event business logic and validation
└── utils/
    ├── logger.js          # Logging utility
    └── responseFormatter.js # API response formatting
test/
├── auth.test.js           # Authentication endpoint tests
├── events.test.js         # Event endpoint tests
└── participants.test.js   # Participant endpoint tests
```

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Virtual_Event_Management_Platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy .env file and update with your values
   cp .env.example .env
   ```

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in `.env` (default: 5000)

## API Endpoints

### Authentication
- **POST** `/api/auth/register` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "attendee" // or "organizer"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Events
- **POST** `/api/events` - Create event (organizers only)
- **GET** `/api/events` - Get all events
- **GET** `/api/events/:id` - Get event details
- **PUT** `/api/events/:id` - Update event (organizers only)
- **DELETE** `/api/events/:id` - Delete event (organizers only)
- **GET** `/api/events/my/organized` - Get user's organized events

### Participants
- **POST** `/api/events/:eventId/register` - Register for event
- **DELETE** `/api/events/:eventId/register` - Unregister from event
- **GET** `/api/events/:eventId/participants` - Get event participants
- **GET** `/api/events/my/registered` - Get user's registered events

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```bash
Authorization: Bearer <jwt_token>
```

## Testing

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment (development/production) | development |
| `JWT_SECRET` | Secret key for JWT signing | your-secret-key |
| `EMAIL_SERVICE` | Email service provider | gmail |
| `EMAIL_USER` | Email account username | - |
| `EMAIL_PASSWORD` | Email account password/app password | - |

## Future Enhancements

1. **Database Integration**: Replace in-memory storage with MongoDB or PostgreSQL
2. **Real Email Service**: Implement nodemailer for actual email notifications
3. **Advanced Features**: Event categories, search, filtering, pagination
4. **User Profiles**: Extended user information and profile management
5. **Event Analytics**: Attendance reports and event statistics
6. **Notifications**: Real-time notifications using WebSockets
7. **API Documentation**: Swagger/OpenAPI documentation
8. **Rate Limiting**: Implement rate limiting for API endpoints
9. **Caching**: Add Redis for caching frequently accessed data

## Error Handling

The API returns standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## Security Considerations

- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens expire after 24 hours
- Input validation on all endpoints
- Role-based access control for event operations
- CORS should be configured for production

## Contributing

Please follow the existing code structure and naming conventions when contributing.

## License

ISC
