# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start Backend
```bash
cd backend
./mvnw spring-boot:run
```
✅ Backend running on http://localhost:8080

### 2. Start Frontend
```bash
npm run dev
```
✅ Frontend running on http://localhost:5173

### 3. Test Features
- Navigate to http://localhost:5173
- Login or register
- Go to Courses → Enroll in a course
- Go to Quizzes → Try AI-generated questions!

---

## 📋 Quick Commands

### Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend
```bash
# Start backend
cd backend && ./mvnw spring-boot:run

# Run tests
./mvnw test

# Clean build
./mvnw clean package
```

---

## 🎯 Test the New Features

### 1. View DSA in Java Courses
```
1. Go to http://localhost:5173/courses
2. See 7 new courses with ELI10 descriptions
3. Click "Enroll Now" on any course
```

### 2. Try AI-Generated Quizzes
```
1. Go to http://localhost:5173/quiz
2. Click "Start Quiz" on any enrolled course
3. Wait 2-5 seconds for AI to generate questions
4. Answer the questions
```

### 3. Generate Fresh Questions
```
1. On quiz list page
2. Click the sparkle (✨) icon
3. Wait for new questions to generate
4. Start quiz with fresh content
```

### 4. Reset Quiz Mid-Test
```
1. Start a quiz
2. Answer 2-3 questions
3. Click "Reset" button
4. Confirm in modal
5. See clean state with timer reset
```

---

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Check if port 8080 is in use
netstat -ano | findstr :8080

# Kill process if needed
taskkill /PID <process_id> /F

# Restart backend
cd backend && ./mvnw spring-boot:run
```

### Frontend Won't Start
```bash
# Check if port 5173 is in use
netstat -ano | findstr :5173

# Kill process if needed
taskkill /PID <process_id> /F

# Clear cache and restart
rm -rf node_modules
npm install
npm run dev
```

### Quiz Generation Fails
```bash
# Check backend logs
cd backend
tail -f logs/application.log

# Verify OpenRouter API key
cat .env | grep OPENROUTER

# Test backend endpoint
curl -X POST http://localhost:8080/api/chat/ask \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message":"test"}'
```

### TypeScript Errors
```bash
# Run type check
npm run typecheck

# If errors, check:
# - src/pages/Quiz.tsx
# - src/services/quizService.ts
# - src/mock/data.ts
```

---

## 📁 Important Files

### Modified Files
```
src/mock/data.ts              - Course content (DSA in Java)
src/pages/Quiz.tsx             - Quiz page with AI generation
src/components/ui/Card.tsx     - Card component with style prop
```

### New Files
```
src/services/quizService.ts    - AI quiz generation service
```

### Documentation
```
QUIZ_UPDATE_SUMMARY.md         - Technical details
IMPLEMENTATION_GUIDE.md        - Usage guide
BEFORE_AFTER_COMPARISON.md     - Visual examples
DEPLOYMENT_CHECKLIST.md        - Deployment steps
ARCHITECTURE_DIAGRAM.md        - System architecture
FINAL_SUMMARY.md               - Complete overview
QUICK_START.md                 - This file
```

---

## 🎓 Course Topics

1. **Arrays** - Lockers at school analogy
2. **Linked Lists** - Treasure hunt analogy
3. **Stacks & Queues** - Plates and lunch line
4. **Trees** - Family tree upside down
5. **Hashing** - Magic filing system
6. **Heaps** - Self-updating leaderboard
7. **Graphs** - Maps with cities and roads

---

## 🧪 Testing Checklist

### Course Content
- [ ] Navigate to /courses
- [ ] See 7 DSA courses
- [ ] Read ELI10 descriptions
- [ ] Enroll in a course

### Quiz Generation
- [ ] Navigate to /quiz
- [ ] Click "Start Quiz"
- [ ] Wait for AI generation
- [ ] See 5 relevant questions

### Reset Functionality
- [ ] Start a quiz
- [ ] Answer some questions
- [ ] Click "Reset"
- [ ] Confirm reset
- [ ] Verify clean state

### Error Handling
- [ ] Stop backend
- [ ] Try generating quiz
- [ ] See fallback questions
- [ ] See error message

---

## 🔐 Environment Variables

### Backend (.env)
```bash
OPENROUTER_API_KEY=sk-or-v1-...
JWT_SECRET=your-secret-key
```

### Frontend (Optional)
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 📊 Expected Behavior

### Quiz Generation Time
- **Normal:** 2-5 seconds
- **Slow:** 5-10 seconds (high load)
- **Timeout:** > 30 seconds (check connection)

### Fallback Triggers
- Network error
- API timeout
- Parse error
- Invalid response

### Reset Behavior
- Clears all answers
- Resets timer to full time
- Returns to question 1
- Keeps same questions

---

## 🎯 Success Indicators

### ✅ Everything Working
- Backend starts without errors
- Frontend loads at localhost:5173
- Can login/register
- Courses show ELI10 descriptions
- Quiz generation works (2-5 sec)
- Reset button clears state
- Fallback questions available

### ⚠️ Something Wrong
- Backend won't start
- Frontend shows errors
- Quiz generation fails
- Reset doesn't work
- No fallback questions

---

## 📞 Need Help?

### Check These First
1. Backend logs: `backend/logs/application.log`
2. Browser console: F12 → Console tab
3. Network tab: F12 → Network tab
4. Environment variables: `backend/.env`

### Common Solutions
- Clear browser cache
- Restart backend
- Restart frontend
- Check API key
- Verify ports available

---

## 🎉 You're Ready!

Everything is set up and ready to use. Enjoy the new DSA in Java courses and AI-powered quizzes!

**Happy Learning! 🚀**
