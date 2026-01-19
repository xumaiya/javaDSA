# Quiz AI Generation Debugging Guide

## 🔧 Issue Fixed

**Problem:** Quiz questions were using fallback questions instead of AI-generated ones.

**Root Cause:** The `quizService` was using the wrong localStorage key for the auth token.

**Fix Applied:**
```typescript
// BEFORE (Wrong)
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');  // ❌ Wrong key
};

// AFTER (Correct)
import { STORAGE_KEYS } from '../utils/constants';

const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);  // ✅ Correct key
};
```

---

## 🧪 How to Test

### Step 1: Clear Browser Cache
```javascript
// Open browser console (F12)
localStorage.clear();
location.reload();
```

### Step 2: Login
1. Go to http://localhost:5173
2. Login with your credentials
3. Open browser console (F12)

### Step 3: Check Auth Token
```javascript
// In browser console
console.log('Auth token:', localStorage.getItem('dsa_platform_auth_token'));
// Should show: "mock_token_..." or similar
```

### Step 4: Enroll in a Course
1. Go to `/courses`
2. Click "Enroll Now" on any course
3. Verify enrollment successful

### Step 5: Go to Quiz Page
1. Navigate to `/quiz`
2. **Watch the browser console** for these logs:

**Expected Console Output:**
```
Generating quiz for course: DSA in Java - Arrays (ID: 1, Topic: Arrays)
Calling quizService.generateQuizQuestions...
Generating 5 quiz questions for topic: Arrays (beginner)
Calling backend API: http://localhost:8080/api/chat/ask
API response status: 200
Received AI response, parsing questions...
Successfully generated 5 questions
✅ Successfully generated 5 AI questions for Arrays
```

**If Using Fallback (Error):**
```
❌ Failed to generate AI quiz for Arrays: Error: ...
Using fallback questions for Arrays
```

---

## 🔍 Debugging Steps

### Check 1: Backend Running?
```bash
# Check if backend is accessible
curl http://localhost:8080/api/chat/ask

# Should return 401 (unauthorized) or 403 (forbidden)
# NOT connection refused
```

### Check 2: Auth Token Present?
```javascript
// In browser console
const token = localStorage.getItem('dsa_platform_auth_token');
console.log('Token exists:', !!token);
console.log('Token value:', token);

// Should show:
// Token exists: true
// Token value: mock_token_1_1737234567890
```

### Check 3: Manual API Test
```javascript
// In browser console
const token = localStorage.getItem('dsa_platform_auth_token');

fetch('http://localhost:8080/api/chat/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    message: 'Generate 2 quiz questions about Arrays in Java',
    conversationHistory: []
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ API Response:', data);
})
.catch(err => {
  console.error('❌ API Error:', err);
});
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "chat_123",
    "content": "{ \"questions\": [...] }",
    "timestamp": "2026-01-18T..."
  }
}
```

### Check 4: OpenRouter API Key
```bash
# In backend terminal or .env file
cat backend/.env | grep OPENROUTER

# Should show:
# OPENROUTER_API_KEY=sk-or-v1-...
```

### Check 5: Backend Logs
```bash
# Watch backend logs
cd backend
tail -f logs/application.log

# Or check console output
# Look for:
# - "Processing question for user..."
# - "Retrieved X similar chunks..."
# - Any error messages
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Authentication required"
**Symptom:** Console shows "No auth token found"

**Solution:**
```javascript
// Check if logged in
const auth = JSON.parse(localStorage.getItem('auth-storage'));
console.log('User:', auth?.state?.user);
console.log('Token:', auth?.state?.token);

// If no user, login again
// If user exists but no token in dsa_platform_auth_token:
localStorage.setItem('dsa_platform_auth_token', auth.state.token);
location.reload();
```

### Issue 2: "Unable to connect to server"
**Symptom:** Console shows fetch error

**Solution:**
```bash
# 1. Check backend is running
curl http://localhost:8080/actuator/health

# 2. Check CORS settings
# Backend should allow localhost:5173

# 3. Restart backend
cd backend
./mvnw spring-boot:run
```

### Issue 3: "Failed to generate quiz questions"
**Symptom:** API returns 500 or error

**Solution:**
```bash
# Check backend logs for errors
cd backend
cat logs/application.log | grep ERROR

# Common causes:
# - OpenRouter API key invalid
# - OpenRouter API rate limit
# - Network issue

# Test OpenRouter directly:
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-3.5-turbo","messages":[{"role":"user","content":"test"}]}'
```

### Issue 4: Questions Still Using Fallback
**Symptom:** Console shows "Using fallback questions"

**Solution:**
1. Check all previous issues
2. Clear browser cache completely
3. Hard refresh (Ctrl+Shift+R)
4. Check console for specific error
5. Verify backend logs show the request

---

## 📊 Expected Behavior

### Successful AI Generation Flow

```
1. User navigates to /quiz
   └─> Console: "Generating quiz for course: ..."

