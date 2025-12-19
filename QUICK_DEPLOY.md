# 🚀 QUICK DEPLOYMENT GUIDE

## ✅ Code Status
- ✅ All code pushed to GitHub
- ✅ Vercel deployment ready (requires auth)
- ✅ All migrations created
- ✅ All edge functions updated

## 📋 Deployment Steps

### Step 1: Deploy Supabase Migrations (5 minutes)

**Option A: Via SQL Editor (Easiest)**
1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new
2. Open file: `DEPLOY_ALL_MIGRATIONS.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click "Run"
6. ✅ Done!

**Option B: Via Supabase CLI**
```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
npx supabase login
npx supabase link --project-ref yiorietrtfosjnpzznnr
npx supabase db push
```

### Step 2: Deploy Edge Functions (3 minutes)

**Via Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
2. For each function:
   - Click "Deploy" or "Update"
   - Upload the function file from `supabase/functions/[function-name]/index.ts`
   - Set secrets:
     - `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
     - `SUPABASE_SERVICE_ROLE_KEY` = (from Settings → API)

**Functions to deploy:**
- `demo-spin` (CRITICAL - handles all game spins)
- `claim-bonus` (CRITICAL - handles $111 bonus)

### Step 3: Verify Vercel Deployment (2 minutes)

1. Check deployment: https://vercel.com/dashboard
2. Verify environment variables are set:
   - `VITE_SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`
3. Visit live site: https://collective-win.vercel.app

### Step 4: Test Everything (5 minutes)

- [ ] Games display in catalog
- [ ] Can click on a game
- [ ] Spin button works
- [ ] Sounds play
- [ ] Wins calculate correctly
- [ ] $111 bonus can be claimed
- [ ] Anticipation works (2 scatters)
- [ ] Rate limiting works (max 60 spins/min)

## 🎯 Master Mode Setup

To enable Master Mode for your account:

```sql
-- Replace YOUR_USER_ID with your actual user ID from auth.users
INSERT INTO public.admin_users (user_id, is_master)
VALUES ('YOUR_USER_ID', true)
ON CONFLICT (user_id) DO UPDATE SET is_master = true;
```

## 📝 Files Ready for Deployment

- ✅ `DEPLOY_ALL_MIGRATIONS.sql` - All 6 migrations in one file
- ✅ `supabase/functions/demo-spin/index.ts` - Updated with Master Mode + $111 Hook
- ✅ `supabase/functions/claim-bonus/index.ts` - Updated bonus system
- ✅ All frontend code pushed to GitHub

## 🔗 Important Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Live Site**: https://collective-win.vercel.app
- **GitHub Repo**: https://github.com/lpftsworldwide/collective-win

## ⚡ Quick Start (Copy-Paste)

1. **Deploy Migrations:**
   - Open: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new
   - Copy: `DEPLOY_ALL_MIGRATIONS.sql`
   - Paste & Run

2. **Deploy Functions:**
   - Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
   - Deploy `demo-spin` and `claim-bonus`
   - Set secrets

3. **Test:**
   - Visit: https://collective-win.vercel.app
   - Sign up → Claim $111 bonus → Play games!
