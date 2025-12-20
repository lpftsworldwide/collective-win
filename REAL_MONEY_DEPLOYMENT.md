# 💰 REAL MONEY GAMES - Deployment Ready

## ✅ Changes Made

### Removed All Demo Mode
- ✅ All games set to `is_demo_available = false` (real money only)
- ✅ Edge function uses `users.total_balance_aud` (real balance)
- ✅ Removed `demo_sessions` and `demo_spins` tables
- ✅ Created `game_spins` table for real money transactions
- ✅ Updated $111 bonus wagering requirement to 35x (real money standard)
- ✅ All references to "demo" removed from game logic

### Updated Migration
- ✅ Creates `game_providers` and `licensed_games` tables FIRST
- ✅ Creates `game_spins` table for real money spins
- ✅ All 50+ games configured for real money
- ✅ Master Mode still works (98% win for owners)
- ✅ $111 Hook still works (85% win when balance <= $111)

### Updated Edge Function
- ✅ Uses `users.total_balance_aud` for balance
- ✅ Logs to `game_spins` table
- ✅ Stores provably fair verification
- ✅ Real money transactions only

## 🚀 Deploy Now

### Step 1: Deploy SQL Migrations (2 minutes)

1. **Go to:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new
2. **Copy entire file:** `DEPLOY_ALL_MIGRATIONS.sql`
3. **Paste → Run**

**This creates:**
- `game_providers` table
- `licensed_games` table (50+ games)
- `game_spins` table (real money spins)
- `admin_users` table (Master Mode)
- `user_bonuses` table ($111 bonus)
- `user_tiers` table (Bronze/Silver/Gold/Platinum)
- `rate_limit_logs` table
- `provably_fair_verification` table

### Step 2: Deploy Edge Functions (3 minutes)

**demo-spin function:**
1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
2. Create/update `demo-spin` function
3. Copy: `supabase/functions/demo-spin/index.ts` (entire file)
4. Paste → Deploy
5. Set secrets:
   - `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (from Settings → API)

**claim-bonus function:**
1. Same page, create/update `claim-bonus`
2. Copy: `supabase/functions/claim-bonus/index.ts`
3. Paste → Deploy
4. Set secrets (same as above)

### Step 3: Verify Vercel (1 minute)

Vercel is already deployed and live:
- **URL:** https://collective-win.vercel.app
- **Status:** ✅ Ready

## 💵 Real Money Features

- **Real Balance:** Uses `users.total_balance_aud`
- **Real Transactions:** All spins logged to `game_spins`
- **Real Bonuses:** $111 sign-up bonus with 35x wagering requirement
- **Real Withdrawals:** Can withdraw once Silver tier ($30+ deposits)
- **Master Mode:** 98% win probability for owners
- **$111 Hook:** 85% win when balance <= $111 (psychological hook)

## 📋 Post-Deployment Checklist

- [ ] SQL migrations deployed
- [ ] Edge functions deployed
- [ ] Function secrets set
- [ ] Test deposit works
- [ ] Test spin with real balance
- [ ] Test $111 bonus claim
- [ ] Test Master Mode (for admin users)
- [ ] Test withdrawal (Silver tier+)

## 🔗 Quick Links

- **SQL Editor:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new
- **Functions:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
- **Live Site:** https://collective-win.vercel.app

---

**All code updated for REAL MONEY. Deploy migrations and functions to go live!**

