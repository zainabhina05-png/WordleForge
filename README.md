# WordleForge

A full-stack word puzzle platform built with Next.js 14, featuring multiple game modes, animated UI, and per-user statistics.

---

## Features

- **Classic Mode** — Infinite word guessing with configurable difficulty
- **Time Attack** — Race against a countdown (Easy 5m · Medium 3m · Hard 1m30s)
- **Daily Challenge** — One shared puzzle per day, resets at midnight UTC
- **Hard Mode** — Revealed letters must be reused in subsequent guesses
- Animated game board, hero section, and stat cards
- Per-user statistics: win rate, streaks, average guesses, fastest win
- Leaderboard, profile, and game history
- Authenticated with Clerk (email + OAuth)
- Rate limiting, CSRF protection, and security headers out of the box
- 96 unit tests — all passing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Auth | Clerk |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Prisma |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Testing | Vitest |
| Deployment | Vercel |

---

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Clerk](https://clerk.com) application

### 1. Clone and install

```bash
git clone https://github.com/your-username/wordleforge.git
cd wordleforge
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed words and initial data
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

### 1. Clerk setup

In your Clerk dashboard, create a webhook pointing to:

```
https://your-app.vercel.app/api/webhooks/clerk
```

Subscribe to `user.created`, `user.updated`, and `user.deleted`. Copy the webhook secret.

### 2. Deploy

Push to GitHub, then import the repo into [Vercel](https://vercel.com). Add these environment variables in the Vercel project settings:

```env
DATABASE_URL=postgresql://...        # Neon production connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

Vercel auto-detects Next.js. Build command is `npm run build`, output is `.next`.

### 3. Post-deploy database migration

```bash
npm install -g vercel
vercel login
vercel link
vercel env pull .env.local
npx prisma migrate deploy
npm run db:seed
```

### 4. Verify

```
GET https://your-app.vercel.app/api/health
```

Should return `{ "status": "healthy", "database": "connected" }`.

---

## Scripts

```bash
npm run dev           # Dev server with hot reload
npm run build         # Production build
npm run start         # Run production build locally
npm run test          # Run all unit tests (96 tests)
npm run test:watch    # Watch mode
npm run lint          # ESLint
npm run type-check    # TypeScript check
npm run format        # Prettier
npm run db:studio     # Prisma Studio (database GUI)
npm run db:seed       # Seed words and data
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Sign-in / sign-up pages
│   ├── (protected)/      # Dashboard, game, leaderboard, profile
│   └── api/              # Webhooks, health check
├── components/           # Shared UI components
├── features/
│   └── game/
│       ├── components/   # GameBoard, GameTimer, Keyboard
│       └── hooks/        # useGame client state hook
├── lib/                  # Utilities, security, rate limiting
├── server/
│   └── actions/          # Server actions (createGame, submitGuess, etc.)
├── services/             # WordService (word selection logic)
├── tests/unit/           # Vitest unit tests
└── types/                # Shared TypeScript types
```

---

## Game Modes

| Mode | Attempts | Time Limit | Notes |
|---|---|---|---|
| Classic / Infinite | 6 (Medium) | None | Standard gameplay |
| Easy | 8 | None | Easier words |
| Hard | 5 | None | Must reuse revealed letters |
| Time Attack Easy | 6 | 5 minutes | Lose on timeout |
| Time Attack Medium | 6 | 3 minutes | Lose on timeout |
| Time Attack Hard | 5 | 1m 30s | Lose on timeout |
| Daily | 6 | None | Shared word, once per day |

---

## Security

- CSRF validation on all server actions
- Security headers: `Content-Security-Policy`, `HSTS`, `X-Frame-Options`, `X-Content-Type-Options`
- In-memory rate limiting (swap for Upstash Redis in production via `UPSTASH_REDIS_REST_URL`)
- Input validation with Zod on every server action
- Game answer never exposed to client until game ends
- Auth failure and rate limit events logged server-side

---

## License

MIT
