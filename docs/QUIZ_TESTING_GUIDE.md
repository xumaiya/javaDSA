# Quiz Feature Testing Guide

## 🧪 Testing Overview

This guide provides comprehensive testing procedures for the dynamic quiz generation feature.

## Prerequisites

### Backend Requirements
- ✅ Java 17+ installed
- ✅ Maven installed
- ✅ OpenRouter API key configured in `backend/.env`
- ✅ Backend running on `http://localhost:8080`

### Frontend Requirements
- ✅ Node.js 16+ installed
- ✅ npm installed
- ✅ Frontend running on `http://localhost:5173`

## 🚀 Quick Test

### 1. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 2. Basic Flow Test
1. Open browser: `http://localhost:5173`
2. Login with test account
3. Navigate to Courses → Enroll in "DSA in Java - Arrays"
4. Navigate to Quiz page
5. Click "Start Quiz" on Arrays course
6. Verify 5 questions are displayed
7. Answer questions and submit
8. Verify results are shown

## 📋 Detailed Test Cases

### Test Case 1: Quiz Generation

**Objective**: Verify quiz questions are generated dynamically

**Steps**:
1. Login to the application
2. Enroll in a course (e.g., "DSA in Java - Arrays")
3. Navigate to Quiz page
4. Click "Start Quiz"

**Expected Results**:
- ✅ Loading indicator appears
- ✅ 5 questions are generated
- ✅ Questions are relevant to Arrays topic
- ✅ Each question has 4 options
- ✅ Timer starts at 10:00
- ✅ Progress bar shows 1/5

**Pass Criteria**: All questions are about Arrays and displayed correctly

---

### Test Case 2: Medium Difficulty

**Objective**: Verify questions are medium difficulty

**Steps**:
1. Generate a quiz for any topic
2. Review question complexity

**Expected Results**:
- ✅ Questions test understanding, not just memorization
- ✅ Questions include code concepts
- ✅ Questions are not too basic (beginner)
- ✅ Questions are not too complex (advanced)

**Pass Criteria**: Questions are appropriate for intermediate learners

---

### Test Case 3: Topic Extraction

**Objective**: Verify correct topic extraction from course titles

**Test Data**:
| Course Title | Expected Topic |
|-------------|----------------|
| DSA in Java - Arrays | Arrays |
| DSA in Java - Linked Lists | Linked Lists |
| DSA in Java - Stacks & Queues | Stacks & Queues |
| DSA in Java - Trees | Trees |

**Steps**:
1. Enroll in each course
2. Start quiz for each
3. Verify questions match topic

**Expected Results**:
- ✅ Arrays quiz has array questions
- ✅ Linked Lists quiz has linked list questions
- ✅ Each topic generates relevant questions

**Pass Criteria**: 100% topic accuracy

---

### Test Case 4: Timer Functionality

**Objective**: Verify timer works correctly

**Steps**:
1. Start a quiz
2. Observe timer countdown
3. Wait for timer to reach < 1 minute
4. Let timer expire

**Expected Results**:
- ✅ Timer starts at 10:00
- ✅ Timer counts down every second
- ✅ Timer turns red at < 1 minute
- ✅ Quiz auto-submits at 0:00

**Pass Criteria**: Timer functions correctly and auto-submits

---

### Test Case 5: Answer Selection

**Objective**: Verify answer selection works

**Steps**:
1. Start a quiz
2. Click on option A for question 1
3. Navigate to question 2
4. Click on option B
5. Navigate back to question 1

**Expected Results**:
- ✅ Selected option is highlighted
- ✅ Can change selection
- ✅ Selection persists when navigating
- ✅ Question indicator shows answered questions

**Pass Criteria**: Answer selection works smoothly

---

### Test Case 6: Quiz Submission

**Objective**: Verify quiz submission and results

**Steps**:
1. Start a quiz
2. Answer all 5 questions
3. Click "Submit Quiz"
4. Confirm submission

**Expected Results**:
- ✅ Confirmation modal appears
- ✅ Shows answered count (5/5)
- ✅ Results page displays
- ✅ Score is calculated correctly
- ✅ Pass/fail status is shown
- ✅ Explanations are displayed

**Pass Criteria**: Results are accurate and complete

---

### Test Case 7: Generate New Questions

**Objective**: Verify new question generation

**Steps**:
1. Navigate to Quiz page
2. Click sparkle icon (✨) on a quiz
3. Wait for generation
4. Start the quiz
5. Note the questions
6. Go back and generate again
7. Start quiz again

**Expected Results**:
- ✅ Loading indicator shows during generation
- ✅ New questions are generated
- ✅ Questions are different from previous set
- ✅ Still relevant to the topic

**Pass Criteria**: New questions are generated successfully

---

### Test Case 8: Retake Quiz

**Objective**: Verify quiz retake functionality

**Steps**:
1. Complete a quiz
2. View results
3. Click "Retake Quiz"

**Expected Results**:
- ✅ Quiz restarts with same questions
- ✅ Timer resets to 10:00
- ✅ Previous answers are cleared
- ✅ Can submit again

**Pass Criteria**: Retake works correctly

---

### Test Case 9: User Isolation

**Objective**: Verify quiz attempts are user-specific

**Steps**:
1. Login as User A
2. Take a quiz and get 80%
3. Logout
4. Login as User B
5. Check same quiz

