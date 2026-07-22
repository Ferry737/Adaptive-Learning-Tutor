# Bootstrap Guide

This guide will get your Adaptive Learning Tutor up and running.

## Prerequisites

✅ **Node.js v24.14.0** (installed)
✅ **npm v11.11.1** (installed)

⚠️ **Missing:**
- pnpm package manager
- Docker Desktop (for PostgreSQL)

## Step 1: Install pnpm

Open your terminal and run:

```bash
npm install -g pnpm
```

Or if you have corepack:

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Step 2: Install Dependencies

```bash
pnpm install --frozen-lockfile
```

This will install all packages in the monorepo.

## Step 3: Start PostgreSQL Database

**Option A: Docker Compose (Recommended)**

Make sure Docker Desktop is running, then:

```bash
docker compose up -d postgres
```

**Option B: Local PostgreSQL**

If you have PostgreSQL installed locally:

1. Create a database named `adaptive_learning_tutor`
2. Update `packages/learning-engine/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Add to `.env` (in project root):
   ```
   DATABASE_URL=postgresql://your-username:your-password@localhost:5432/adaptive_learning_tutor?schema=public
   ```

## Step 4: Run Database Migrations

```bash
pnpm db:migrate
```

This will create all tables based on the Prisma schema.

## Step 5: Seed the Database

```bash
pnpm db:seed
```

This will create:
- Target exams (EBA, WA, KA-EBA, KA-EFZ)
- Curriculum sources
- Domains and skills
- Sample questions and activities
- Mock exam structure
- Test user (test@example.com / password123)

## Step 6: Start Development Server

```bash
pnpm dev
```

Then open: **http://localhost:3000**

## Verification

After bootstrapping, verify:

1. ✅ PostgreSQL is running (check with `docker ps` or `psql` connection)
2. ✅ Database has 50+ tables (run `pnpm db:studio` to see the database UI)
3. ✅ Seed data exists (test user, skills, questions)
4. ✅ Dev server starts without errors

## Troubleshooting

**Issue: Docker not running**
- Solution: Start Docker Desktop

**Issue: pnpm not found**
- Solution: Install globally with `npm install -g pnpm`

**Issue: Migration fails**
- Solution: Check DATABASE_URL is correct, try `pnpm db:reset` to wipe and rebuild

**Issue: Seed fails**
- Solution: Run `pnpm db:reset` first, then `pnpm db:seed`

## What's Been Built

See `.claude/BUILD_SUMMARY.md` for details on all completed work.

## Next Steps

Once booted, you can:

1. View the seeded diagnostic at http://localhost:3000
2. Sign in with test user: test@example.com
3. Start practicing German and mathematics questions
4. Run tests: `pnpm test`
5. Build for production: `pnpm build`

---

**Status:** Foundation complete. Waiting for user to install pnpm and run bootstrap commands.
