# Code Editor Flow - Visual Explanation

## 🎯 Simple Answer: Where is the API?

**The API is already in your backend!** I created it for you. It's running on `http://localhost:8080/api/code/execute`

## 📊 Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR BROWSER                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Code Editor (http://localhost:5173/editor)                │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  public class Main {                                 │  │ │
│  │  │      public static void main(String[] args) {        │  │ │
│  │  │          System.out.println("Hello World");          │  │ │
│  │  │      }                                                │  │ │
│  │  │  }                                                    │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  │                                                             │ │
│  │  [Run Code] ← User clicks or presses Ctrl+Enter            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP POST Request
                              │ { "code": "public class Main..." }
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              YOUR BACKEND SERVER (localhost:8080)                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  CodeExecutionController.java                              │ │
│  │  POST /api/code/execute                                    │ │
│  │                                                             │ │
│  │  Receives: { "code": "..." }                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  CodeExecutionService.java                                 │ │
│  │                                                             │ │
│  │  1. Create temp directory                                  │ │
│  │     /tmp/dsa-code-execution/1234567890/                    │ │
│  │                                                             │ │
│  │  2. Write code to file                                     │ │
│  │     Main.java                                              │ │
│  │                                                             │ │
│  │  3. Compile with javac                                     │ │
│  │     javac Main.java → Main.class                           │ │
│  │                                                             │ │
│  │  4. Execute with java                                      │ │
│  │     java Main → "Hello World"                              │ │
│  │                                                             │ │
│  │  5. Capture output                                         │ │
│  │     output = "Hello World\n"                               │ │
│  │                                                             │ │
│  │  6. Cleanup temp files                                     │ │
│  │     Delete /tmp/dsa-code-execution/1234567890/             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Response                                                   │ │
│  │  {                                                          │ │
│  │    "output": "Hello World\n",                              │ │
│  │    "error": null,                                          │ │
│  │    "executionTime": 245                                    │ │
│  │  }                                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Response
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR BROWSER                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Output Panel                                               │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  Hello World                                         │  │ │
│  │  │                                                       │  │ │
│  │  │  --- Executed in 245ms ---                           │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 📂 File Locations (Where Everything Is)

```
Your Project Structure:

javaDSA/
│
├── backend/                                    ← BACKEND (Port 8080)
│   ├── src/main/java/com/dsaplatform/
│   │   ├── controller/
│   │   │   └── CodeExecutionController.java   ← 🎯 API ENDPOINT HERE
│   │   │
│   │   ├── service/
│   │   │   └── CodeExecutionService.java      ← 🔧 COMPILATION LOGIC HERE
│   │   │
│   │   └── dto/
│   │       ├── request/
│   │       │   └── CodeExecutionRequest.java  ← 📥 REQUEST FORMAT
│   │       └── response/
│   │           └── CodeExecutionResponse.java ← 📤 RESPONSE FORMAT
│   │
│   └── mvnw.cmd                                ← Run: ./mvnw.cmd spring-boot:run
│
└── src/                                        ← FRONTEND (Port 5173)
    └── pages/
        └── CodeEditor.tsx                      ← 💻 CODE EDITOR UI
```

## 🔄 Request/Response Example

### What Frontend Sends:

```javascript
// In CodeEditor.tsx (line ~450)
const response = await fetch('http://localhost:8080/api/code/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    code: "public class Main { ... }" 
  })
});
```

### What Backend Receives:

```java
// In CodeExecutionController.java
@PostMapping("/execute")
public ResponseEntity<ApiResponse<CodeExecutionResponse>> executeCode(
    @RequestBody CodeExecutionRequest request) {
    // request.getCode() = "public class Main { ... }"
}
```

### What Backend Returns:

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

### What Frontend Displays:

```
Output Panel:
┌─────────────────────────┐
│ Hello World             │
│                         │
│ --- Executed in 245ms ---|
└─────────────────────────┘
```

## 🎬 Step-by-Step Execution

1. **User Action**
   - User writes code in editor
   - Presses Ctrl+Enter or clicks "Run"

2. **Frontend (CodeEditor.tsx)**
   - Collects code from textarea
   - Sends POST request to backend
   - Shows "Running..." message

3. **Backend Receives (CodeExecutionController.java)**
   - Receives code in request body
   - Calls CodeExecutionService

4. **Compilation (CodeExecutionService.java)**
   - Creates temp directory: `/tmp/dsa-code-execution/1705500000/`
   - Writes code to: `Main.java`
   - Runs: `javac Main.java`
   - Creates: `Main.class`

5. **Execution (CodeExecutionService.java)**
   - Runs: `java Main`
   - Captures stdout: `"Hello World\n"`
   - Measures time: `245ms`

6. **Cleanup (CodeExecutionService.java)**
   - Deletes temp directory
   - Returns response

7. **Frontend Displays**
   - Shows output in terminal panel
   - Shows execution time
   - Ready for next run

## 🚀 How to Start Everything

### Terminal 1 (Backend):
```bash
cd javaDSA/backend
./mvnw.cmd spring-boot:run
```
Wait for: `Started DsaLearningPlatformApplication`

### Terminal 2 (Frontend):
```bash
cd javaDSA
npm run dev
```
Wait for: `Local: http://localhost:5173`

### Browser:
```
Open: http://localhost:5173/editor
```

## ✅ Checklist

- [x] Backend API created (CodeExecutionController.java)
- [x] Compilation service created (CodeExecutionService.java)
- [x] Frontend updated (CodeEditor.tsx)
- [x] Security configured (permits /api/code/**)
- [x] Error handling added
- [x] Timeout protection (5 seconds)
- [x] Auto cleanup implemented

## 🎉 You're Ready!

Everything is already set up. Just:
1. Start backend
2. Start frontend
3. Write code
4. Press Ctrl+Enter
5. See real Java output!

No external APIs needed. No configuration needed. It just works!
