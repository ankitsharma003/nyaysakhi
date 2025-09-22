# NyayMitra Backend API

A robust Node.js backend API for the NyayMitra legal assistance platform, built with Express.js and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based authentication with session management
- **User Management**: User registration, login, profile management
- **Lawyer Profiles**: Lawyer registration and profile management
- **Document Processing**: OCR-based document analysis and data extraction
- **FAQ System**: Multi-language FAQ management
- **Security**: Rate limiting, CORS, helmet security headers
- **Database**: MongoDB with Mongoose ODM

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd nyaymitra/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp env.example .env
```

   Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/nyaymitra
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   
   # Server Configuration
PORT=5000
NODE_ENV=development
   
   # Frontend URL
FRONTEND_URL=http://localhost:3000
```

4. **Start MongoDB**
   - Local: Start your MongoDB service
   - Atlas: Ensure your connection string is correct

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your environment variables).

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-2fa` - Two-factor authentication
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/logout-all` - Logout from all devices

### Users
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/stats` - Get user statistics
- `DELETE /api/users/me` - Deactivate account

### Lawyers
- `GET /api/lawyers` - Get all lawyers (with filtering)
- `GET /api/lawyers/:id` - Get single lawyer
- `POST /api/lawyers/register` - Register as lawyer
- `PUT /api/lawyers/me` - Update lawyer profile
- `GET /api/lawyers/matches/:documentId` - Get lawyer matches for document
- `GET /api/lawyers/cases` - Get lawyer cases
- `PUT /api/lawyers/cases/:caseId/status` - Update case status
- `GET /api/lawyers/stats` - Get lawyer statistics

### Documents
- `POST /api/documents/upload` - Upload and process document
- `GET /api/documents` - Get user documents
- `GET /api/documents/:id` - Get single document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### FAQ
- `GET /api/qa/faqs` - Get FAQs
- `GET /api/qa/search` - Search FAQs
- `GET /api/qa/categories` - Get FAQ categories
- `GET /api/qa/faqs/:id` - Get single FAQ
- `POST /api/qa/submit-question` - Submit question

## Database Models

### User
- Basic user information
- Authentication data
- Profile settings
- Two-factor authentication

### Lawyer
- Professional information
- Practice areas and specializations
- Ratings and reviews
- Availability and consultation fees

### Document
- File information
- OCR extracted data
- Processing status
- Categories and tags

### Session
- User sessions
- Device information
- Token management
- Activity tracking

### FAQ
- Questions and answers
- Categories and tags
- Multi-language support
- Search optimization

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Track and manage user sessions
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Request validation using express-validator
- **Password Hashing**: bcryptjs for secure password storage
- **Two-Factor Authentication**: Optional 2FA support

## Error Handling

The API includes comprehensive error handling:
- Database connection errors
- Authentication failures
- Validation errors
- File upload errors
- OCR processing errors

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── uploads/             # File upload directory
├── .env                 # Environment variables
├── package.json
└── README.md
```

### Adding New Features

1. Create new models in `src/models/`
2. Add routes in `src/routes/`
3. Update middleware if needed
4. Add validation rules
5. Update API documentation

### Testing

```bash
npm test
```

## Deployment

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure MongoDB Atlas connection
- Set up proper CORS origins
- Configure file upload limits

### Docker Support
The project includes Docker configuration for containerized deployment.

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **JWT Errors**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify token format

3. **File Upload Issues**
   - Check upload directory permissions
   - Verify file size limits
   - Check file type restrictions

4. **OCR Processing Errors**
   - Ensure Tesseract.js is properly installed
   - Check file format support
   - Verify language packs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.