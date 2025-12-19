# 🚀 Edge Functions Deployment Guide

## Functions Ready for Deployment

### 1. `demo-spin` (595 lines)
**Purpose:** Handles all game spins with Master Mode and $111 Hook
**Location:** `supabase/functions/demo-spin/index.ts`

**Features:**
- ✅ Master Mode (98% win probability)
- ✅ $111 Hook (85% win when balance <= $111)
- ✅ Game-specific configs (Fortune Tiger, Sweet Bonanza, Gates of Olympus)
- ✅ Rate limiting (60 spins/min)
- ✅ Provably fair verification
- ✅ Complete win calculation

**Required Secrets:**
- `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (from Settings → API)

### 2. `claim-bonus` (161 lines)
**Purpose:** Handles $111 sign-up bonus claims
**Location:** `supabase/functions/claim-bonus/index.ts`

**Features:**
- ✅ One-time claim per user
- ✅ Fraud prevention
- ✅ Audit logging
- ✅ Integration with user_bonuses table

**Required Secrets:**
- `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = (from Settings → API)
- `SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

## Deployment Methods

### Method 1: Supabase CLI (Recommended)

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS

# Login to Supabase
npx supabase login

# Link to project
npx supabase link --project-ref yiorietrtfosjnpzznnr

# Deploy functions
npx supabase functions deploy demo-spin
npx supabase functions deploy claim-bonus

# Set secrets (via Dashboard or CLI)
# Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
# Click each function → Settings → Secrets
```

### Method 2: Supabase Dashboard (Manual)

1. **Go to Edge Functions:**
   https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions

2. **For each function:**

   **demo-spin:**
   - Click "Create Function" or find existing `demo-spin`
   - Name: `demo-spin`
   - Copy entire contents from `supabase/functions/demo-spin/index.ts`
   - Paste into editor
   - Click "Deploy"
   - Go to Settings → Secrets
   - Add:
     - `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
     - `SUPABASE_SERVICE_ROLE_KEY` = (from Settings → API → service_role key)

   **claim-bonus:**
   - Click "Create Function" or find existing `claim-bonus`
   - Name: `claim-bonus`
   - Copy entire contents from `supabase/functions/claim-bonus/index.ts`
   - Paste into editor
   - Click "Deploy"
   - Go to Settings → Secrets
   - Add:
     - `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
     - `SUPABASE_SERVICE_ROLE_KEY` = (from Settings → API → service_role key)
     - `SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

### Method 3: Automated Script

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
./deploy-edge-functions.sh
```

## Verification

After deployment, test the functions:

### Test demo-spin:
```bash
curl -X POST \
  https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/demo-spin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": "fortune-tiger",
    "wager": 1.00
  }'
```

### Test claim-bonus:
```bash
curl -X POST \
  https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/claim-bonus \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## Troubleshooting

### Function not found (404)
- Verify function is deployed
- Check function name matches exactly
- Ensure project is linked correctly

### Authentication errors (401)
- Verify JWT token is valid
- Check function secrets are set
- Ensure service role key is correct

### Database errors
- Verify migrations are deployed first
- Check tables exist (user_bonuses, admin_users, etc.)
- Verify RLS policies allow function access

## Post-Deployment Checklist

- [ ] Both functions deployed successfully
- [ ] All secrets set correctly
- [ ] Functions accessible via API
- [ ] demo-spin returns valid outcomes
- [ ] claim-bonus creates bonus records
- [ ] Rate limiting works (test rapid spins)
- [ ] Master Mode works (test with admin user)

## Quick Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr
- **Edge Functions**: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
- **API Settings**: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/api

