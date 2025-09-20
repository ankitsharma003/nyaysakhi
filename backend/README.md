# Nyāy Mitra Backend API

Backend API server for the Nyāy Mitra legal assistance platform.

## 🚀 Features

- **Document Processing**: OCR-based document analysis with Tesseract.js
- **User Management**: Registration, authentication, and profile management
- **Lawyer Directory**: Search and filter verified lawyers
- **FAQ System**: Legal knowledge base with search functionality
- **Case Matching**: AI-powered lawyer matching based on case type and location
- **Multilingual Support**: English and Hindi language support

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **OCR**: Tesseract.js
- **Authentication**: JWT
- **File Upload**: Multer
- **Image Processing**: Sharp

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   └── errorHandler.js     # Error handling middleware
│   ├── routes/
│   │   ├── documents.js        # Document processing routes
│   │   ├── users.js           # User management routes
│   │   ├── lawyers.js         # Lawyer directory routes
│   │   └── qa.js              # FAQ and Q&A routes
│   ├── utils/
│   │   └── documentProcessor.js # Document processing utilities
│   ├── scripts/
│   │   └── seedData.js        # Database seeding script
│   └── server.js              # Main server file
├── uploads/                    # File upload directory
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp env.example .env
```

4. Update `.env` with your configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nyaymitra
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Start the server:

```bash
# Development
npm run dev

# Production
npm start
```

### Database Setup

The server will automatically create tables on startup. To seed sample data:

```bash
node src/scripts/seedData.js
```

## 📚 API Endpoints

### Authentication

- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user profile

### Documents

- `POST /api/documents/upload` - Upload and process document
- `GET /api/documents` - Get user's documents
- `GET /api/documents/:id` - Get single document
- `PUT /api/documents/:id` - Update document data
- `DELETE /api/documents/:id` - Delete document

### Lawyers

- `GET /api/lawyers` - Get lawyers with filtering
- `GET /api/lawyers/:id` - Get single lawyer
- `POST /api/lawyers/register` - Register new lawyer
- `GET /api/lawyers/matches/:documentId` - Get lawyer matches for document

### FAQ & Q&A

- `GET /api/qa/faqs` - Get FAQs with filtering
- `GET /api/qa/search` - Search FAQs
- `GET /api/qa/categories` - Get FAQ categories
- `POST /api/qa/submit-question` - Submit new question

### Health Check

- `GET /api/health` - Server health status

## 🔧 Configuration

### Environment Variables

| Variable       | Description       | Default               |
| -------------- | ----------------- | --------------------- |
| `DB_HOST`      | Database host     | localhost             |
| `DB_PORT`      | Database port     | 5432                  |
| `DB_NAME`      | Database name     | nyaymitra             |
| `DB_USER`      | Database user     | postgres              |
| `DB_PASSWORD`  | Database password | -                     |
| `JWT_SECRET`   | JWT secret key    | -                     |
| `PORT`         | Server port       | 5000                  |
| `NODE_ENV`     | Environment       | development           |
| `FRONTEND_URL` | Frontend URL      | http://localhost:3000 |

### File Upload

- Maximum file size: 10MB
- Supported formats: PDF, JPG, PNG, TIFF
- Upload directory: `uploads/documents/`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Documentation

### Request/Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

### Authentication

Include JWT token in Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🚀 Deployment

### Production Setup

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Configure file storage (AWS S3 recommended)
5. Set up reverse proxy (nginx)
6. Enable HTTPS

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@nyaymitra.com or create an issue on GitHub.
