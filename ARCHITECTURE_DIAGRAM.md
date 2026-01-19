# Architecture Diagram - Quiz System

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     (React + TypeScript)                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYERS                            │
├─────────────────────────────────────────────────────────────────┤
│  Pages Layer                                                    │
│  ├─ Courses.tsx (Updated with DSA in Java content)            │
│  └─ Quiz.tsx (AI generation + Reset functionality)            │
├─────────────────────────────────────────────────────────────────┤
│  Service Layer                                                  │
│  ├─ apiService.ts (Existing - reused)                         │
│  └─ quizService.ts (NEW - AI quiz generation)                 │
├─────────────────────────────────────────────────────────────────┤
│  Data Layer                                                     │
│  └─ mock/data.ts (Updated with ELI10 content)                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                │
│                   (Spring Boot + Java)                          │
├─────────────────────────────────────────────────────────────────┤
│  Endpoints (Existing - Reused)                                 │
│  └─ POST /api/chat/ask                                         │
│     ├─ Authentication: Bearer Token                            │
│     ├─ Input: { message, conversationHistory }                │
│     └─ Output: { content, timestamp }                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      OPENROUTER API                             │
│                   (AI Service - External)                       │
├─────────────────────────────────────────────────────────────────┤
│  API Key: OPENROUTER_API_KEY (from .env)                      │
│  Model: GPT-4 or similar                                       │
│  Purpose: Generate quiz questions                              │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow - Quiz Generation

```
┌──────────────┐
│    User      │
│  Clicks      │
│  "Generate"  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Quiz.tsx                                                    │
│  ├─ handleGenerateNewQuiz(courseId)                        │
│  └─ setGeneratingQuizId(courseId) // Show loading          │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  quizService.ts                                              │
│  ├─ generateQuizQuestions(topic, difficulty, count)        │
│  ├─ buildQuizPrompt() // Create AI prompt                  │
│  └─ Call: POST /api/chat/ask                               │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Backend API                                                 │
│  ├─ Validate authentication                                 │
│  ├─ Forward to OpenRouter                                   │
│  └─ Return AI response                                      │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  OpenRouter API                                              │
│  ├─ Process prompt                                          │
│  ├─ Generate 5 quiz questions                              │
│  └─ Return JSON response                                    │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  quizService.ts                                              │
│  ├─ parseQuizResponse() // Extract questions               │
│  ├─ Validate JSON format                                    │
│  └─ Return QuizQuestion[]                                   │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Quiz.tsx                                                    │
│  ├─ Update quiz state with new questions                   │
│  ├─ setGeneratingQuizId(null) // Hide loading              │
│  └─ Display updated quiz card                              │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│    User      │
│  Sees New    │
│  Questions   │
└──────────────┘
```

## Data Flow - Reset Quiz

```
┌──────────────┐
│    User      │
│  Clicks      │
│  "Reset"     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  QuizTaking Component                                        │
│  └─ setShowResetConfirm(true) // Show modal                │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  Reset Confirmation Modal                                    │
│  ├─ Display warning message                                 │
│  ├─ "This will clear all answers..."                       │
│  └─ Buttons: [Cancel] [Reset Quiz]                         │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼ (User confirms)
┌──────────────────────────────────────────────────────────────┐
│  handleReset()                                               │
│  ├─ setAnswers({}) // Clear all answers                    │
│  ├─ setCurrentQuestion(0) // Back to first                 │
│  ├─ setTimeLeft(quiz.timeLimit * 60) // Reset timer        │
│  └─ setShowResetConfirm(false) // Close modal              │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│    User      │
│  Sees Clean  │
│  Quiz State  │
└──────────────┘
```

## Component Hierarchy

