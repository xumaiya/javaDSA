# Dynamic Quiz Generation Feature

## Overview

The quiz feature dynamically generates questions using OpenRouter LLM based on the course topic. Questions are generated with **medium difficulty** for all topics to provide a balanced challenge.

## How It Works

### 1. Frontend Flow

When a user accesses the quiz page:

1. **Course Detection**: The system identifies enrolled courses
2. **Topic Extraction**: Extracts the topic from course title (e.g., "DSA in Java - Arrays" → "Arrays")
3. **Quiz Generation**: Calls the backend API to generate 5 medium-difficulty questions
4. **Display**: Shows the generated quiz with a 10-minute timer
5. **Results**: Provides detailed feedback with explanations for each answer

### 2. Backend Architecture

#### QuizController (`/api/quiz/generate`)
- Handles quiz generation requests
- Validates user authentication
- Returns generated questions in structured format

#### QuizGenerationService
- Communicates with OpenRouter LLM
- Generates questions based on:
  - **Topic**: Extracted from course (Arrays, Linked Lists, Stacks, etc.)
  - **Difficulty**: Always set to "intermediate" (medium)
  - **Count**: 5 questions per quiz
- Parses LLM response into structured quiz format

#### OpenAIClient
- Manages OpenRouter API communication
- Uses configured model (default: `openai/gpt-3.5-turbo`)
- Handles errors and timeouts

### 3. Question Generation

Each generated question includes:
- **Question text**: Clear, focused on the topic
- **4 options**: Multiple choice answers
- **Correct answer**: Index (0-3) of the correct option
- **Explanation**: Educational explanation of why the answer is correct

#### Question Types
- Conceptual understanding
- Code analysis
- Problem-solving scenarios
- Practical application

## API Endpoints

### Generate Quiz
```http
POST /api/quiz/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "Arrays",
  "difficulty": "intermediate",
  "questionCount": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "topic": "Arrays",
    "difficulty": "intermediate",
    "questions": [
      {
        "id": "q_abc123",
        "question": "What is the time complexity of accessing an element by index in an array?",
        "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        "correctAnswer": 0,
        "explanation": "Arrays provide constant time O(1) access because elements are stored in contiguous memory locations."
      }
    ],
    "generatedAt": "2024-01-19T10:30:00"
  },
  "message": "Successfully generated 5 quiz questions"
}
```

## Frontend Components

### QuizPage (`src/pages/Quiz.tsx`)
Main quiz interface with three modes:
1. **List Mode**: Shows available quizzes for enrolled courses
2. **Taking Mode**: Interactive quiz with timer and progress tracking
3. **Results Mode**: Detailed feedback with explanations

### QuizService (`src/services/quizService.ts`)
Handles API communication:
- `generateQuizQuestions()`: Calls backend to generate questions
- `getFallbackQuestions()`: Provides static questions if API fails

## Features

### 1. Dynamic Generation
- Questions are generated fresh each time
- "Generate New Quiz" button (sparkle icon) creates new questions
- Questions adapt to the specific topic

### 2. Progress Tracking
- Visual progress bar
- Question navigation (numbered buttons)
- Answered question indicators

### 3. Timer
- 10-minute countdown
- Auto-submit when time expires
- Warning when < 1 minute remains

### 4. Results & Feedback
- Score percentage
- Correct/incorrect count
- Pass/fail status (60% passing score)
- Detailed answer review with explanations

### 5. User Isolation
- Quiz attempts stored per user
- Separate localStorage keys for each user
- Progress persists across sessions

## Configuration

### Backend Configuration (`application.properties`)
```properties
# OpenRouter API Configuration
openai.api-key=${OPENROUTER_API_KEY}
openai.base-url=https://openrouter.ai/api/v1
openai.chat-model=openai/gpt-3.5-turbo
openai.max-tokens=2000
openai.temperature=0.7
```

### Environment Variables
```bash
# Required
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here

# Optional (has defaults)
JWT_SECRET=your-jwt-secret
```

## Usage

### For Students

1. **Enroll in a course** from the Courses page
2. **Navigate to Quiz** page from the sidebar
3. **Click "Start Quiz"** on any enrolled course
4. **Answer questions** within the 10-minute time limit
5. **Submit** to see results and explanations
6. **Retake** to improve your score
7. **Generate new questions** using the sparkle button for fresh challenges

### For Developers

#### Adding New Topics
Topics are automatically extracted from course titles. No code changes needed!

#### Customizing Difficulty
To change difficulty level, modify `Quiz.tsx`:
```typescript
const questions = await quizService.generateQuizQuestions(
  topic,
  'beginner', // Change to: 'beginner', 'intermediate', or 'advanced'
  5
);
```

#### Adjusting Question Count
Modify the `questionCount` parameter (3-10 questions):
```typescript
const questions = await quizService.generateQuizQuestions(
  topic,
  'intermediate',
  7 // Change to desired count (3-10)
);
```

## Error Handling

### Fallback Questions
If AI generation fails, the system uses pre-defined fallback questions for common topics:
- Arrays
- Linked Lists
- Stacks
- Queues
- Trees

### Error Messages
- **Authentication Required**: User must log in
- **Session Expired**: Token expired, re-login needed
- **Connection Error**: Backend unreachable
- **Generation Failed**: LLM API error, fallback used

## Testing

### Manual Testing
1. Start backend: `cd backend && ./mvnw spring-boot:run`
2. Start frontend: `npm run dev`
3. Login with test account
4. Enroll in a course
5. Navigate to Quiz page
6. Generate and take a quiz

### API Testing (Postman/curl)
```bash
# Login first
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Generate quiz (use token from login)
curl -X POST http://localhost:8080/api/quiz/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"topic":"Arrays","difficulty":"intermediate","questionCount":5}'
```

## Performance

- **Generation Time**: 3-10 seconds per quiz (depends on LLM API)
- **Caching**: Not implemented (each generation is fresh)
- **Rate Limiting**: Handled by OpenRouter API limits

## Future Enhancements

1. **Difficulty Selection**: Let users choose difficulty level
2. **Question Bank**: Cache generated questions for reuse
3. **Analytics**: Track which questions are most challenging
4. **Adaptive Difficulty**: Adjust based on user performance
5. **Timed Challenges**: Speed-based scoring
6. **Multiplayer**: Compete with other students
7. **Custom Topics**: Allow users to request specific subtopics

## Troubleshooting

### Quiz Not Generating
1. Check OpenRouter API key is set in `.env`
2. Verify backend is running
3. Check browser console for errors
4. Ensure user is logged in

### Questions Don't Match Topic
1. Verify course title format: "DSA in Java - [Topic]"
2. Check topic extraction in `generateQuizForCourse()`
3. Review LLM prompt in `QuizGenerationService`

### Slow Generation
1. Check OpenRouter API status
2. Consider using faster model (e.g., `gpt-3.5-turbo`)
3. Reduce `maxTokens` in configuration

## Support

For issues or questions:
1. Check backend logs: `backend/logs/`
2. Check browser console for frontend errors
3. Review OpenRouter API dashboard for usage/errors
4. Consult documentation: `/docs/`
