# Quiz Feature Test Guide

## Steps to Test

### 1. Start Backend
```bash
cd backend
./mvnw spring-boot:run
```

Wait for: `Started DsaLearningPlatformApplication`

### 2. Start Frontend
```bash
npm run dev
```

### 3. Test in Browser

1. Open browser console (F12)
2. Go to `http://localhost:5173`
3. Login with your account
4. Enroll in a course (e.g., "DSA in Java - Arrays")
5. Go to Quiz page
6. Watch the console logs - you should see:
   ```
   ✅ [useEffect] User is authenticated, loading courses...
   📚 [loadCourses] Found enrolled courses: X
   🚀 [loadCourses] Generating quizzes for X courses...
   🎯 [generateQuizForCourse] Starting quiz generation for course: DSA in Java - Arrays
   📝 [generateQuizForCourse] Extracted topic: Arrays
   🚀 [generateQuizForCourse] Calling quizService.generateQuizQuestions...
   🎯 [QuizService] Starting quiz generation...
   📝 [QuizService] Topic: Arrays
   📊 [QuizService] Difficulty: intermediate
   🔢 [QuizService] Question Count: 5
   ✅ [QuizService] Auth token found: ...
   🌐 [QuizService] API URL: http://localhost:8080/api/quiz/generate
   📤 [QuizService] Sending request...
   📦 [QuizService] Request body: {...}
   📥 [QuizService] Response status: 200
   📥 [QuizService] Response ok: true
   ✅ [QuizService] Received response data: {...}
   ✅ [QuizService] Question 1: ...
   🎉 [QuizService] Successfully generated 5 AI questions!
   ✅ [generateQuizForCourse] Successfully generated 5 AI questions for Arrays
   ```

7. If you see errors, check:
   - Is backend running?
   - Is OpenRouter API key set in `backend/.env`?
   - Are you logged in?
   - Check the error message in console

### 4. Click "Start Quiz"

You should see 5 AI-generated questions about Arrays with medium difficulty.

### 5. Click the Sparkle Button (✨)

This will generate NEW questions. Watch console for:
```
🔄 [handleGenerateNewQuiz] Generating new quiz for course: 1
📚 [handleGenerateNewQuiz] Found course: DSA in Java - Arrays
... (same generation logs)
✅ [handleGenerateNewQuiz] Successfully generated new quiz for DSA in Java - Arrays
```

## Common Issues

### Issue: Seeing static/fallback questions
**Cause**: API call is failing
**Solution**: Check console for error messages. Likely causes:
- Backend not running
- OpenRouter API key not set
- Network error

### Issue: "Authentication required"
**Cause**: Not logged in or token expired
**Solution**: Login again

### Issue: "Quiz endpoint not found"
**Cause**: Backend not running or wrong URL
**Solution**: 
- Check backend is running on port 8080
- Check `src/utils/constants.ts` has correct API_BASE_URL

### Issue: "Failed to generate quiz"
**Cause**: OpenRouter API error
**Solution**: 
- Check `backend/.env` has valid OPENROUTER_API_KEY
- Check backend logs for OpenRouter API errors

## Expected Behavior

✅ Questions are different each time you generate
✅ Questions are about the specific topic (Arrays, Linked Lists, etc.)
✅ Questions are medium difficulty
✅ 5 questions per quiz
✅ Each question has 4 options
✅ Each question has an explanation

## Debug Checklist

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Logged in to the application
- [ ] Enrolled in at least one course
- [ ] Browser console open (F12)
- [ ] OpenRouter API key set in backend/.env
- [ ] No errors in backend console
- [ ] No errors in browser console
