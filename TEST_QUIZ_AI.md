# Quick Test: Quiz AI Generation

## 🚀 Quick Test Steps

### 1. Start Services
```bash
# Terminal 1: Backend
cd backend
./mvnw spring-boot:run

# Terminal 2: Frontend
npm run dev
```

### 2. Open Browser
```
http://localhost:5173
```

### 3. Open Console (F12)
Press F12 to open Developer Tools, go to Console tab

### 4. Login
```
Email: alice@example.com
Password: password
```

### 5. Enroll in Course
1. Go to "Courses" page
2. Click "Enroll Now" on "DSA in Java - Arrays"

### 6. Go to Quiz Page
1. Click "Quizzes" in navigation
2. **Watch the console output**

---

## ✅ What You Should See

### In Browser Console:
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

### On Quiz Page:
- Loading indicator appears
- Message: "Generating AI-powered quiz questions..."
- After 2-5 seconds, quiz card appears
- Questions are about Arrays in Java
- Questions use simple ELI10 language

---

## ❌ If You See Fallback Questions

### Console Will Show:
```
❌ Failed to generate AI quiz for Arrays: Error: ...
Using fallback questions for Arrays
```

### Troubleshooting:

**1. Check Auth Token**
```javascript
// In console
localStorage.getItem('dsa_platform_auth_token')
// Should return: "mock_token_1_..."
```

**2. Test API Directly**
```javascript
// In console
const token = localStorage.getItem('dsa_platform_auth_token');
fetch('http://localhost:8080/api/chat/ask', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    message: 'test',
    conversationHistory: []
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

**3. Check Backend**
```bash
# Should see in backend console:
Processing question for user 1: test
```

---

## 🎯 Expected Results

### AI-Generated Questions Look Like:
```
Question 1: What is an array in Java?
A) A collection of different data types
B) A fixed-size collection of elements of the same type ✓
C) A dynamic list that can grow
D) A type of loop

Explanation: An array in Java is like a row of numbered boxes 
that can only hold one type of thing (like all integers or all 
strings). Once you create it, the size stays the same!
```

### Fallback Questions Look Like:
```
Question 1: What is an array in Java?
[Same options and explanation as above]
```

**Difference:** AI questions will be slightly different each time you regenerate!

---

## 🔄 Test Regeneration

1. On quiz page, click the sparkle icon (✨)
2. Watch console for generation logs
3. Compare new questions with previous ones
4. They should be different!

---

## 📊 Quick Checklist

- [ ] Backend running (port 8080)
- [ ] Frontend running (port 5173)
- [ ] Logged in successfully
- [ ] Course enrolled
- [ ] Console shows "Calling backend API"
- [ ] Console shows "API response status: 200"
- [ ] Console shows "Successfully generated X questions"
- [ ] Quiz questions appear
- [ ] Questions are about the correct topic
- [ ] Questions use ELI10 language

---

## 🆘 Quick Fixes

### Fix 1: Clear Everything
```javascript
// In console
localStorage.clear();
location.reload();
// Then login again
```

### Fix 2: Restart Backend
```bash
# Stop backend (Ctrl+C)
cd backend
./mvnw spring-boot:run
```

### Fix 3: Hard Refresh Frontend
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

---

## ✅ Success!

If you see:
- ✅ Console logs showing AI generation
- ✅ Questions appear after 2-5 seconds
- ✅ Questions are relevant to topic
- ✅ Different questions when regenerating

**You're all set!** 🎉

---

## 📞 Need Help?

Check **QUIZ_AI_DEBUGGING_GUIDE.md** for detailed troubleshooting.
