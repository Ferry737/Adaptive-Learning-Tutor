# Adaptive Learning Tutor

Installable AI-native tutor for Swiss apprenticeship preparation.

## 🎯 Mission

Build a measurable independent learning application that:
- Starts at the learner's demonstrated level
- Preserves evidence of what happened
- Uses the attempt → evaluate → explain → correct → retry → record → review loop

**Target:** Multiccheck (EBA), Wirtschaft und Administration, Kaufmann/Kauffrau EBA/EFZ pathways.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start (5 minutes)](#quick-start-5-minutes)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Milestones](#milestones)

## ⚙️ Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker Compose (for PostgreSQL)
- (Optional) ollama for local model inference

## 🚀 Quick Start (5 minutes)

```bash
# 1. Clone the repository
git clone <repository-url>
cd Adaptive-Learning-Tutor

# 2. Enable pnpm corepack
corepack enable

# 3. Install dependencies
pnpm install --frozen-lockfile

# 4. Start PostgreSQL database
docker compose up -d postgres

# 5. Run database migrations
pnpm db:migrate

# 6. Seed the database with initial curriculum data
pnpm db:seed

# 7. Start the development server
pnpm dev

# 8. Open http://localhost:3000 in your browser
```

That's it! You'll see a seeded diagnostic ready to use.

## 📁 Project Structure

```
Adaptive-Learning-Tutor/
├── apps/
│   └── web/                    # Next.js PWA application
│       ├── app/                # App Router pages
│       ├── components/         # React components
│       ├── lib/                # Utility functions
│       └── public/             # Static assets
├── packages/
│   ├── shared-schemas/         # Common types and Zod schemas
│   ├── learning-engine/        # Database access and business logic
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Complete ERD
│   │   │   └── seed.ts         # Initial curriculum data
│   │   └── src/
│   ├── tutor-agent/            # Tutor orchestration
│   ├── ai-gateway/             # Provider adapters
│   └── config/                 # Shared configs
├── db/
│   └── migrations/             # Database migrations
├── docs/                       # Documentation
│   ├── architecture.md
│   ├── test-plan.md
│   └── threat-model.md
├── e2e/                        # Playwright E2E tests
└── scripts/                    # Utility scripts
```

## 🛠️ Development

### Database Commands

```bash
# Create new migration
pnpm db:migrate

# Generate Prisma client
pnpm db:generate

# Start Prisma Studio (database UI)
pnpm db:studio

# Reset database (WARNING: deletes all data)
pnpm db:reset
```

### Project Commands

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Type checking
pnpm check

# Lint
pnpm lint

# Format code
pnpm format
```

### Package-specific Commands

```bash
# Web app
pnpm -F @adaptive/web dev
pnpm -F @adaptive/web build

# Learning engine
pnpm -F @adaptive/learning-engine db:migrate
pnpm -F @adaptive/learning-engine db:seed
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run integration tests only
pnpm test:integration

# Run E2E tests
pnpm test:e2e
```

### Test Pyramid

- **Many unit tests**: Scheduler, mastery, validators, curriculum graph
- **Fewer integration tests**: Repositories, auth, provider gateway
- **Few deterministic E2E tests**: Onboarding, diagnostic, attempt/retry

## 📦 Deployment

### Local Development

The app runs with a mock provider by default. To enable hosted providers:

1. Set `PROVIDER_MODE=hosted` in the environment
2. Add your provider credentials in the web app settings
3. Ensure `ENABLE_HOSTED_PROVIDER=true`

### Staging

```bash
# Build for production
pnpm build

# Start in production mode
pnpm start

# Or with Docker (if configured)
docker build -t adaptive-tutor .
docker run -p 3000:3000 adaptive-tutor
```

### Environment Variables

See [`apps/web/.env.example`](apps/web/.env.example) for all available variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Session signing key
- `NEXTAUTH_SECRET`: NextAuth security key
- `PROVIDER_MODE`: `mock`, `hosted`, `openai-compatible`, `ollama`, `lm-studio`
- `ENABLE_MOCK_PROVIDER`: Enable mock provider (default: true)
- `ENABLE_DIAGNOSTIC`: Enable diagnostic flow (default: true)
- `ENABLE_PERSIAN_LANGUAGE`: Enable Persian interface (default: true)
- `ENABLE_DETAILED_EXPLANATIONS`: Enable detailed feedback (default: true)
- `DAILY_USAGE_BUDGET`: Max API usage per user in minutes

## 🎯 Milestones

The project follows a staged release approach:

| Milestone | Status | Description |
|-----------|--------|-------------|
| M0 | 🟡 In Progress | Foundation and research (workspace, schema, contracts) |
| M1 | 🟢 Planned | Installable shell and identity (auth, sessions, settings) |
| M2 | 🔴 Pending | Deterministic mock provider |
| M3 | 🔴 Pending | Curriculum and skill graph |
| M4 | 🔴 Pending | Core tutor slice (German/mathematics loop) |
| M5 | 🔴 Pending | Adaptive diagnostic |
| M6-M10 | 🔴 Pending | Mathematics, German, cognitive modules, EBA, WA |
| M11-M15 | 🔴 Pending | Hosted providers, local connector, iPhone pairing, full exam, production hardening |

**First shippable slice:** Internal alpha (M4/M5) with German + mathematics foundation track.

## 📄 Documentation

- [Architecture](docs/architecture.md) - System design and component relationships
- [Test Plan](docs/test-plan.md) - Acceptance tests and verification strategy
- [Threat Model](docs/threat-model.md) - Security considerations and mitigations
- [Decision Log](docs/decision-log.md) - Architecture and design decisions
- [Design System](docs/design-system.md) - UI/UX guidelines and component library

## 🎓 Learning Science Principles

This application is built on evidence-based learning principles:

1. **Attempt-first approach**: Try before learning, not learn before trying
2. **Feedback timing**: Provide feedback after each attempt
3. **Spaced repetition**: Schedule review at optimal intervals
4. **Self-explanation**: Ask learners to explain their reasoning
5. **Interleaving**: Mix topics strategically (not random mixing)
6. **Hint reduction**: Gradually reduce hints as mastery improves
7. **Uncertainty labeling**: Never claim false precision

## 🤝 Contributing

This is an internal development project. External contributions are not currently accepted.

## 📝 License

Internal use only.

## ⚠️ Disclaimer

This is an independent learning and preparation application. It is **not affiliated with, endorsed by, or operated by gateway.one**. Practice questions are original simulations and are **not official Multicheck® test questions**.

Use official demo for interface familiarity:
- [gateway.one Multiccheck demo](https://www.gateway.one/it-CH/multicheck-demo.html)

---

**Built with:**
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Prisma](https://www.prisma.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/)
