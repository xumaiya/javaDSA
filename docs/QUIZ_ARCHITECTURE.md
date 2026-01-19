# Quiz Feature Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACE                              │
│                         (React Frontend)                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP Request
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        QUIZ PAGE (Quiz.tsx)                          │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  1. Extract topic from course title                            │ │
│  │     "DSA in Java - Arrays" → "Arrays"                          │ │
│  │                                                                 │ │
│  │  2. Call quizService.generateQuizQuestions()                   │ │
│  │     - topic: "Arrays"                                          │ │
│  │     - difficulty: "intermediate"                               │ │
│  │     - questionCount: 5                                         │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ API Call
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    QUIZ SERVICE (quizService.ts)                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  POST /api/quiz/generate                                       │ │
│  │  Headers: Authorization: Bearer <token>                        │ │
│  │  Body: { topic, difficulty, questionCount }                    │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP Request
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   BACKEND API (Spring Boot)                          │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │           QuizController.java                                │   │
│  │  @PostMapping("/api/quiz/generate")                          │   │
│  │  - Validates authentication                                  │   │
│  │  - Extracts user ID                                          │   │
│  │  - Calls QuizGenerationService                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                  │                                    │
│                                  ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │        QuizGenerationService.java                            │   │
│  │  - Builds LLM prompt with topic & difficulty                 │   │
│  │  - Calls OpenAIClient                                        │   │
│  │  - Parses JSON response                                      │   │
│  │  - Validates questions                                       │   │
│  │  - Returns QuizResponse                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                  │                                    │
│                                  ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │            OpenAIClient.java                                 │   │
│  │  - Manages WebClient for OpenRouter API                      │   │
│  │  - Adds authentication headers                               │   │
│  │  - Handles timeouts and errors                               │   │
│  │  - Returns LLM response                                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTPS Request
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    OPENROUTER API (LLM Service)                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Model: openai/gpt-3.5-turbo                                   │ │
│  │  Endpoint: https://openrouter.ai/api/v1/chat/completions      │ │
│  │                                                                 │ │
│  │  Generates:                                                     │ │
│  │  - 5 multiple-choice questions                                 │ │
│  │  - 4 options per question                                      │ │
│  │  - Correct answer index                                        │ │
│  │  - Educational explanations                                    │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ JSON Response
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         RESPONSE FLOW                                │
│                                                                       │
│  OpenRouter → OpenAIClient → QuizGenerationService →                │
│  QuizController → QuizService → Quiz Page → User                    │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Request Flow

```
User Action (Start Quiz)
    ↓
Extract Topic from Course Title
    ↓
Build Request Object
    {
      topic: "Arrays",
      difficulty: "intermediate",
      questionCount: 5
    }
    ↓
Send to Backend API
    POST /api/quiz/generate
    Authorization: Bearer <JWT>
    ↓
Validate JWT Token
    ↓
Call Quiz Generation Service
    ↓
Build LLM Prompt
    "Generate 5 intermediate questions about Arrays..."
    ↓
Call OpenRouter API
    ↓
Receive LLM Response (JSON)
    ↓
Parse and Validate Questions
    ↓
Return QuizResponse
```

### 2. Response Flow

```
QuizResponse (Backend)
    {
      topic: "Arrays",
      difficulty: "intermediate",
      questions: [...],
      generatedAt: "2024-01-19T10:30:00"
    }
    ↓
Transform to Frontend Format
    ↓
Update Quiz State
    ↓
Render Questions
    ↓
Display to User
```

## Component Interaction

### Frontend Components

```
QuizPage (Main Container)
    │
    ├── QuizList (List View)
    │   ├── Course Cards
    │   ├── Start Quiz Button
    │   └── Generate New Button (✨)
    │
    ├── QuizTaking (Active Quiz)
    │   ├── Timer Component
    │   ├── Progress Bar
    │   ├── Question Display
    │   ├── Options Selection
    │   └── Navigation Buttons
    │
    └── QuizResults (Results View)
        ├── Score Display
        ├── Pass/Fail Badge
        ├── Answer Review
        └── Action Buttons
```

### Backend Components

```
QuizController
    │
    ├── Security (JWT Validation)
    │
    ├── QuizGenerationService
    │   │
    │   ├── Prompt Builder
    │   ├── OpenAIClient
    │   └── Response Parser
    │
    └── Response Builder
```