```
QuizPage (Main Container)
│
├─ QuizList (List View)
│  │
│  └─ QuizCard (For each enrolled course)
│     ├─ Course Info
│     ├─ Last Score (if attempted)
│     ├─ [Start Quiz] Button
│     └─ [✨ Generate] Button
│
├─ QuizTaking (Active Quiz)
│  │
│  ├─ Header
│  │  ├─ Question Counter
│  │  ├─ [Reset] Button
│  │  └─ Timer
│  │
│  ├─ Progress Bar
│  │
│  ├─ Question Card
│  │  ├─ Question Text
│  │  └─ 4 Option Buttons
│  │
│  ├─ Navigation
│  │  ├─ [Previous] Button
│  │  ├─ Question Dots
│  │  └─ [Next] / [Submit] Button
│  │
│  ├─ Submit Confirmation Modal
│  │  ├─ Answer Summary
│  │  ├─ [Review] Button
│  │  └─ [Submit] Button
│  │
│  └─ Reset Confirmation Modal
│     ├─ Warning Message
│     ├─ [Cancel] Button
│     └─ [Reset Quiz] Button
│
└─ QuizResults (Results View)
   │
   ├─ Score Header
   │  ├─ Pass/Fail Badge
   │  ├─ Score Percentage
   │  └─ Correct/Incorrect Count
   │
   ├─ Answer Review
   │  └─ For each question:
   │     ├─ Question Text
   │     ├─ All Options (highlighted)
   │     └─ Explanation
   │
   └─ Actions
      ├─ [Back to Quizzes] Button
      └─ [Retake Quiz] Button
```

## State Management

```
QuizPage State
├─ enrolledCourses: Course[]
├─ loading: boolean
├─ quizzes: Quiz[]
├─ activeQuiz: Quiz | null
├─ quizResult: QuizResult | null
├─ attempts: Record<string, QuizResult>
├─ quizMode: 'list' | 'taking' | 'results'
└─ generatingQuizId: string | null

QuizTaking State
├─ currentQuestion: number
├─ answers: Record<string, number>
├─ timeLeft: number (seconds)
├─ showConfirm: boolean
└─ showResetConfirm: boolean

LocalStorage
├─ auth_token: string
└─ quiz_attempts: Record<string, QuizResult>
```

## Service Layer Architecture

```
quizService.ts
│
├─ Public Methods
│  └─ generateQuizQuestions(topic, difficulty, count)
│     ├─ Validates input
│     ├─ Calls backend API
│     ├─ Parses response
│     └─ Returns QuizQuestion[]
│
├─ Private Methods
│  ├─ buildQuizPrompt(topic, difficulty, count)
│  │  └─ Creates AI prompt with requirements
│  │
│  ├─ parseQuizResponse(content)
│  │  ├─ Extracts JSON from response
│  │  ├─ Validates question format
│  │  └─ Adds unique IDs
│  │
│  └─ getFallbackQuestions(topic)
│     └─ Returns static questions for topic
│
└─ Error Handling
   ├─ Network errors → Fallback questions
   ├─ Parse errors → Fallback questions
   └─ API errors → User-friendly message
```

## API Integration Flow

```
Frontend                Backend              OpenRouter
   │                       │                     │
   │  POST /api/chat/ask   │                     │
   ├──────────────────────>│                     │
   │  + Auth Token         │                     │
   │  + Quiz Prompt        │                     │
   │                       │  Forward Request    │
   │                       ├────────────────────>│
   │                       │  + API Key          │
   │                       │  + Prompt           │
   │                       │                     │
   │                       │  AI Response        │
   │                       │<────────────────────┤
   │                       │  + Generated Qs     │
   │  Response             │                     │
   │<──────────────────────┤                     │
   │  + Questions JSON     │                     │
   │                       │                     │
   ▼                       ▼                     ▼
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Try: Generate Quiz Questions                              │
└─────┬───────────────────────────────────────────────────────┘
      │
      ├─ Success ──────────────────────────────────────────┐
      │                                                     │
      │                                                     ▼
      │                                          ┌──────────────────┐
      │                                          │ Display Questions│
      │                                          └──────────────────┘
      │
      ├─ Network Error ────────────────────────────────────┐
      │                                                     │
      │                                                     ▼
      │                                          ┌──────────────────┐
      │                                          │ Use Fallback Qs  │
      │                                          │ Show Error Msg   │
      │                                          └──────────────────┘
      │
      ├─ Parse Error ──────────────────────────────────────┐
      │                                                     │
      │                                                     ▼
      │                                          ┌──────────────────┐
      │                                          │ Use Fallback Qs  │
      │                                          │ Log Error        │
      │                                          └──────────────────┘
      │
      └─ API Error ────────────────────────────────────────┐
                                                            │
                                                            ▼
                                                 ┌──────────────────┐
                                                 │ Use Fallback Qs  │
                                                 │ Show Error Msg   │
                                                 └──────────────────┘
```

