# How to Use the Code Editor - Simple Guide

## ✅ Everything is Already Set Up!

I already created the API for you. You don't need to get it from anywhere!

## 📁 What I Created (Already in Your Project):

### Backend Files (in `javaDSA/backend/src/main/java/com/dsaplatform/`):

1. **controller/CodeExecutionController.java**
   - API endpoint: `POST /api/code/execute`
   - Receives Java code and returns output

2. **service/CodeExecutionService.java**
   - Compiles Java code using `javac`
   - Executes compiled code using `java`
   - Captures output and errors

3. **dto/request/CodeExecutionRequest.java**
   - Request format: `{ "code": "..." }`

4. **dto/response/CodeExecutionResponse.java**
   - Response format: `{ "output": "...", "error": "...", "executionTime": 123 }`

### Frontend File (Already Updated):

- **src/pages/CodeEditor.tsx**
  - Sends code to backend API
  - Displays results

## 🚀 How to Use (3 Simple Steps):

### Step 1: Start Backend Server

Open terminal in `javaDSA/backend` folder and run:

```bash
# Windows
./mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```

Wait until you see:
```
Started DsaLearningPlatformApplication in X seconds
Tomcat started on port 8080
```

### Step 2: Start Frontend

Open another terminal in `javaDSA` folder and run:

```bash
npm run dev
```

Wait until you see:
```
Local: http://localhost:5173
```

### Step 3: Use the Code Editor

1. Open browser: `http://localhost:5173`
2. Navigate to "Code Editor" page
3. Write Java code
4. Press **Ctrl+Enter** or click **Run**
5. See real output!

## 🎯 The API Endpoint (Already Working):

**URL:** `http://localhost:8080/api/code/execute`

**Method:** POST

**Request Body:**
```json
{
  "code": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Code executed successfully",
  "data": {
    "output": "Hello World\n",
    "error": null,
    "executionTime": 245
  }
}
```

## 🧪 Test the API Directly (Optional):

You can test the API using curl or Postman:

```bash
curl -X POST http://localhost:8080/api/code/execute \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"public class Main { public static void main(String[] args) { System.out.println(\\\"Hello\\\"); } }\"}"
```

## 📝 Where is Everything?

```
javaDSA/
├── backend/
│   └── src/main/java/com/dsaplatform/
│       ├── controller/
│       │   └── CodeExecutionController.java  ← API endpoint
│       ├── service/
│       │   └── CodeExecutionService.java     ← Compilation logic
│       └── dto/
│           ├── request/
│           │   └── CodeExecutionRequest.java
│           └── response/
│               └── CodeExecutionResponse.java
│
└── src/
    └── pages/
        └── CodeEditor.tsx  ← Frontend (already calls the API)
```

## ✨ Features You Can Use Right Now:

1. **Write Code** - Full Java syntax support
2. **Run Code** - Press Ctrl+Enter or click Run
3. **Save Code** - Press Ctrl+S to save snippets
4. **Load Templates** - Pre-built examples
5. **Adjust Font** - A- and A+ buttons
6. **Download** - Export as .java file
7. **Copy** - Quick clipboard copy

## ❓ Common Questions:

### Q: Do I need to install anything?
**A:** No! If you have JDK installed (which you do, since you're running Spring Boot), it will work.

### Q: Where does the code run?
**A:** On your backend server (localhost:8080), not in the browser.

### Q: Is it secure?
**A:** Yes! Code runs in temporary directories with 5-second timeout.

### Q: Can I use Scanner for input?
**A:** Not yet, but I can add that feature if you want.

### Q: What if the backend is not running?
**A:** You'll see "Failed to connect to server" error. Just start the backend.

## 🎉 That's It!

You don't need to:
- ❌ Get any external API
- ❌ Sign up for any service
- ❌ Install additional software
- ❌ Configure anything

Just:
1. ✅ Start backend (`./mvnw.cmd spring-boot:run`)
2. ✅ Start frontend (`npm run dev`)
3. ✅ Write and run Java code!

## 🔥 Pro Tips:

- **Ctrl+Enter** - Run code instantly
- **Ctrl+S** - Save your code
- **Tab** - Auto-indent
- Use templates for quick start
- Save frequently used code snippets
- Adjust font size for comfort

---

**Backend Status:** ✅ Running on http://localhost:8080
**Frontend Status:** Check by running `npm run dev`
**API Endpoint:** http://localhost:8080/api/code/execute