**Expected Results**:
- ✅ User B sees no previous attempt
- ✅ User B can take quiz fresh
- ✅ User A's score is not visible to User B

**Pass Criteria**: User data is properly isolated

---

### Test Case 10: Error Handling

**Objective**: Verify error handling works

**Test Scenarios**:

**A. No Auth Token**
1. Clear localStorage
2. Try to access quiz page

**Expected**: Redirected to login

**B. Invalid API Key**
1. Set invalid OpenRouter key
2. Try to generate quiz

**Expected**: Fallback questions used

**C. Network Error**
1. Stop backend
2. Try to generate quiz

**Expected**: Error message displayed

**Pass Criteria**: All errors handled gracefully

---

## 🔍 API Testing

### Using curl

**1. Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**2. Generate Quiz**
```bash
curl -X POST http://localhost:8080/api/quiz/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "topic": "Arrays",
    "difficulty": "intermediate",
    "questionCount": 5
  }'
```

### Using Postman

**Collection Setup**:
1. Create new collection "Quiz API"
2. Add environment variable `baseUrl`: `http://localhost:8080`
3. Add environment variable `token`: (set after login)

**Requests**:

**1. Login**
- Method: POST
- URL: `{{baseUrl}}/api/auth/login`
- Body:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- Save `accessToken` to `{{token}}`

**2. Generate Quiz**
- Method: POST
- URL: `{{baseUrl}}/api/quiz/generate`
- Headers: `Authorization: Bearer {{token}}`
- Body:
```json
{
  "topic": "Arrays",
  "difficulty": "intermediate",
  "questionCount": 5
}
```

## 🎯 Performance Testing

### Load Test Scenarios

**1. Single User**
- Generate 10 quizzes in sequence
- Measure average response time
- **Target**: < 10 seconds per quiz

**2. Concurrent Users**
- 5 users generate quizzes simultaneously
- Measure response times
- **Target**: < 15 seconds per quiz

**3. Stress Test**
- 20 users generate quizzes
- Monitor for failures
- **Target**: No failures, graceful degradation

### Performance Metrics

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| Quiz Generation | < 5s | < 10s | > 10s |
| Page Load | < 1s | < 2s | > 2s |
| Quiz Submission | < 500ms | < 1s | > 1s |
| API Response | < 200ms | < 500ms | > 500ms |

## 🐛 Bug Reporting Template

```markdown
### Bug Report

**Title**: [Brief description]

**Severity**: Critical / High / Medium / Low

**Environment**:
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Backend Version: [1.0.0]
- Frontend Version: [1.0.0]

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots**:
[If applicable]

**Console Logs**:
```
[Paste console errors]
```

**Additional Context**:
[Any other relevant information]
```

## ✅ Test Checklist

### Pre-Deployment Checklist

**Backend**:
- [ ] All tests pass
- [ ] No compilation errors
- [ ] OpenRouter API key configured
- [ ] Database migrations applied
- [ ] Logging configured
- [ ] Error handling tested

**Frontend**:
- [ ] Build succeeds
- [ ] No TypeScript errors
- [ ] API endpoints correct
- [ ] Environment variables set
- [ ] Responsive design tested
- [ ] Cross-browser tested

**Integration**:
- [ ] Login works
- [ ] Quiz generation works
- [ ] Timer works
- [ ] Submission works
- [ ] Results display correctly
- [ ] Error handling works

**Performance**:
- [ ] Quiz generates in < 10s
- [ ] Page loads in < 2s
- [ ] No memory leaks
- [ ] API calls optimized

**Security**:
- [ ] JWT validation works
- [ ] User isolation verified
- [ ] API key not exposed
- [ ] CORS configured correctly

## 📊 Test Results Template

```markdown
### Test Execution Report

**Date**: [YYYY-MM-DD]
**Tester**: [Name]
**Environment**: [Dev/Staging/Prod]

**Summary**:
- Total Tests: X
- Passed: Y
- Failed: Z
- Blocked: W

**Test Results**:

| Test Case | Status | Notes |
|-----------|--------|-------|
| TC1: Quiz Generation | ✅ Pass | |
| TC2: Medium Difficulty | ✅ Pass | |
| TC3: Topic Extraction | ✅ Pass | |
| TC4: Timer | ✅ Pass | |
| TC5: Answer Selection | ✅ Pass | |
| TC6: Submission | ✅ Pass | |
| TC7: New Questions | ✅ Pass | |
| TC8: Retake | ✅ Pass | |
| TC9: User Isolation | ✅ Pass | |
| TC10: Error Handling | ✅ Pass | |

**Issues Found**:
1. [Issue description]
2. [Issue description]

**Recommendations**:
1. [Recommendation]
2. [Recommendation]
```

## 🔄 Regression Testing

After any code changes, run:

1. **Smoke Tests** (5 min)
   - Login
   - Generate quiz
   - Submit quiz

2. **Core Functionality** (15 min)
   - All test cases 1-10

3. **Edge Cases** (10 min)
   - Invalid inputs
   - Network errors
   - Timeout scenarios

## 📝 Notes

- Always test with fresh data
- Clear browser cache between tests
- Check both console and network tabs
- Document any unexpected behavior
- Test on multiple browsers
- Test on mobile devices

---

**Last Updated**: January 19, 2026
**Version**: 1.0
**Status**: Ready for Testing
