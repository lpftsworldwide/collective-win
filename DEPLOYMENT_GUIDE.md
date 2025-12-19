# COLLECTIVE-WINS Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables

**Vercel Environment Variables (Frontend):**
- `VITE_SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

**Supabase Edge Function Secrets (Backend):**
- `SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>`

### 2. Database Migrations

All migrations must be applied:
- `20251220092638_populate_custom_games.sql` - Populate games
- `20251220092639_add_admin_users.sql` - Admin users for Master Mode
- `20251220092640_add_bonus_system.sql` - $111 bonus system
- `20251220092641_add_provably_fair.sql` - Provably fair verification
- `20251220092642_add_user_tiers.sql` - User tiers
- `20251220092643_add_rate_limiting.sql` - Rate limiting

## Deployment Steps

### Option 1: Automated Script

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
./deploy-all.sh
```

### Option 2: Manual Deployment

#### Step 1: Deploy Supabase Migrations

```bash
cd supabase
supabase link --project-ref yiorietrtfosjnpzznnr
supabase db push
```

Or apply migrations manually in Supabase Dashboard:
1. Go to Database → Migrations
2. Copy each migration SQL
3. Run in SQL Editor

#### Step 2: Deploy Edge Functions

```bash
supabase functions deploy demo-spin
supabase functions deploy claim-bonus
```

#### Step 3: Set Edge Function Secrets

In Supabase Dashboard → Edge Functions → Settings:
- Add `SUPABASE_URL`
- Add `SUPABASE_SERVICE_ROLE_KEY`

#### Step 4: Deploy to Vercel

```bash
vercel --prod --yes
```

Or via Vercel Dashboard:
1. Connect GitHub repository
2. Add environment variables
3. Deploy

## Post-Deployment Verification

### 1. Test Games Display
- Visit live site
- Verify games are showing in catalog
- Check no "Failed to Load Games" error

### 2. Test Game Play
- Click on a game
- Verify spin button works
- Check sounds play
- Verify win calculations

### 3. Test $111 Bonus
- Sign up new account
- Verify bonus is awarded
- Check bonus display shows correctly

### 4. Test Master Mode
- Add user to admin_users table with is_master=true
- Verify 98% win rate

### 5. Test Rate Limiting
- Try rapid spins
- Verify rate limit enforced (max 60/min)

## Troubleshooting

### Games Not Displaying
- Check database has games in `licensed_games` table
- Verify RLS policies allow SELECT
- Check frontend fallback to gameLibrary.ts

### Black Screen
- Verify Vercel env vars are set correctly
- Check browser console for errors
- Verify Supabase URL is correct

### Edge Functions Failing
- Check function secrets are set
- Verify service role key is correct
- Check function logs in Supabase Dashboard

### Build Failures
- Check all dependencies installed
- Verify TypeScript compiles
- Check for linting errors

## Support

- Supabase Dashboard: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr
- Vercel Dashboard: https://vercel.com/dashboard
- Project URL: https://collective-win.vercel.app (or your custom domain)

