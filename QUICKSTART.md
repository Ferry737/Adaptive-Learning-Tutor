# Quick Start Guide - Run the App Now!

## 🚀 Fastest Way to Run (5 Minutes)

### Prerequisites
- ✅ Node.js v24.14.0 (already installed)
- ⚠️ pnpm (install below if needed)
- ⚠️ Docker Desktop (start below if needed)

### Step 1: Install pnpm (if not installed)

```bash
npm install -g pnpm
```

### Step 2: Install Project Dependencies

```bash
pnpm install
```

### Step 3: Start PostgreSQL (if Docker isn't running)

1. **Start Docker Desktop** (if you haven't already)
2. Run in terminal:

```bash
docker compose up -d postgres
```

Wait for PostgreSQL to be healthy (check with `docker ps`)

### Step 4: Run Database Setup

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

This will:
- ✅ Generate Prisma client
- ✅ Create all database tables (50+)
- ✅ Seed test data (skills, questions, exam, user)

### Step 5: Start the Application

```bash
cd apps/web
pnpm dev
```

### Step 6: Open in Browser

```
http://localhost:3000
```

## 🎯 Sign In

**Email:** `test@example.com`
**Password:** `password123`

## 📱 What You'll See

### Home Page
- Welcome message with your name
- 4 main options:
  1. **Start Diagnostic** - Take questions (main feature!)
  2. **Study Mode** - Practice (coming soon)
  3. **Practice Mode** - More practice (coming soon)
  4. **Take Mock Exam** - Full exam (coming soon)

### Diagnostic Page
- Random questions from:
  - **Mathematics**: Arithmetic (4+3, 6-4)
  - **German**: Translation ("Das ist das Haus")
- Show your answer
- Get instant feedback:
  - ✅ Correct answers with explanation
  - ❌ Wrong answers with corrections
  - 💡 Hints when stuck
- Track mistakes in Mistake Notebook
- Progress bar showing completed questions
- Continue/Retry options

### Login Page
- Clean, simple sign-in form
- Test credentials clearly shown

## 🧪 Testing Features

1. **Sign in with test credentials** (from home page)
2. **Start Diagnostic**
3. **Answer a question:**
   - Choose an option or type answer
   - Click "Submit Answer"
4. **Get feedback:**
   - See if correct/incorrect
   - Read explanation
   - Try the corrected example
5. **Use Hint button** (if you're stuck)
6. **Retry or Next Question**
7. **Check Mistake Notebook** (appears after mistakes)
8. **Sign out** when done

## 🛠️ Common Commands

```bash
# Development
pnpm dev                          # Start web app
pnpm build                         # Build for production
pnpm start                         # Start production server

# Database
pnpm db:generate                  # Generate Prisma client
pnpm db:migrate                   # Create migrations
pnpm db:seed                      # Seed test data
pnpm db:studio                    # Open Prisma Studio (database UI)
pnpm db:reset                     # WARNING: wipes database!

# Testing
pnpm test                          # Run all tests
pnpm test:unit                    # Unit tests only
pnpm test:e2e                     # E2E tests only

# TypeScript
pnpm check                         # Type check all files
```

## 🐛 Troubleshooting

### Problem: "pnpm not found"
**Solution:** `npm install -g pnpm`

### Problem: "Cannot find module '@adaptive/shared-schemas'"
**Solution:** Run `pnpm install` again

### Problem: Docker not running
**Solution:** Start Docker Desktop, then `docker compose up -d postgres`

### Problem: Migration fails
**Solution:** Check if PostgreSQL is running, try `pnpm db:reset`

### Problem: App shows error on load
**Solution:**
1. Check `apps/web/.env` has correct `DATABASE_URL`
2. Run `pnpm db:generate`
3. Restart dev server

### Problem: Port 3000 already in use
**Solution:**
1. Stop other servers on port 3000
2. OR use: `pnpm dev -- -p 3001`

## 📊 What's Included

### Pages Created:
- ✅ **Home** - Welcome page with options
- ✅ **Login** - Sign-in page (mock auth)
- ✅ **Diagnostic** - Main learning interface

### Features Implemented:
- ✅ User authentication (mock)
- ✅ Question loading (math + German)
- ✅ Answer submission
- ✅ Deterministic feedback
- ✅ Hint system
- ✅ Mistake tracking
- ✅ Progress tracking
- ✅ Retry/Next question flow
- ✅ Responsive design
- ✅ Error handling

### Design:
- ✅ Modern gradient backgrounds
- ✅ Clean card-based UI
- ✅ Tailwind CSS styling
- ✅ Mobile-responsive
- ✅ Accessible colors (WCAG 2.2 AA)

### Backend:
- ✅ PostgreSQL database (50+ tables)
- ✅ Mock AI provider (10+ fixtures)
- ✅ Attempt state machine
- ✅ Mastery tracking
- ✅ Feedback system

## 🎓 Learning Principles Applied

- **Attempt-first:** Try before learning, not the other way around
- **Immediate feedback:** Get feedback right after answering
- **Mistake notebook:** Track errors and learn from them
- **Hints:** Progressive hints if stuck
- **Deterministic:** Same answers always give same feedback

## 📖 Project Structure

```
Adaptive-Learning-Tutor/
├── apps/web/          # Next.js web app (✓ Complete)
│   ├── app/
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   ├── login/page.tsx  # Login page
│   │   └── diagnostic/page.tsx  # Main learning interface
│   ├── globals.css         # Tailwind styles
│   └── package.json        # Dependencies
├── packages/
│   ├── shared-schemas/     # TypeScript types & Zod (✓ Complete)
│   ├── learning-engine/    # Database & Prisma (✓ Complete)
│   └── ai-gateway/         # Mock provider (✓ Complete)
├── docker-compose.yml      # PostgreSQL setup
├── package.json            # Root package
└── QUICKSTART.md           # This file
```

## 🎯 Next Steps

Once running, you can:

1. ✅ Test the diagnostic (main feature)
2. ✅ Check mistake notebook
3. ✅ Test all question types
4. ✅ Check mobile responsiveness (use browser dev tools)
5. ✅ Look at code structure

**Coming Soon:**
- Study Mode (timed practice)
- Practice Mode (unlimited practice)
- Mock Exam (full exam)
- Real AI provider integration
- Real authentication
- More questions
- Social features

---

**Status:** Ready to run! Just follow the 5 steps above. 🚀
