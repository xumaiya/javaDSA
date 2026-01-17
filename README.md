# 📚 DSA Learning Platform

A full-stack educational platform for learning Data Structures and Algorithms with an AI-powered chatbot, gamification features, and progress tracking.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-21+-orange.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6.svg)

## 🌟 Features

### Learning Features
- **5 Comprehensive DSA Courses** - From fundamentals to advanced topics
  - Data Structures Fundamentals
  - Algorithm Design & Analysis
  - Advanced Data Structures
  - Graph Algorithms
  - Dynamic Programming Mastery
- **Interactive Lessons** - Markdown-based content with code examples
- **Progress Tracking** - Track your learning journey across courses

### AI-Powered Chatbot
- **DSA-Focused Assistant** - Get help with data structures and algorithms
- **RAG (Retrieval-Augmented Generation)** - Context-aware responses from course materials
- **OpenRouter Integration** - Powered by advanced AI models

### Gamification
- **Points & Levels** - Earn points as you complete lessons
- **Badges** - Unlock achievements for milestones
- **Leaderboard** - Compete with other learners
- **Streaks** - Maintain daily learning streaks

### User Experience
- **Dark/Light Mode** - Comfortable viewing in any environment
- **Responsive Design** - Works on desktop and mobile
- **Notes System** - Take notes while learning

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management
- **React Router** - Client-side routing

### Backend
- **Spring Boot 3** - Java framework
- **Spring Security** - JWT authentication
- **H2 Database** - In-memory database (development)
- **OpenRouter API** - AI chat integration
- **jqwik** - Property-based testing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| Java JDK | 21+ | `java --version` |
| Maven | 3.9+ | `mvn --version` |
| Git | 2.0+ | `git --version` |

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/xumaiya/javaDSA.git
cd javaDSA
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create environment file
cp .env.example .env

# Edit .env and add your OpenRouter API key
# Get your key from: https://openrouter.ai/keys

# Run the backend (Windows)
.\mvnw.cmd spring-boot:run

# Run the backend (Linux/Mac)
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
# From the root directory
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

**Demo Credentials:**
- Email: `alice@example.com`
- Password: `password`

## ⚙️ Environment Configuration

### Backend Environment Variables

Create a `backend/.env` file with the following:

```env
# Required: OpenRouter API Key for AI chat
OPENROUTER_API_KEY=your-api-key-here

# Optional: JWT Secret (has default value)
# JWT_SECRET=your-jwt-secret-key-at-least-256-bits
```

### Frontend Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📁 Project Structure

```
javaDSA/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/dsaplatform/
│   │   │   │   ├── config/     # Configuration classes
│   │   │   │   ├── controller/ # REST controllers
│   │   │   │   ├── dto/        # Data transfer objects
│   │   │   │   ├── exception/  # Exception handlers
│   │   │   │   ├── model/      # Entity models
│   │   │   │   ├── repository/ # JPA repositories
│   │   │   │   ├── security/   # JWT & auth
│   │   │   │   └── service/    # Business logic
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql    # Initial data
│   │   └── test/               # Backend tests
│   └── pom.xml
├── src/                        # React frontend
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Page components
│   ├── services/               # API services
│   ├── store/                  # Zustand stores
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 🧪 Running Tests

### Frontend Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Backend Tests

```bash
cd backend

# Run all tests (Windows)
.\mvnw.cmd test

# Run all tests (Linux/Mac)
./mvnw test
```

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |

### Course Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/{id}` | Get course by ID |

### Chat Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/ask` | Send message to AI chatbot |
| GET | `/api/chat/history` | Get chat history |

### Progress Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lessons/progress` | Get user progress |
| POST | `/api/lessons/{id}/complete` | Mark lesson complete |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

## 👥 Team

- **Contributors** - See [CONTRIBUTORS.md](CONTRIBUTORS.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI API access
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Spring Boot](https://spring.io/projects/spring-boot) for backend framework
- [React](https://react.dev/) for frontend framework

---

Made with ❤️ for DSA learners everywhere