2. Quiz service called
   └─> Console: "Calling quizService.generateQuizQuestions..."
   └─> Console: "Generating 5 quiz questions for topic: Arrays (beginner)"

3. API request sent
   └─> Console: "Calling backend API: http://localhost:8080/api/chat/ask"
   └─> Network tab shows POST request

4. Backend processes
   └─> Backend logs: "Processing question for user X"
   └─> Backend logs: "Retrieved Y similar chunks"

5. AI generates response
   └─> Takes 2-5 seconds
   └─> Backend logs: "Updated chat log with response"

6. Frontend receives response
   └─> Console: "API response status: 200"
   └─> Console: "Received AI response, parsing questions..."

7. Questions parsed
   └─> Console: "Successfully generated 5 questions"
   └─> Console: "✅ Successfully generated 5 AI questions for Arrays"

8. Quiz displayed
   └─> User sees quiz card with AI-generated questions
```

### Fallback Flow (When AI Fails)

```
1. User navigates to /quiz
   └─> Console: "Generating quiz for course: ..."

2. Quiz service called
   └─> Console: "Calling quizService.generateQuizQuestions..."

3. Error occurs
   └─> Console: "❌ Failed to generate AI quiz for Arrays: Error: ..."
   └─> Console: "Using fallback questions for Arrays"

4. Fallback questions used
   └─> User sees quiz card with static fallback questions
   └─> Questions are still relevant but not AI-generated
```

---

## 🎯 Verification Checklist

After fixing, verify these:

- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] User logged in successfully
- [ ] Auth token in localStorage (`dsa_platform_auth_token`)
- [ ] Course enrolled
- [ ] Navigate to /quiz
- [ ] Console shows "Calling backend API"
- [ ] Console shows "API response status: 200"
- [ ] Console shows "Successfully generated X questions"
- [ ] Quiz questions are different from fallback
- [ ] Questions are relevant to topic
- [ ] Questions are in ELI10 style

---

## 🔬 Advanced Debugging

### Enable Verbose Logging

**Frontend:**
```typescript
// In src/services/quizService.ts
// Already added console.log statements

// To see more:
localStorage.setItem('debug', 'true');
```

**Backend:**
```yaml
# In backend/src/main/resources/application.yml
logging:
  level:
    com.dsaplatform: DEBUG
    org.springframework.web: DEBUG
```

### Monitor Network Traffic

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "ask"
4. Watch for POST to `/api/chat/ask`
5. Check:
   - Request headers (Authorization present?)
   - Request payload (prompt correct?)
   - Response status (200?)
   - Response body (contains questions?)

### Test Prompt Directly

```javascript
// Test the exact prompt being sent
const prompt = `Generate 5 multiple-choice quiz questions about Arrays in Java for beginner level students.

IMPORTANT: You MUST respond with ONLY valid JSON in this exact format, with no additional text before or after:

{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation of why this answer is correct"
    }
  ]
}

Requirements:
- Each question should test understanding of Arrays concepts in Java
- Provide exactly 4 options for each question
- correctAnswer should be the index (0-3) of the correct option
- Make questions appropriate for beginner level
- Include clear explanations
- Focus on practical Java DSA concepts
- Use simple, clear language (ELI10 style for beginner)

Generate 5 questions now in the JSON format above.`;

console.log('Prompt:', prompt);

// Send to backend
const token = localStorage.getItem('dsa_platform_auth_token');
fetch('http://localhost:8080/api/chat/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    message: prompt,
    conversationHistory: []
  })
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

---

## ✅ Success Indicators

You'll know it's working when:

1. **Console shows AI generation logs**
   ```
   ✅ Successfully generated 5 AI questions for Arrays
   ```

2. **Questions are unique**
   - Different from fallback questions
   - Different each time you regenerate

3. **Questions are relevant**
   - About the specific topic (Arrays, Linked Lists, etc.)
   - Appropriate difficulty level
   - In ELI10 style

4. **Network tab shows successful API call**
   - POST to `/api/chat/ask`
   - Status 200
   - Response contains question data

5. **Backend logs show processing**
   ```
   Processing question for user X
   Retrieved Y similar chunks
   Updated chat log with response
   ```

---

## 📞 Still Not Working?

If you've tried everything and it's still using fallback questions:

1. **Share Console Output**
   - Copy all console logs
   - Share the error messages

2. **Share Network Tab**
   - Screenshot of the API request
   - Show request/response details

3. **Share Backend Logs**
   - Last 50 lines of backend console
   - Any ERROR or WARN messages

4. **Check These Files**
   ```bash
   # Verify changes applied
   cat src/services/quizService.ts | grep "STORAGE_KEYS"
   # Should show: import { STORAGE_KEYS }
   
   cat src/services/quizService.ts | grep "getAuthToken"
   # Should show: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
   ```

---

**Last Updated:** January 18, 2026

**Status:** ✅ Fix Applied - Ready for Testing
