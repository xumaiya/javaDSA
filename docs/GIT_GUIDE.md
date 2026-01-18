# Git Guide - How to Push Changes

## ✅ Your Repository is Already Set Up!

Your project is connected to: `https://github.com/xumaiya/javaDSA.git`

## 📍 Important: Always Work from javaDSA Folder

**CORRECT:**
```bash
cd javaDSA
git add .
git commit -m "Your message"
git push origin main
```

**WRONG (Don't do this):**
```bash
cd proj  # Parent folder - DON'T USE THIS
git init  # This creates a nested repo problem!
```

## 🚀 How to Push Your Changes (Step by Step)

### 1. Navigate to the Project Folder
```bash
cd D:\University\third-sem\proj\javaDSA
```

### 2. Check What Changed
```bash
git status
```

### 3. Add Your Changes
```bash
# Add all changes
git add .

# Or add specific files
git add src/pages/CodeEditor.tsx
git add backend/src/main/java/com/dsaplatform/controller/CodeExecutionController.java
```

### 4. Commit Your Changes
```bash
git commit -m "Describe what you changed"
```

**Good commit messages:**
- ✅ "Add real-time code execution feature"
- ✅ "Fix chatbot authentication bug"
- ✅ "Update course content for Chapter 1"
- ❌ "changes" (too vague)
- ❌ "asdf" (meaningless)

### 5. Push to GitHub
```bash
git push origin main
```

## 🔄 Common Git Commands

### Check Status
```bash
git status
```

### See What Changed
```bash
git diff
```

### View Commit History
```bash
git log --oneline
```

### Pull Latest Changes (from your friend)
```bash
git pull origin main
```

### Discard Changes (Be Careful!)
```bash
# Discard changes in a specific file
git restore src/pages/CodeEditor.tsx

# Discard all changes
git restore .
```

## 🤝 Working with Your Friend

### Before You Start Working
```bash
cd javaDSA
git pull origin main  # Get latest changes
```

### After You Finish Working
```bash
git add .
git commit -m "Your changes"
git push origin main
```

### If You Both Changed the Same File (Merge Conflict)

1. Git will show conflict markers:
```java
<<<<<<< HEAD
Your changes
=======
Your friend's changes
>>>>>>> main
```

2. Edit the file to keep what you want
3. Remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)
4. Save the file
5. Add and commit:
```bash
git add .
git commit -m "Resolve merge conflict"
git push origin main
```

## 📝 What NOT to Commit

These files are already in `.gitignore`:
- ❌ `node_modules/` - Dependencies (too large)
- ❌ `backend/target/` - Build files
- ❌ `backend/data/` - Database files
- ❌ `.env` - Secret keys
- ❌ `dist/` - Build output

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Check status | `git status` |
| Add all changes | `git add .` |
| Commit | `git commit -m "message"` |
| Push | `git push origin main` |
| Pull | `git pull origin main` |
| See history | `git log --oneline` |
| Discard changes | `git restore .` |

## 🆘 Common Problems

### Problem: "fatal: not a git repository"
**Solution:** You're in the wrong folder
```bash
cd javaDSA  # Go to the correct folder
```

### Problem: "Your branch is behind 'origin/main'"
**Solution:** Pull first
```bash
git pull origin main
```

### Problem: "Please commit your changes or stash them"
**Solution:** Commit or discard your changes
```bash
# Option 1: Commit
git add .
git commit -m "WIP"

# Option 2: Discard
git restore .
```

### Problem: "Permission denied"
**Solution:** Check your GitHub credentials
```bash
# Use GitHub Desktop or configure credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## ✅ What I Just Pushed

Your latest push includes:
- ✅ Real-time Java code editor
- ✅ Backend API for code execution
- ✅ Fixed chatbot authentication
- ✅ Course content for Chapter 1-3
- ✅ Improved UI/UX
- ✅ Documentation files

## 🎉 You're All Set!

Your changes are now on GitHub at:
`https://github.com/xumaiya/javaDSA`

Your friend can pull them with:
```bash
cd javaDSA
git pull origin main
```