## State Management

### Frontend State

```typescript
// Quiz Page State
{
  enrolledCourses: Course[],
  quizzes: Quiz[],
  activeQuiz: Quiz | null,
  quizResult: QuizResult | null,
  quizMode: 'list' | 'taking' | 'results',
  generatingQuizId: string | null,
  attempts: Record<string, QuizResult>
}

// Quiz Taking State
{
  currentQuestion: number,
  answers: Record<string, number>,
  timeLeft: number,
  showConfirm: boolean
}
```

### Backend State

```java
// Request State
QuizGenerationRequest {
  String topic;
  String difficulty;
  int questionCount;
}

// Response State
QuizResponse {
  String topic;
  String difficulty;
  List<QuizQuestionDto> questions;
  LocalDateTime generatedAt;
}
```

## Security Flow

```
User Login
    ↓
Receive JWT Token
    ↓
Store in localStorage
    ↓
Include in API Requests
    Authorization: Bearer <token>
    ↓
Backend Validates Token
    ↓
Extract User ID
    ↓
Process Request
    ↓
Return Response
```

## Error Handling Flow

```
API Call
    ↓
Try Block
    ↓
Success? ──Yes──→ Parse Response ──→ Display Questions
    │
    No
    ↓
Catch Error
    ↓
Error Type?
    │
    ├── 401 Unauthorized ──→ "Session expired"
    ├── 429 Rate Limit ──→ "Too many requests"
    ├── Network Error ──→ "Connection failed"
    └── Other ──→ Use Fallback Questions
    ↓
Display Error Message
    ↓
Provide Retry Option
```

## Caching Strategy

### Current Implementation
- **No Caching**: Questions generated fresh each time
- **User Attempts**: Stored in localStorage per user
- **Fallback Questions**: Static questions in code

### Future Caching Strategy
```
Request Quiz
    ↓
Check Cache
    │
    ├── Cache Hit ──→ Return Cached Questions
    │
    └── Cache Miss
        ↓
        Generate New Questions
        ↓
        Store in Cache (TTL: 1 hour)
        ↓
        Return Questions
```

## Performance Optimization

### Current Bottlenecks
1. **LLM API Call**: 3-10 seconds
2. **JSON Parsing**: < 100ms
3. **Network Latency**: Varies

### Optimization Strategies
1. **Pre-generation**: Generate questions during off-peak hours
2. **Caching**: Store generated questions
3. **Parallel Requests**: Generate multiple quizzes simultaneously
4. **CDN**: Cache static assets
5. **Compression**: Gzip responses

## Scalability Considerations

### Current Capacity
- **Concurrent Users**: Limited by OpenRouter API rate limits
- **Questions per Hour**: Depends on API quota
- **Storage**: Minimal (no database storage yet)

### Scaling Strategy
```
Load Balancer
    │
    ├── Backend Instance 1
    ├── Backend Instance 2
    └── Backend Instance 3
        │
        ├── Redis Cache (Shared)
        ├── Database (Shared)
        └── OpenRouter API (Rate Limited)
```

## Monitoring Points

### Key Metrics to Track
1. **Generation Time**: Time to generate quiz
2. **Success Rate**: % of successful generations
3. **Error Rate**: % of failed requests
4. **User Engagement**: Quizzes taken per user
5. **API Usage**: OpenRouter API calls
6. **Cache Hit Rate**: % of cached responses

### Logging Points
```
Frontend:
- Quiz generation request
- API response time
- Error occurrences
- User actions

Backend:
- API endpoint hits
- LLM API calls
- Response parsing
- Error details
- Performance metrics
```

## Integration Points

### Current Integrations
1. **OpenRouter API**: LLM service
2. **JWT Authentication**: User validation
3. **Spring Security**: Authorization
4. **React Router**: Navigation

### Future Integrations
1. **Analytics Service**: Track user behavior
2. **Notification Service**: Quiz reminders
3. **Email Service**: Results sharing
4. **Database**: Question bank storage
5. **Cache Service**: Redis/Memcached

---

**Last Updated**: January 19, 2026
**Version**: 1.0
**Status**: Production Ready
