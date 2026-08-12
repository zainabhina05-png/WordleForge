# Getting Started with WordForge

Quick start guide to get WordForge running on your machine in under 10 minutes.

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 20+ installed ([Download](https://nodejs.org/))
- ✅ npm 10+ (comes with Node.js)
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/wordforge.git
cd wordforge
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~1-2 minutes).

## Step 3: Set Up Database

### Option A: Neon PostgreSQL (Recommended for Production)

1. Create account at [Neon](https://neon.tech/)
2. Create a new project named "wordforge"
3. Copy the connection string
4. Skip to Step 4

### Option B: Local PostgreSQL (For Development)

1. Install PostgreSQL locally
2. Create a database: `createdb wordforge`
3. Your connection string: `postgresql://localhost:5432/wordforge`

### Option C: Docker (Easiest for Development)

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d postgres

# Connection string is pre-configured in .env.example
```

## Step 4: Set Up Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Click "Create Application"
3. Name it "WordForge"
4. Enable authentication methods:
   - ✅ Email/Password
   - ✅ Google OAuth
   - ✅ GitHub OAuth
5. Copy your API keys

## Step 5: Environment Variables

Create `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Database (from Step 3)
DATABASE_URL="postgresql://user:password@host:5432/wordforge"

# Clerk (from Step 4)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Step 6: Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data (80 words + achievements)
npm run db:seed
```

## Step 7: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 8: Create Your First Account

1. Click "Get Started" or "Sign Up"
2. Choose authentication method
3. Complete sign up
4. You'll be redirected to the dashboard

## Step 9: Play Your First Game

1. From dashboard, click "Classic Game"
2. Start guessing!
3. Use keyboard or on-screen keyboard
4. Win to unlock your first achievement

## 🎉 You're Ready!

You now have WordForge running locally with:
- ✅ Authentication working
- ✅ Database connected
- ✅ Sample words loaded
- ✅ Achievements enabled
- ✅ Statistics tracking

## Common Issues & Solutions

### Issue: "DATABASE_URL is not defined"
**Solution**: Make sure you created `.env` file and added DATABASE_URL

### Issue: "Clerk keys not found"
**Solution**: Add Clerk keys to `.env` file

### Issue: "Port 3000 already in use"
**Solution**: Kill the process or use different port:
```bash
PORT=3001 npm run dev
```

### Issue: "Cannot connect to database"
**Solution**: 
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Try running `npm run db:push` again

### Issue: "No words available"
**Solution**: Run seed script:
```bash
npm run db:seed
```

## Next Steps

### Customize the Game
- Add more words to dictionary (see `prisma/seed.ts`)
- Adjust difficulty levels
- Customize color scheme (see `tailwind.config.ts`)

### Development Commands
```bash
npm run dev          # Start dev server
npm test             # Run tests
npm run lint         # Check code quality
npm run type-check   # Check TypeScript
```

### Deploy to Production
See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide to Vercel.

## Learning Resources

### Project Documentation
- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [CONTRIBUTING.md](./CONTRIBUTING.md) - How to contribute
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

### Technology Docs
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Prisma](https://www.prisma.io/docs)
- [Clerk](https://clerk.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Development Tips

### VS Code Extensions (Recommended)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- TypeScript

### Useful Commands
```bash
# Database
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:push      # Update database schema
npm run db:seed      # Re-seed database

# Development
npm run dev          # Start with hot reload
npm run build        # Test production build
npm run start        # Run production build

# Code Quality
npm run lint         # Find issues
npm run format       # Fix formatting
npm run type-check   # Check types
```

### Hot Reload
The development server supports hot reload. Changes to:
- React components → Instant update
- Server actions → Automatic refresh
- CSS/Tailwind → Instant update
- Database schema → Requires `npm run db:push`

## Troubleshooting

### Clear Everything and Start Fresh
```bash
# Remove dependencies
rm -rf node_modules
rm package-lock.json

# Remove Next.js cache
rm -rf .next

# Reinstall
npm install

# Reset database
npm run db:push
npm run db:seed
```

### Check Service Status
```bash
# Test database connection
npm run db:studio

# Test application
curl http://localhost:3000/api/health
```

### Get Help
- Check existing [GitHub Issues](https://github.com/yourusername/wordforge/issues)
- Review documentation files
- Check application logs
- Verify environment variables

## Success Checklist

After setup, verify:
- [ ] Can access http://localhost:3000
- [ ] Can sign up with email
- [ ] Can sign in with email
- [ ] Can see dashboard
- [ ] Can start a game
- [ ] Can submit guesses
- [ ] Can win a game
- [ ] Statistics are tracking
- [ ] Achievements can unlock

All checked? You're ready to develop! 🚀

## What's Next?

1. **Explore the Code**: Check `src/` directory structure
2. **Read Architecture**: See how components fit together
3. **Run Tests**: `npm test` to see test examples
4. **Make Changes**: Edit components and see hot reload
5. **Add Words**: Expand dictionary in `prisma/seed.ts`
6. **Deploy**: Follow DEPLOYMENT.md when ready

## Support

Need help?
- 📖 Read the documentation
- 🐛 Check GitHub Issues
- 💬 Ask questions (create new issue)
- 📧 Email: support@wordforge.example.com

Happy coding! 🎮
