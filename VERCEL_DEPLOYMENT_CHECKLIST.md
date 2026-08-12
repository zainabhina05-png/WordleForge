# Vercel Deployment Checklist for WordleForge

Complete checklist for deploying WordleForge to Vercel production.

## Pre-Deployment (Complete These First)

- [ ] Ensure all commits are pushed to GitHub main branch
- [ ] Verify local build passes: `npm run build`
- [ ] All tests pass: `npm run test`
- [ ] No console errors or warnings in development

## Step 1: Set Up Neon Database

1. Go to [Neon Console](https://console.neon.tech/)
2. Create new project named "wordforge"
3. Copy the connection string (PostgreSQL format)
4. Keep this safe - you'll need it for Vercel

**Example format:**
```
postgresql://user:password@host/database?sslmode=require
```

## Step 2: Set Up Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create new application: "WordForge"
3. Copy these keys:
   - **Publishable Key** (starts with `pk_live_`)
   - **Secret Key** (starts with `sk_live_`)

4. Configure Clerk settings:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

5. Create Webhook:
   - Go to Webhooks
   - Create endpoint: `https://your-domain.vercel.app/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy **Webhook Secret** (starts with `whsec_`)

## Step 3: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your WordleForge repository from GitHub
5. Click "Import"

## Step 4: Configure Environment Variables

In Vercel project settings → Environment Variables, add ALL of these:

```
DATABASE_URL=postgresql://[your-neon-connection-string]
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_[your-key]
CLERK_SECRET_KEY=sk_live_[your-key]
CLERK_WEBHOOK_SECRET=whsec_[your-key]
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

**⚠️ CRITICAL**: 
- `NEXT_PUBLIC_APP_URL` **MUST** include `https://`
- Without protocol, build will fail with "Invalid URL" error
- If you get Vercel deployment URL, use it: `https://wordleforge-abc123.vercel.app`

## Step 5: Deploy

1. In Vercel project settings, click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. Verify build succeeds - you should see green checkmark
4. Copy your Vercel deployment URL

## Step 6: Update Clerk Webhook

1. Go back to Clerk Dashboard
2. Update Webhook endpoint URL to your Vercel domain:
   ```
   https://your-vercel-domain.vercel.app/api/webhooks/clerk
   ```

## Step 7: Verify Deployment

Visit your deployed app and check:

1. **Health Check**
   - Go to: `https://your-domain.vercel.app/api/health`
   - Should see: `{ "status": "healthy", "database": "connected" }`

2. **Authentication**
   - Click "Get Started"
   - Try sign-up with email
   - Should redirect to dashboard
   - Profile should be created

3. **Create Game**
   - Click "Play" or "Classic Game"
   - Game should load without "Invalid origin" error
   - Timer should display MM:SS format

4. **Cursor**
   - Phantom cursor should appear when hovering
   - Should NOT show as slime cursor

## Step 8: Add Custom Domain (Optional)

1. In Vercel project settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` in environment variables to your custom domain

## Troubleshooting

### Build Fails with "Invalid URL"
- Check `NEXT_PUBLIC_APP_URL` includes `https://`
- Ensure no typos in domain name

### "Invalid origin" error when creating game
- Verify `NEXT_PUBLIC_APP_URL` matches deployment domain
- Redeploy after updating environment variables

### Authentication not working
- Verify all Clerk keys are correct (no typos)
- Check Clerk dashboard has correct redirect URLs
- Verify webhook endpoint is configured

### Database connection timeout
- Check `DATABASE_URL` is correct
- Verify Neon project is active
- Try redeploying

### Cursor not showing
- Clear browser cache (Ctrl+Shift+R)
- Check `/public/phantom-cursor.svg` exists
- Verify F12 Network tab shows SVG loading with 200 status

## Post-Deployment

- [ ] Add to GitHub "About" section
- [ ] Update README with deployment URL
- [ ] Test on multiple browsers
- [ ] Share with testers
- [ ] Monitor Vercel analytics
- [ ] Set up error tracking (optional - Sentry)

## Important Notes

- First deployment may take 10-15 minutes
- Database cold-start adds 5-10s to first request
- All environment variables must be set before deployment
- Changes to env vars require redeployment

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## Emergency Rollback

If deployment breaks:

1. Go to Vercel Deployments tab
2. Find previous working deployment
3. Click "Promote to Production"
4. Investigate and fix issues before redeploying
