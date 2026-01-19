# Quick Reference: Dynamic Content Generation

## 🚀 Quick Start

```bash
# Start backend
cd backend && ./mvnw spring-boot:run

# Test generation
curl http://localhost:8080/api/chapters/Stack/lessons

# Test caching
curl http://localhost:8080/api/chapters/Stack/lessons
```

---

## 📌 API Endpoints

| Method | Endpoint | Purpose | Speed |
|--------|----------|---------|-------|
| GET | `/api/chapters/{name}/lessons` | Get/Generate lessons | 2-10s first, <200ms cached |
| GET | `/api/chapters/{name}/exists` | Check if cached | <50ms |
| DELETE | `/api/chapters/{name}/content` | Reset content | <100ms |

---

## 🗄️ Database

**Tables:**
- `chapter_contents` - Chapter metadata
- `lesson_contents` - Lesson details

**H2 Console:**
```
URL: http://localhost:8080/h2-console
JDBC: jdbc:h2:file:./data/dsaplatform
User: sa
Pass: (empty)
```

---

## 📊 Response Format

```json
{
  "success": true,
  "data": {
    "chapterName": "Stack",
    "chapterTitle": "Understanding Stacks",
    "lessons": [
      {
        "lessonTitle": "What is a Stack?",
        "lessonExplanation": "...",
        "lessonOrder": 1,
        "estimatedDuration": 15
      }
    ],
    "cached": false
  }
}
```

---

## 🔍 Testing

```bash
# Generate different chapters
curl http://localhost:8080/api/chapters/Queue/lessons
curl http://localhost:8080/api/chapters/LinkedList/lessons
curl http://localhost:8080/api/chapters/Tree/lessons

# Reset and regenerate
curl -X DELETE http://localhost:8080/api/chapters/Stack/content
curl http://localhost:8080/api/chapters/Stack/lessons
```

---

## 📝 Files Created

```
✨ ChapterContent.java          - Entity
✨ LessonContent.java           - Entity
✨ ChapterContentRepository.java - Repository
✨ ContentGenerationService.java - Service
✨ ChapterContentController.java - Controller
✨ ChapterContentResponse.java   - DTO
```

---

## 🐛 Troubleshooting

| Issue | Check | Fix |
|-------|-------|-----|
| 500 Error | Logs | Verify API key |
| Slow | Normal | First request takes 2-10s |
| Empty | Database | Check H2 console |

**Logs:**
```bash
tail -f backend/logs/application.log | grep ContentGeneration
```

---

## ✅ Success Indicators

- [x] First request: 2-10 seconds
- [x] Second request: <200ms
- [x] Response has 5 lessons
- [x] `cached: true` on second request
- [x] Database shows content
- [x] Logs show generation/caching

---

## 📚 Documentation

- **Full Guide:** `DYNAMIC_CONTENT_GENERATION.md`
- **Testing:** `TEST_DYNAMIC_CONTENT.md`
- **Summary:** `BACKEND_FEATURE_SUMMARY.md`

---

## 🎯 Key Features

✅ Generate once, cache forever
✅ Reuses existing LLM client
✅ No frontend changes
✅ Production-ready
✅ ELI10 style content
✅ 5 lessons per chapter

---

**Status:** ✅ Ready for Production
