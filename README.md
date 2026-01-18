# 🎓 DSA Learning Platform

A modern, interactive platform for mastering Data Structures and Algorithms with AI-powered assistance.

## ✨ Features

- 📚 **Comprehensive Courses** - Structured lessons covering all major DSA topics
- 💻 **Real-Time Code Editor** - Write, compile, and execute Java code in your browser
- 🤖 **AI Chatbot** - Get instant help with RAG-powered AI assistant
- 🎮 **Gamification** - Earn points, maintain streaks, and unlock badges
- 📊 **Progress Tracking** - Monitor your learning journey with detailed analytics
- 🎨 **Modern UI** - Beautiful glass morphism design with smooth animations
- 🌙 **Dark Mode** - Easy on the eyes for late-night coding sessions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Java 17+ (JDK)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/xumaiya/javaDSA.git
cd javaDSA

# Install frontend dependencies
npm install

# Setup backend
cd backend
# Create .env file with your OpenRouter API key
echo "OPENROUTER_API_KEY=your-key-here" > .env
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Visit: `http://localhost:5173`

## 🔑 API Key Setup

The AI chatbot requires an OpenRouter API key:

1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Sign up (free tier available)
3. Create an API key
4. Add to `backend/.env`:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

## 📖 Documentation

Detailed documentation is available in the [`docs/`](./docs) folder:

- [Code Editor Guide](./docs/HOW_TO_USE_CODE_EDITOR.md)
- [Git Collaboration Guide](./docs/GIT_GUIDE.md)
- [Dashboard Features](./docs/DASHBOARD_FEATURES.md)

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router

### Backend
- Spring Boot 3.4
- Spring Security + JWT
- H2 Database (file-based)
- OpenRouter API (AI)
- Maven

## 📁 Project Structure

```
javaDSA/
├── src/                    # Frontend source
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── store/             # State management
├── backend/               # Spring Boot backend
│   └── src/main/java/    # Java source code
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🤝 Contributing

See [CONTRIBUTORS.md](./CONTRIBUTORS.md) for contribution guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- OpenRouter for AI API access
- Spring Boot community
- React community

---

Made with ❤️ for DSA learners
