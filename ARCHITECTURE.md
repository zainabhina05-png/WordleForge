# WordForge Architecture

Complete architecture documentation for WordForge.

## Overview

WordForge is a full-stack web application built using modern technologies with a focus on scalability, maintainability, and user experience.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Next.js App Router, React 19, TailwindCSS, Framer Motion) │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│          (Next.js Server Components & Actions)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Service Layer                         │
│              (Business Logic & Game Engine)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Data Layer                           │
│               (Prisma ORM + PostgreSQL)                      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: UI library with latest features
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first CSS
- **shadcn/ui**: Component library
- **Framer Motion**: Animation library
- **Lucide Icons**: Icon system

### Backend
- **Next.js Server Actions**: Type-safe server functions
- **Prisma ORM**: Database toolkit
- **PostgreSQL**: Relational database
- **Clerk**: Authentication platform

### Infrastructure
- **Vercel**: Hosting & deployment
- **Neon**: Serverless PostgreSQL
- **Sentry**: Error monitoring
- **Vercel Analytics**: Performance tracking

## Directory Structure

```
wordforge/
├── .github/
│   └── workflows/          # CI/CD pipelines
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Authentication routes
│   │   ├── (protected)/   # Protected routes
│   │   ├── api/           # API routes
│   │   └── layout.tsx     # Root layout
│   ├── components/        # Reusable components
│   │   └── ui/            # shadcn/ui components
│   ├── features/          # Feature modules
│   │   └── game/          # Game feature
│   │       ├── components/
│   │       └── hooks/
│   ├── hooks/             # Global hooks
│   ├── lib/               # Utilities
│   ├── server/            # Server code
│   │   └── actions/       # Server actions
│   ├── services/          # Business logic
│   ├── tests/             # Test files
│   └── types/             # TypeScript types
└── package.json
```

## Core Features

### 1. Authentication System

**Flow:**
```
User → Clerk Auth → Webhook → Database User Creation → Session
```

**Components:**
- Clerk SDK for authentication
- Webhook handler for user sync
- Protected route middleware
- Session management

### 2. Game Engine

**Game Flow:**
```
Create Game → Select Word → Player Guesses → Evaluate → Update State → End Game
```

**Key Components:**
- `game-logic.ts`: Core game algorithms
- `WordService`: Word selection and management
- `game-actions.ts`: Server actions for game operations
- `use-game.ts`: Client-side game state

**Word Selection Algorithm:**
1. Filter by difficulty and length
2. Exclude recent 50 words
3. Random selection from pool
4. Track in user history

**Guess Evaluation:**
1. Compare guess with answer
2. Mark correct positions (green)
3. Mark present letters (yellow)
4. Mark absent letters (gray)
5. Handle duplicate letters

### 3. State Management

**Client State (Zustand):**
- Game state
- UI preferences
- Temporary data

**Server State (TanStack Query):**
- User data
- Statistics
- Leaderboards
- Achievements

**Database State (Prisma):**
- Persistent data
- Relationships
- Transactions

### 4. Data Model

**Core Entities:**

```typescript
User (Authentication)
  ↓
Profile (User preferences)
  ↓
Game (Game sessions)
  ↓
Guess (Individual guesses)

Word (Dictionary)
  ↓
DailyWord (Daily challenges)

Statistics (User stats)
Achievement (Unlockables)
Leaderboard (Rankings)
```

### 5. API Architecture

**Server Actions Pattern:**
```typescript
// Type-safe server function
'use server';

export async function createGame(input: CreateGameInput) {
  // Validate input
  // Check authentication
  // Business logic
  // Database operations
  // Return typed result
}
```

**Benefits:**
- Type safety end-to-end
- No API routes needed
- Automatic serialization
- Progressive enhancement

## Security

### Authentication
- Clerk handles OAuth flows
- JWT tokens for sessions
- Secure cookie storage
- Webhook signature verification

### Authorization
- Middleware checks on routes
- User verification in actions
- Rate limiting on APIs
- CSRF protection

### Data Protection
- Environment variables for secrets
- SQL injection prevention (Prisma)
- Input validation (Zod)
- XSS protection (React)

## Performance

### Optimizations
- Server-side rendering
- Static generation for landing page
- Code splitting
- Image optimization
- Database query optimization
- Connection pooling

### Caching Strategy
- React Server Components cache
- TanStack Query cache
- Browser cache headers
- Database query cache

## Testing Strategy

### Unit Tests (Vitest)
- Utility functions
- Game logic
- Validation schemas
- Components (isolated)

### Integration Tests
- Server actions
- Database operations
- API endpoints
- User flows

### E2E Tests (Playwright)
- Authentication flow
- Game play flow
- Statistics tracking
- Leaderboard updates

## Deployment

### Build Process
```
1. Install dependencies
2. Run type checking
3. Run linting
4. Run tests
5. Build Next.js app
6. Generate Prisma client
7. Deploy to Vercel
```

### Environment Stages
- **Development**: Local with hot reload
- **Preview**: Vercel preview deployments
- **Production**: Vercel production

## Monitoring

### Error Tracking (Sentry)
- Runtime errors
- API failures
- Database errors
- User-reported issues

### Performance (Vercel Analytics)
- Page load times
- Core Web Vitals
- User interactions
- Conversion funnels

### Logging
- Server action logs
- Database query logs
- Authentication logs
- Game event logs

## Scalability

### Database
- Connection pooling
- Query optimization
- Indexes on common queries
- Read replicas (future)

### Application
- Vercel auto-scaling
- Edge functions
- Static generation
- Incremental rendering

### Caching
- Multi-layer cache
- CDN for static assets
- API response caching
- Database query cache

## Future Enhancements

### Planned Features
1. Real-time multiplayer
2. Voice narration
3. Additional languages
4. Mobile apps
5. Social features
6. Tournament mode
7. Custom word lists
8. Advanced analytics

### Technical Debt
- Add comprehensive E2E tests
- Implement advanced caching
- Add database migrations versioning
- Performance optimization
- Accessibility audit

## Contributing

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Test coverage >95%
- Documentation required

### Development Workflow
1. Create feature branch
2. Write tests first (TDD)
3. Implement feature
4. Pass all checks
5. Create PR
6. Code review
7. Merge to main

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
