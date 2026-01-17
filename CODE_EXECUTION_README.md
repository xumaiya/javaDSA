# Real-Time Java Code Execution

## Overview

The code editor now supports real-time Java code execution using a custom backend service. Users can write, compile, and run Java code directly in the browser.

## Features

✅ **Real-time Compilation**: Code is compiled using Java Compiler API
✅ **Sandboxed Execution**: Code runs in isolated temporary directories
✅ **Timeout Protection**: 5-second execution timeout prevents infinite loops
✅ **Error Handling**: Clear compilation and runtime error messages
✅ **Execution Time**: Shows how long the code took to execute
✅ **Auto Cleanup**: Temporary files are automatically deleted after execution

## How It Works

### Backend (Spring Boot)

1. **CodeExecutionController**: REST endpoint at `/api/code/execute`
2. **CodeExecutionService**: Handles compilation and execution
   - Creates temporary directory for each execution
   - Extracts class name from code
   - Compiles using `javax.tools.JavaCompiler`
   - Executes using `ProcessBuilder`
   - Captures output and errors
   - Cleans up temporary files

### Frontend (React)

1. User writes Java code in the editor
2. Clicks "Run" button
3. Code is sent to backend API
4. Results (output/errors) are displayed in the output panel

## Security Considerations

- Code runs in temporary directories
- 5-second timeout prevents long-running processes
- No network access from executed code
- Automatic cleanup of temporary files
- Endpoint is public but can be rate-limited

## API Endpoint

### POST `/api/code/execute`

**Request:**
```json
{
  "code": "public class Main { ... }"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Code executed successfully",
  "data": {
    "output": "Hello, World!\n",
    "error": null,
    "executionTime": 245
  }
}
```

## Requirements

- JDK (not JRE) must be installed on the server
- Write permissions to system temp directory
- Sufficient disk space for temporary files

## Future Enhancements

- [ ] Add input support for Scanner
- [ ] Support multiple files/classes
- [ ] Memory usage tracking
- [ ] Rate limiting per user
- [ ] Code analysis and suggestions
- [ ] Save and share code snippets
