# Quiz Feature - Quick Start Guide

## ✨ What's New

The quiz page now **dynamically generates questions** using OpenRouter LLM based on the course topic! Questions are generated with **medium difficulty** to provide a balanced challenge.

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
./mvnw spring-boot:run
```

### 2. Start the Frontend
```bash
npm run dev
```

### 3. Test the Feature

1. **Login** to your account (or register a new one)
2. **Enroll** in a course from the Courses page
3. **Navigate** to the Quiz page (sidebar)
4. **Click "Start Quiz"** on any enrolled course
5. **Answer questions** - you have 10 minutes!
6. **Submit** to see your results with detailed explanations

## 🎯 Key Features

### Dynamic Question Generation
- Questions are generated fresh using AI
- Based on the specific course topic (Arrays, Linked Lists, etc.)
- Medium difficulty level for balanced challenge
- 5 questions per quiz

### Interactive Quiz Experience
- 10-minute timer with countdown
- Visual progress tracking
- Question navigation
- Auto-submit when time expires

### Detailed Feedback
- Score percentage and pass/fail status
- Correct/incorrect answer count
- Detailed explanations for each question
- Review all questions after submission

### Generate New Questions
- Click the **sparkle icon** (✨) to generate fresh questions
- Get different questions each time
- Perfect for practice and learning

## 📝 Example Topics

The system automatically generates questions for:
- **Arrays** - Array operations, indexing, complexity
- **Linked Lists** - Node structure, operations, types
- **Stacks & Queues** - LIFO/FIFO, operations, applications
- **Trees** - Binary trees, BST, traversals
- **Hash Tables** - Hashing, collisions, HashMap
- **Heaps** - Heap properties, priority queues
- **Graphs** - Graph representation, traversals, algorithms

## 🔧 Configuration

### Required Environment Variable
Make sure your `backend/.env` file has:
```env
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

### Default Settings
- **Difficulty**: Medium (intermediate)
- **Questions**: 5 per quiz
- **Time Limit**: 10 minutes
- **Passing Score**: 60%

## 🎨 UI Features

### Quiz List View
- Glass morphism design
- Course-specific quizzes
- Last attempt score display
- Pass/fail badges
- Generate new questions button (sparkle icon)

### Quiz Taking View
- Clean, focused interface
- Progress bar
- Timer with warning at < 1 minute
- Question navigation buttons
- Answer selection with visual feedback

### Results View
- Celebration/encouragement message
- Score breakdown
- Question-by-question review
- Color-coded correct/incorrect answers
- Educational explanations

## 🐛 Troubleshooting

### Quiz Not Loading?
1. Check backend is running on `http://localhost:8080`
2. Verify you're logged in
3. Make sure you're enrolled in at least one course

### Questions Not Generating?
1. Check `OPENROUTER_API_KEY` in `backend/.env`
2. Look at backend console for errors
3. Check browser console for API errors
4. Fallback questions will be used if generation fails

### Slow Generation?
- First generation may take 5-10 seconds
- This is normal - AI is generating custom questions!
- Subsequent generations should be faster

## 📊 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads successfully
- [ ] Can login/register
- [ ] Can enroll in a course
- [ ] Quiz page shows enrolled courses
- [ ] Can start a quiz
- [ ] Questions are displayed correctly
- [ ] Timer counts down
- [ ] Can select answers
- [ ] Can navigate between questions
- [ ] Can submit quiz
- [ ] Results show correctly
- [ ] Explanations are displayed
- [ ] Can retake quiz
- [ ] Can generate new questions (sparkle button)
- [ ] New questions are different

## 🎓 For Developers

### Backend Files
- `QuizController.java` - REST endpoint
- `QuizGenerationService.java` - LLM integration
- `QuizGenerationRequest.java` - Request DTO
- `QuizResponse.java` - Response DTO

### Frontend Files
- `src/pages/Quiz.tsx` - Main quiz UI
- `src/services/quizService.ts` - API client

### API Endpoint
```
POST /api/quiz/generate
Authorization: Bearer <token>

{
  "topic": "Arrays",
  "difficulty": "intermediate",
  "questionCount": 5
}
```

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Quiz page loads with your enrolled courses
2. ✅ Clicking "Start Quiz" shows 5 questions
3. ✅ Questions are relevant to the course topic
4. ✅ Timer counts down from 10:00
5. ✅ Submitting shows results with explanations
6. ✅ Sparkle button generates new questions

## 📚 Documentation

For detailed documentation, see:
- `docs/QUIZ_FEATURE_GUIDE.md` - Complete feature documentation
- `docs/CODE_EXECUTION_README.md` - Code editor integration
- `README.md` - Project overview

## 🤝 Need Help?

1. Check backend logs for errors
2. Check browser console (F12)
3. Verify OpenRouter API key is valid
4. Review the troubleshooting section above

---

**Happy Learning! 🚀**
