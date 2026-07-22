# 🚀 Start the App Now!

## If you see ERR_CONNECTION_REFUSED, follow these steps:

### Step 1: Install pnpm (if not installed)
```bash
npm install -g pnpm
```

### Step 2: Install all dependencies
```bash
pnpm install
```

### Step 3: Start PostgreSQL database
```bash
docker compose up -d postgres
```

Wait for PostgreSQL to start (check: `docker ps`)

### Step 4: Generate database client and migrate
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

### Step 5: Start the Next.js development server
```bash
cd apps/web
pnpm dev
```

### Step 6: Open your browser
Go to: **http://localhost:3000**

---

## Quick One-Liner Commands

If you want to do it all at once:

```bash
# 1. Install dependencies
pnpm install

# 2. Start PostgreSQL
docker compose up -d postgres

# 3. Setup database
pnpm db:generate && pnpm db:migrate && pnpm db:seed

# 4. Start the app
cd apps/web && pnpm dev
```

Then open: **http://localhost:3000**

---

## 🎯 Sign In Credentials

**Email:** test@example.com  
**Password:** password123

---

## 🔍 Check if Server is Running

1. Look at your terminal - it should say:
   ```
   ▲ Next.js 14.0.4
   - Local:        http://localhost:3000
   ```

2. If you see "ready in XXX ms", the server is running!

3. If you see an error, let me know what it says and I'll help fix it.

---

## 🐛 Troubleshooting

### If you see "pnpm not found"
Run: `npm install -g pnpm`

### If you see "Docker not running"
Start Docker Desktop first, then run: `docker compose up -d postgres`

### If you see "migration failed"
Try: `pnpm db:reset` then `pnpm db:seed`

### If port 3000 is in use
Run: `cd apps/web && pnpm dev -- -p 3001`

### If you see any other error
Copy the error message and let me know what it says!
