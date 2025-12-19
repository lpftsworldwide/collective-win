# ✅ Edge Functions Ready for Deployment

## 📦 Functions Created

### 1. demo-spin (595 lines)
**File:** `supabase/functions/demo-spin/index.ts`
**Status:** ✅ Complete and ready

**Features:**
- Master Mode (98% win probability for owners)
- $111 Hook (85% win when balance <= $111)
- Game-specific configs (Fortune Tiger, Sweet Bonanza, Gates of Olympus)
- Rate limiting (60 spins/minute)
- Provably fair verification
- Complete win calculation with multipliers

### 2. claim-bonus (161 lines)
**File:** `supabase/functions/claim-bonus/index.ts`
**Status:** ✅ Complete and ready

**Features:**
- $111 sign-up bonus claim
- One-time claim per user
- Fraud prevention
- Audit logging
- Integration with user_bonuses table

## 🚀 Deployment Instructions

### Quick Deploy (5 minutes)

1. **Go to Supabase Dashboard:**
   https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions

2. **Deploy demo-spin:**
   - Click "Create Function" or find `demo-spin`
   - Copy entire contents from `supabase/functions/demo-spin/index.ts`
   - Paste and deploy
   - Set secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

3. **Deploy claim-bonus:**
   - Click "Create Function" or find `claim-bonus`
   - Copy entire contents from `supabase/functions/claim-bonus/index.ts`
   - Paste and deploy
   - Set secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PUBLISHABLE_KEY`

### Detailed Guide

See: `QUICK_DEPLOY_FUNCTIONS.md` for step-by-step instructions

## 🔑 Required Secrets

Both functions need these secrets (set in Supabase Dashboard → Functions → Settings → Secrets):

- `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (Get from Settings → API → service_role key)

**claim-bonus also needs:**
- `SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

## 📋 Pre-Deployment Checklist

Before deploying functions, ensure:

- [ ] Migrations are deployed (run `DEPLOY_ALL_MIGRATIONS.sql` first)
- [ ] Tables exist: `admin_users`, `user_bonuses`, `user_tiers`, `rate_limit_logs`
- [ ] Service role key is available

## 🧪 Post-Deployment Testing

After deployment, test:

1. **Test demo-spin:**
   ```bash
   curl -X POST \
     https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/demo-spin \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"gameId": "fortune-tiger", "wager": 1.00}'
   ```

2. **Test claim-bonus:**
   ```bash
   curl -X POST \
     https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/claim-bonus \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json"
   ```

3. **Test in frontend:**
   - Visit: https://collective-win.vercel.app
   - Sign up → Claim bonus → Play games

## 🔗 Quick Links

- **Functions Dashboard:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
- **API Settings:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/api
- **Function Files:**
  - `supabase/functions/demo-spin/index.ts`
  - `supabase/functions/claim-bonus/index.ts`

## 📝 Files Created

- ✅ `QUICK_DEPLOY_FUNCTIONS.md` - Quick deployment guide
- ✅ `EDGE_FUNCTIONS_DEPLOY.md` - Detailed deployment guide
- ✅ `deploy-edge-functions.sh` - Automated deployment script
- ✅ `EDGE_FUNCTIONS_READY.md` - This file

## ✅ Next Steps

1. **Deploy Migrations First:**
   - Run `DEPLOY_ALL_MIGRATIONS.sql` in Supabase SQL Editor

2. **Deploy Functions:**
   - Follow `QUICK_DEPLOY_FUNCTIONS.md`

3. **Test Everything:**
   - Visit live site
   - Sign up → Claim bonus → Play games

---

**All edge functions are ready! Deploy them via Supabase Dashboard in ~5 minutes.**

