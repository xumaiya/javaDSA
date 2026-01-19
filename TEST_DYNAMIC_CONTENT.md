# Quick Test: Dynamic Content Generation

## 🚀 Quick Start

### 1. Ensure Backend is Running
```bash
cd backend
./mvnw spring-boot:run
```

**Wait for:**
```
Started DsaLearningPlatformApplication in X seconds
```

### 2. Test Content Generation

**Generate Stack Content:**
```bash
curl http://localhost:8080/api/chapters/Stack/lessons
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "chapterName": "Stack",
    "chapterTitle": "Understanding Stacks in Java",
    "lessons": [
      {
        "lessonTitle": "What is a Stack?",
        "lessonExplanation": "Think of a stack like...",
        "lessonOrder": 1,
        "estimatedDuration": 15
      }
      // ... 4 more lessons
    ],
    "cached": false
  },
  "message": "Generated new content for chapter: Stack"
}
```

**Time:** 2-10 seconds (generating)

### 3. Test Caching

**Request Same Chapter Again:**
```bash
curl http://localhost:8080/api/chapters/Stack/lessons
```

**Expected:**
- Same content
- `"cached": true`
- **Instant response** (<200ms)

---

## 🧪 Test All DSA Topics

```bash
# Test different chapters
curl http://localhost:8080/api/chapters/Queue/lessons
curl http://localhost:8080/api/chapters/LinkedList/lessons
curl http://localhost:8080/api/chapters/Tree/lessons
curl http://localhost:8080/api/chapters/Hashing/lessons
curl http://localhost:8080/api/chapters/Heap/lessons
curl http://localhost:8080/api/chapters/Graph/lessons
```

**Each should:**
- Generate on first request (2-10s)
- Cache for subsequent requests (<200ms)
- Return 5 lessons
- Use ELI10 style explanations

---

## 🔍 Verify in Database

### 1. Open H2 Console
```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:file:./data/dsaplatform
Username: sa
Password: (leave empty)
```

### 2. Run Queries

**View All Chapters:**
```sql
SELECT * FROM chapter_contents;
```

**View Lessons for Stack:**
```sql
SELECT lc.lesson_title, lc.lesson_order, lc.estimated_duration
FROM lesson_contents lc
JOIN chapter_contents cc ON lc.chapter_content_id = cc.id
WHERE cc.chapter_name = 'Stack'
ORDER BY lc.lesson_order;
```

**Count Lessons:**
```sql
SELECT cc.chapter_name, COUNT(lc.id) as lesson_count
FROM chapter_contents cc
LEFT JOIN lesson_contents lc ON cc.id = lc.chapter_content_id
GROUP BY cc.chapter_name;
```

---

## 🔄 Test Reset Feature

### 1. Delete Content
```bash
curl -X DELETE http://localhost:8080/api/chapters/Stack/content
```

**Expected:**
```json
{
  "success": true,
  "message": "Successfully deleted content for chapter: Stack"
}
```

### 2. Verify Deletion
```bash
curl http://localhost:8080/api/chapters/Stack/exists
```

**Expected:**
```json
{
  "success": true,
  "data": false,
  "message": "Content does not exist"
}
```

### 3. Regenerate
```bash
curl http://localhost:8080/api/chapters/Stack/lessons
```

**Expected:**
- New content generated
- `"cached": false`
- Takes 2-10 seconds

---

## 📊 Check Backend Logs

**Watch Logs:**
```bash
tail -f backend/logs/application.log | grep -E "ContentGeneration|ChapterContent"
```

**Expected Log Messages:**

**First Request:**
```
INFO  ContentGenerationService - Fetching content for chapter: Stack
INFO  ContentGenerationService - No cached content found. Generating new content for chapter: Stack
DEBUG ContentGenerationService - Sending content generation request to LLM for chapter: Stack
DEBUG ContentGenerationService - Received LLM response for chapter: Stack
INFO  ContentGenerationService - Successfully parsed 5 lessons from LLM response
INFO  ContentGenerationService - Successfully generated and stored content for chapter: Stack with 5 lessons
```

**Subsequent Request:**
```
INFO  ContentGenerationService - Fetching content for chapter: Stack
INFO  ContentGenerationService - Found cached content for chapter: Stack
```

---

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] First request generates content (2-10s)
- [ ] Response contains 5 lessons
- [ ] Lessons have ELI10 style explanations
- [ ] Second request returns cached content (<200ms)
- [ ] `cached` flag is `true` on second request
- [ ] Database shows stored content
- [ ] Delete endpoint works
- [ ] Content regenerates after delete
- [ ] Logs show generation and caching

---

## 🐛 Troubleshooting

### Issue: 500 Error on Generation

**Check:**
```bash
# View error in logs
tail -n 50 backend/logs/application.log | grep ERROR

# Common causes:
# 1. OpenRouter API key not set
# 2. Network issue
# 3. LLM timeout
```

**Fix:**
```bash
# Verify API key
cat backend/.env | grep OPENROUTER

# Test API key
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Issue: Empty Response

**Check:**
```bash
# View full response
curl -v http://localhost:8080/api/chapters/Stack/lessons
```

**Verify:**
- Status code 200?
- Content-Type: application/json?
- Response body not empty?

### Issue: Slow Generation

**Normal:** 2-10 seconds for first request

**Too Slow (>30s):**
- Check network connection
- Check OpenRouter API status
- Reduce max_tokens in config

---

## 🎯 Expected Content Quality

### Lesson Titles Should Be:
- Clear and descriptive
- Progressive (Lesson 1 → Lesson 5)
- Beginner-friendly

**Example:**
```
1. What is a Stack?
2. Stack Operations: Push and Pop
3. Implementing Stack in Java
4. Stack Applications
5. Practice Problems
```

### Lesson Explanations Should Include:
- ELI10 style analogies
- Simple language
- Java code examples
- Practical applications
- 200-500 words

**Example:**
```markdown
# What is a Stack?

Think of a stack like a pile of plates in your kitchen. When you wash 
dishes, you stack them on top of each other. When you need a plate, 
you take the one from the top - not from the middle or bottom!

This is called LIFO: Last In, First Out. The last plate you put on 
the stack is the first one you take off.

## In Java

```java
Stack<Integer> stack = new Stack<>();
stack.push(1);  // Add to top
stack.push(2);  // Add to top
int top = stack.pop();  // Remove from top (returns 2)
```

## Real-World Uses
- Browser back button
- Undo feature in editors
- Function call stack
```

---

## 📞 Need Help?

**Check:**
1. Backend logs: `backend/logs/application.log`
2. H2 console: `http://localhost:8080/h2-console`
3. API health: `http://localhost:8080/actuator/health`

**Documentation:**
- Full guide: `DYNAMIC_CONTENT_GENERATION.md`
- API details: See "API Endpoints" section

---

**Happy Testing!** 🎉
