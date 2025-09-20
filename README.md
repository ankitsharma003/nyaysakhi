# न्याय मित्र (Nyāy Mitra) - AI Legal Assistant

An AI-powered legal document analysis and lawyer matching platform designed to make legal assistance accessible to everyone in India.

## 🚀 Features

- **Document Analysis**: Upload legal documents and get instant AI-powered analysis
- **Smart Extraction**: Extract case numbers, dates, judge names, and case status
- **Lawyer Matching**: Find verified lawyers in your area based on case type
- **Multilingual Support**: Available in English and Hindi
- **Voice Output**: Listen to case summaries in both languages
- **Legal FAQ**: Get answers to common legal questions
- **PWA Support**: Works offline with document queuing

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with shadcn/ui patterns
- **OCR**: Tesseract.js for client-side document processing
- **PWA**: Next.js PWA support

### Backend

- **Runtime**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT with refresh tokens
- **Security**: bcrypt, rate limiting, CORS
- **Storage**: MongoDB GridFS for document storage

### Infrastructure

- **Frontend**: Vercel/Netlify
- **Backend**: Vercel/Railway/Render
- **Database**: MongoDB Atlas
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
nyaymitra/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
├── public/                # Static assets
├── backend/               # Backend API (Express.js + MongoDB)
├── ml/                    # ML models and processing (planned)
└── infra/                 # Infrastructure as code (planned)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free)

### Quick Start with MongoDB Atlas

1. **Set up MongoDB Atlas:**

   ```bash
   # Run the interactive setup script
   node quick-start-atlas.js
   ```

2. **Or follow the detailed guide:**
   - See [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md) for step-by-step instructions

3. **Install dependencies:**

   ```bash
   npm install
   cd backend
   npm install
   ```

4. **Start the backend:**

   ```bash
   cd backend
   npm start
   ```

5. **Start the frontend:**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

## 🌟 Development Phases

### Phase 0 - Project Setup ✅

- [x] Project structure setup
- [x] Next.js configuration
- [x] TypeScript setup
- [x] Tailwind CSS configuration
- [x] ESLint and Prettier setup
- [x] Basic "Hello Nyāy Mitra" page

### Phase 1 - Discovery & Document Analysis ✅

- [x] Document upload component with drag-and-drop
- [x] OCR integration using Tesseract.js
- [x] Text extraction and parsing utilities
- [x] Document analyzer with editable fields
- [x] Support for case numbers, judge names, dates, etc.

### Phase 2 - UI/UX Design ✅

- [x] Modern, responsive design with Hindi/English support
- [x] Reusable UI component library (Button, Card, etc.)
- [x] Comprehensive testing suite with Jest
- [x] Accessibility features and proper form labels

### Phase 3 - Core MVP Development ✅

- [x] Document upload flow
- [x] OCR integration
- [x] Text extraction and parsing
- [x] Backend API development (Express.js + PostgreSQL)
- [x] Database schema design
- [x] User authentication system
- [x] Lawyer directory with search and filtering
- [x] FAQ system with search functionality
- [x] API client for frontend-backend communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Constitution of India dataset for legal knowledge base
- Tesseract.js for OCR capabilities
- Next.js team for the amazing framework
- Tailwind CSS for utility-first styling

## 📞 Contact

- Project Link: [https://github.com/your-org/nyaymitra](https://github.com/your-org/nyaymitra)
- Issues: [https://github.com/your-org/nyaymitra/issues](https://github.com/your-org/nyaymitra/issues)

---

**न्याय मित्र** - Making legal assistance accessible to everyone! 🇮🇳
