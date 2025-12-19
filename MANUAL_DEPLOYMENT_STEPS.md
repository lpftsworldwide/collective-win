# Manual Deployment Steps for COLLECTIVE-WINS

## ✅ Completed Code Changes

All code changes have been implemented:
- ✅ Games displaying (migration + fallback)
- ✅ Master Mode + $111 Hook logic
- ✅ Enhanced game mechanics (anticipation, cascading)
- ✅ Sound system complete
- ✅ Bonus system
- ✅ UI components (BonusDisplay, UserProfile)
- ✅ Rate limiting

## 📋 Manual Deployment Required

### Step 1: Deploy Supabase Migrations

Since Supabase CLI is not installed, deploy migrations manually:

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr
2. Navigate to **SQL Editor**
3. Run each migration in order:

**Migration 1: Populate Games**
```sql
-- Copy contents from: supabase/migrations/20251220092638_populate_custom_games.sql
```

**Migration 2: Admin Users**
```sql
-- Copy contents from: supabase/migrations/20251220092639_add_admin_users.sql
```

**Migration 3: Bonus System**
```sql
-- Copy contents from: supabase/migrations/20251220092640_add_bonus_system.sql
```

**Migration 4: Provably Fair**
```sql
-- Copy contents from: supabase/migrations/20251220092641_add_provably_fair.sql
```

**Migration 5: User Tiers**
```sql
-- Copy contents from: supabase/migrations/20251220092642_add_user_tiers.sql
```

**Migration 6: Rate Limiting**
```sql
-- Copy contents from: supabase/migrations/20251220092643_add_rate_limiting.sql
```

### Step 2: Deploy Edge Functions

1. Go to Supabase Dashboard → **Edge Functions**
2. For each function, click **Deploy** and upload:

**demo-spin**
- File: `supabase/functions/demo-spin/index.ts`
- Set secrets:
  - `SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co`
  - `SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>`

**claim-bonus**
- File: `supabase/functions/claim-bonus/index.ts`
- Set secrets (same as above)

### Step 3: Set Edge Function Secrets

In Supabase Dashboard → Edge Functions → Settings:
- Add `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
- Add `SUPABASE_SERVICE_ROLE_KEY` = (get from Settings → API)

### Step 4: Deploy to Vercel

Vercel CLI is available. Run:

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
vercel --prod --yes
```

Or deploy via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Import project from GitHub
3. Set environment variables:
   - `VITE_SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`
4. Deploy

## 🧪 Testing Checklist

After deployment:

- [ ] Games display in catalog (no "Failed to Load Games")
- [ ] Can click on a game and see game play screen
- [ ] Spin button works
- [ ] Sounds play (spin, win, reel stop)
- [ ] Anticipation works (2 scatters pause reels)
- [ ] Win calculations are correct
- [ ] $111 bonus can be claimed on sign-up
- [ ] Bonus display shows correctly
- [ ] User profile shows tier
- [ ] Rate limiting works (max 60 spins/min)

## 🎯 Master Mode Setup

To enable Master Mode for your account:

1. Go to Supabase Dashboard → SQL Editor
2. Run:
```sql
-- Replace YOUR_USER_ID with your actual user ID
INSERT INTO public.admin_users (user_id, is_master)
VALUES ('YOUR_USER_ID', true)
ON CONFLICT (user_id) DO UPDATE SET is_master = true;
```

## 📝 Notes

- All migrations are idempotent (safe to run multiple times)
- Edge functions use Deno runtime
- Frontend uses Vite + React
- All games use our custom engine (no external APIs needed)

