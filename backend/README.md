# DSA Learning Platform - Backend

A Spring Boot backend for the DSA Learning Platform, featuring JWT authentication, H2 in-memory database, and AI-powered RAG chatbot via OpenRouter.

## Features

- ✅ **JWT Authentication** - Secure token-based authentication with refresh tokens
- ✅ **User Management** - Registration, login, profile management with roles (STUDENT, ADMIN)
- ✅ **Course Management** - Full CRUD for courses, chapters, and lessons
- ✅ **Notes System** - User notes with CRUD operations
- ✅ **AI Chatbot** - RAG-powered chatbot using OpenRouter API
- ✅ **Gamification** - Points, badges, streaks, levels, and leaderboard
- ✅ **Progress Tracking** - Lesson completion and progress calculation
- ✅ **H2 Database** - In-memory database for easy local development
- ✅ **RESTful API** - Clean REST endpoints with proper HTTP status codes
- ✅ **Global Exception Handling** - Comprehensive error handling

## Tech Stack

- **Spring Boot 3.4.1** - Framework
- **Java 21** - Language
- **Spring Security** - Authentication & Authorization
- **Spring Data JPA** - Database access
- **H2 Database** - In-memory database
- **JWT (jjwt)** - Token management
- **MapStruct** - DTO mapping
- **Lombok** - Boilerplate reduction
- **WebFlux** - HTTP client for OpenRouter API
- **Maven** - Build tool

## Prerequisites

- Java 21+
- Maven 3.6+
- OpenRouter API key (for AI chat functionality)

## Quick Start

### 1. Clone and Configure

```bash
cd backend
```

### 2. Set Environment Variable

Set your OpenRouter API key:

**Windows (PowerShell):**
```powershell
$env:OPENROUTER_API_KEY="your-openrouter-api-key"
```

**Windows (CMD):**
```cmd
set OPENROUTER_API_KEY=your-openrouter-api-key
```

**Linux/Mac:**
```bash
export OPENROUTER_API_KEY=your-openrouter-api-key
```

Get your API key from: https://openrouter.ai/keys

### 3. Build and Run

```bash
# Build
mvn clean install -DskipTests

# Run
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### 4. Access H2 Console (Optional)

For debugging, access the H2 database console at:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:dsaplatform`
- Username: `sa`
- Password: (leave empty)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/{courseId}` - Get course details
- `GET /api/courses/{courseId}/chapters/{chapterId}` - Get chapter
- `GET /api/courses/{courseId}/chapters/{chapterId}/lessons/{lessonId}` - Get lesson

### Notes
- `GET /api/notes` - Get user notes
- `GET /api/notes/{id}` - Get note by ID
- `POST /api/notes` - Create note
- `PUT /api/notes/{id}` - Update note
- `DELETE /api/notes/{id}` - Delete note

### Chatbot (RAG)
- `POST /api/chat/ask` - Ask a question (requires auth)
- `POST /api/chat/embed-content` - Embed lesson content
- `GET /api/chat/history` - Get chat history

### Badges
- `GET /api/badges` - Get all badges
- `GET /api/badges/user/{userId}` - Get user badges

### Leaderboard
- `GET /api/leaderboard?limit=10` - Get leaderboard

### Lesson Progress
- `POST /api/lessons/{lessonId}/complete` - Mark lesson as complete

## Initial Data

The application comes pre-loaded with:
- 2 demo users (demo@example.com, admin@example.com)
- 3 sample courses with chapters and lessons
- 6 badges
- Sample lesson content for DSA topics

## Gamification System

The gamification engine automatically:
- Awards points for lesson/chapter/course completion
- Tracks daily streaks
- Calculates user levels
- Awards badges based on achievements

### Points System
- Lesson completion: 10 points (with streak bonus)
- Chapter completion: 50 points
- Course completion: 200 points
- Streak multiplier: 1.5x

## RAG Chatbot

The chatbot uses:
1. **Embedding Generation** - OpenRouter API (text-embedding-3-small)
2. **Vector Storage** - In-memory with cosine similarity search
3. **LLM Integration** - OpenRouter API (GPT-3.5-turbo)

To embed lesson content for RAG:
```bash
curl -X POST http://localhost:8080/api/chat/embed-content \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"lessonId": 1}'
```

## Testing

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=ChatServicePropertyTest
```

## Configuration

Key configuration in `application.properties`:

| Property | Description | Default |
|----------|-------------|---------|
| `server.port` | Server port | 8080 |
| `openai.api-key` | OpenRouter API key | (from env) |
| `openai.chat-model` | Chat model | openai/gpt-3.5-turbo |
| `openai.embedding-model` | Embedding model | openai/text-embedding-3-small |
| `rate-limit.requests-per-minute` | Rate limit | 10 |
| `jwt.expiration` | JWT expiration (ms) | 86400000 (24h) |

## Security

- JWT tokens with configurable expiration
- BCrypt password hashing
- Role-based access control (RBAC)
- CORS configuration for frontend
- Input validation
- Rate limiting (in-memory)

## Notes

- **Data Persistence**: H2 is in-memory, so data is lost on restart. This is intentional for easy local development.
- **OpenRouter**: The backend uses OpenRouter API which is OpenAI-compatible. You can use various models through OpenRouter.
- **Rate Limiting**: In-memory rate limiting (10 requests/minute per user) is enabled by default.

## License

Part of the DSA Learning Platform project.
