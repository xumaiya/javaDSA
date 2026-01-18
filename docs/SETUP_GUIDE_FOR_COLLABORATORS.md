# Setup Guide for Collaborators

## Getting the Latest Changes

### Step 1: Pull Latest Code
```bash
cd javaDSA
git pull origin main
```

## Backend Setup

### Step 2: Install New Backend Dependencies
The backend now uses `spring-dotenv` to load environment variables from `.env` file.

```bash
cd backend
./mvnw clean install
```

**Note for Windows:**
```cmd
cd backend
mvnw.cmd clean install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the `backend` folder if it doesn't exist:

```bash
# backend/.env
OPENROUTER_API_KEY=your_api_key_here
```

**Important:** Replace `your_api_key_here` with your actual OpenRouter API key.

### Step 4: Start Backend Server
```bash
./mvnw spring-boot:run
```

**Note for Windows:**
```cmd
mvnw.cmd spring-boot:run
```

The backend will run on: `http://localhost:8080`

## Frontend Setup

### Step 5: Install Frontend Dependencies (if needed)
If this is your first time or if new packages were added:

```bash
cd ..
npm install
```

### Step 6: Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on: `http://localhost:5173`

## What's New in This Update?

### Backend Changes:
- ✅ Added `spring-dotenv` dependency for `.env` file support
- ✅ API key now loads from `.env` file automatically
- ✅ No need to set environment variables manually

### Frontend Changes:
- ✅ Glass morphism effects on all pages
- ✅ Smooth animations and transitions
- ✅ Enhanced navigation with gradient effects
- ✅ Animated chatbot interface
- ✅ Beautiful course cards with staggered animations
- ✅ Profile page with gradient stat cards
- ✅ Quiz page with modern design
- ✅ New fade-in animations throughout

## Quick Start Commands (All in One)

### For Backend:
```bash
cd javaDSA/backend
./mvnw clean spring-boot:run
```

### For Frontend (in a new terminal):
```bash
cd javaDSA
npm run dev
```

## Troubleshooting

### Backend Issues:

**Problem:** "API key appears to be invalid"
**Solution:** Make sure your `.env` file exists in the `backend` folder with the correct API key:
```
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

**Problem:** Maven build fails
**Solution:** 
```bash
cd backend
./mvnw clean install -U
```

**Problem:** Port 8080 already in use
**Solution:** Kill the process using port 8080 or change the port in `application.properties`

### Frontend Issues:

**Problem:** Dependencies not found
**Solution:**
```bash
npm install
```

**Problem:** Port 5173 already in use
**Solution:** Vite will automatically use the next available port (5174, 5175, etc.)

**Problem:** Styles not loading properly
**Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Database Note

The database is now persistent (file-based H2 database). Your data will be saved between restarts in:
```
backend/data/dsaplatform.mv.db
```

**Note:** This file is in `.gitignore`, so each collaborator will have their own local database.

## Testing the Setup

1. **Backend Test:** Visit `http://localhost:8080/api/courses` - should return course data
2. **Frontend Test:** Visit `http://localhost:5173` - should see the landing page with animations
3. **Chatbot Test:** Login and try the chatbot - should work with your API key

## Need Help?

If you encounter any issues:
1. Make sure you're on the latest code: `git pull origin main`
2. Check that both backend and frontend are running
3. Verify your `.env` file has the correct API key
4. Check the console for error messages

## Summary of Required Files

### Backend:
- ✅ `backend/.env` (create this with your API key)
- ✅ `backend/pom.xml` (updated with spring-dotenv)

### Frontend:
- ✅ All files updated via git pull
- ✅ No manual configuration needed

## Development Workflow

1. Pull latest changes: `git pull origin main`
2. Start backend: `cd backend && ./mvnw spring-boot:run`
3. Start frontend (new terminal): `npm run dev`
4. Make your changes
5. Test everything works
6. Commit and push: `git add . && git commit -m "your message" && git push origin main`

---

**Happy Coding! 🚀**