## Course Data Structure

```
Course (DSA in Java)
├─ id: string
├─ title: string (e.g., "DSA in Java - Arrays")
├─ description: string (ELI10 style)
├─ difficulty: 'beginner' | 'intermediate' | 'advanced'
├─ duration: number (minutes)
├─ chapters: Chapter[]
│  └─ Chapter
│     ├─ id: string
│     ├─ title: string (e.g., "Array Basics in Java")
│     ├─ description: string (ELI10 style)
│     ├─ order: number
│     ├─ lessons: Lesson[]
│     │  └─ Lesson
│     │     ├─ id: string
│     │     ├─ title: string
│     │     ├─ content: string (markdown)
│     │     ├─ order: number
│     │     ├─ duration: number
│     │     ├─ completed: boolean
│     │     └─ unlocked: boolean
│     ├─ progress: number (0-100)
│     └─ unlocked: boolean
├─ progress: number (0-100)
└─ enrolledAt?: string (ISO date)
```

## Quiz Data Structure

```
Quiz
├─ id: string
├─ courseId: string
├─ courseTitle: string
├─ title: string
├─ description: string
├─ questions: QuizQuestion[]
│  └─ QuizQuestion
│     ├─ id: string
│     ├─ question: string
│     ├─ options: string[] (4 options)
│     ├─ correctAnswer: number (0-3)
│     └─ explanation: string
├─ timeLimit: number (minutes)
└─ passingScore: number (percentage)

QuizResult
├─ score: number (percentage)
├─ totalQuestions: number
├─ correctAnswers: number
├─ passed: boolean
└─ answers: Array<{
   ├─ questionId: string
   ├─ selectedAnswer: number
   └─ isCorrect: boolean
}>
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND                               │
├─────────────────────────────────────────────────────────────┤
│  Framework:     React 18.3.1                               │
│  Language:      TypeScript 5.5.3                           │
│  Build Tool:    Vite 5.4.2                                 │
│  Styling:       Tailwind CSS 3.4.1                         │
│  State:         Zustand 4.4.7                              │
│  Routing:       React Router 6.20.1                        │
│  Markdown:      React Markdown 9.0.1                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      BACKEND                                │
├─────────────────────────────────────────────────────────────┤
│  Framework:     Spring Boot 3.x                            │
│  Language:      Java 17+                                   │
│  Database:      PostgreSQL / H2                            │
│  Security:      Spring Security + JWT                      │
│  API Docs:      Swagger / OpenAPI                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                         │
├─────────────────────────────────────────────────────────────┤
│  AI Service:    OpenRouter API                             │
│  Model:         GPT-4 or similar                           │
│  Purpose:       Quiz question generation                   │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTION                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────┐          │
│  │   Frontend      │         │    Backend      │          │
│  │   (Vite Build)  │◄───────►│  (Spring Boot)  │          │
│  │   Port: 4173    │         │   Port: 8080    │          │
│  └─────────────────┘         └────────┬────────┘          │
│                                        │                    │
│                                        ▼                    │
│                              ┌─────────────────┐           │
│                              │   PostgreSQL    │           │
│                              │   Database      │           │
│                              └─────────────────┘           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   OpenRouter API      │
                    │   (External Service)  │
                    └───────────────────────┘
```

---

**Legend:**
- `│` : Vertical connection
- `├─` : Branch point
- `└─` : End point
- `▼` : Data flow direction
- `◄─►` : Bidirectional communication
- `───>` : Unidirectional flow
