# WordForge Deployment Guide

Complete guide for deploying WordForge to production.

## Prerequisites

- Vercel account
- Neon PostgreSQL account
- Clerk account
- GitHub repository

## 1. Database Setup (Neon)

### Create Database
1. Go to [Neon Console](https://console.neon.tech/)
2. Create new project: "wordforge"
3. Copy connection string
4. Save for environment variables

### Configure Connection
Connection string format:
```
postgresql://[user]:[password]@[hostname]/[database]?sslmode=require
```

## 2. Authentication Setup (Clerk)

### Create Application
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create new application: "WordForge"
3. Enable authentication methods:
   - Email/Password
   - Google OAuth
   - GitHub OAuth

### Get API Keys
Copy these values:
- Publishable Key
- Secret Key

### Configure Webhooks
1. Go to Webhooks section
2. Create endpoint: `https://your-domain.vercel.app/api/webhooks/clerk`
3. Subscribe to events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Copy webhook secret

### Update Redirect URLs
Set these in Clerk dashboard:
- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`
- After sign-in URL: `/dashboard`
- After sign-up URL: `/dashboard`

## 3. Vercel Deployment

### Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings

### Environment Variables
Add these in Vercel project settings:

```env
# Database
DATABASE_URL=postgresql://[neon-connection-string]

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Application - IMPORTANT: Include protocol (https://)
# Do NOT use just "your-domain.vercel.app" - this will cause build errors
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production

# Sentry (Optional)
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
```

**⚠️ CRITICAL**: The `NEXT_PUBLIC_APP_URL` variable MUST include the protocol (`https://`). Without it, the build will fail with "Invalid URL" error.

### Build Settings
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 20.x

### Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployed application

## 4. Database Migration

After first deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

## 5. Post-Deployment

### Verify Health
Visit: `https://your-domain.vercel.app/api/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-...",
  "database": "connected"
}
```

### Test Authentication
1. Visit application
2. Sign up with email
3. Try OAuth providers
4. Verify profile creation

### Seed Database
If database is empty:
```bash
npm run db:seed
```

## 6. Custom Domain (Optional)

### Add Domain
1. Go to Vercel project settings
2. Domains tab
3. Add custom domain
4. Follow DNS configuration instructions

### Update Environment
Update `NEXT_PUBLIC_APP_URL` to your custom domain

### Update Clerk
Update redirect URLs in Clerk dashboard to use custom domain

## 7. Monitoring

### Vercel Analytics
- Automatically enabled
- View in Vercel dashboard

### Sentry (Optional)
1. Create Sentry project
2. Add DSN to environment variables
3. Deploy to enable error tracking

## 8. Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
```

### Database Backups
Neon provides automatic backups. Configure retention period in Neon console.

### Monitor Performance
- Check Vercel Analytics
- Monitor Sentry errors
- Review database performance in Neon

## Troubleshooting

### Build Failures
- Check environment variables
- Verify Node version (20.x)
- Review build logs

### Database Connection Issues
- Verify connection string
- Check Neon project status
- Ensure SSL mode enabled

### Authentication Issues
- Verify Clerk keys
- Check redirect URLs
- Confirm webhook endpoint

### Performance Issues
- Enable caching
- Optimize database queries
- Use Vercel Edge Functions

## Security Checklist

- [ ] All environment variables set
- [ ] Webhook endpoints secured
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Database connection pooling configured
- [ ] Secrets not in code
- [ ] Error messages don't leak sensitive data

## Scaling Considerations

### Database
- Monitor connection count
- Consider connection pooling
- Use read replicas for high traffic

### Application
- Vercel auto-scales
- Use Edge Functions for better performance
- Implement caching strategies

### Costs
- Vercel: Free tier available
- Neon: Free tier with limits
- Clerk: Free tier with limits

## Support

For deployment issues:
1. Check Vercel logs
2. Review Neon status
3. Verify Clerk configuration
4. Open GitHub issue

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
