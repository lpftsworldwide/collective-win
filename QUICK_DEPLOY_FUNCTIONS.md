# ⚡ QUICK DEPLOY: Edge Functions

## 🎯 Ready to Deploy

Both edge functions are complete and ready:
- ✅ `demo-spin` (595 lines) - Complete with Master Mode + $111 Hook
- ✅ `claim-bonus` (161 lines) - Complete bonus system

## 🚀 Deploy in 3 Steps (5 minutes)

### Step 1: Deploy demo-spin Function

1. **Go to:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions

2. **Click:** "Create Function" or find existing `demo-spin`

3. **Function Name:** `demo-spin`

4. **Copy entire file:** `supabase/functions/demo-spin/index.ts`
   - Open the file
   - Select all (Ctrl+A / Cmd+A)
   - Copy (Ctrl+C / Cmd+C)

5. **Paste into Supabase editor**

6. **Click:** "Deploy"

7. **Set Secrets:**
   - Go to Settings → Secrets
   - Add:
     - `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
     - `SUPABASE_SERVICE_ROLE_KEY` = (Get from Settings → API → service_role key)

### Step 2: Deploy claim-bonus Function

1. **Click:** "Create Function" or find existing `claim-bonus`

2. **Function Name:** `claim-bonus`

3. **Copy entire file:** `supabase/functions/claim-bonus/index.ts`
   - Open the file
   - Select all (Ctrl+A / Cmd+A)
   - Copy (Ctrl+C / Cmd+C)

4. **Paste into Supabase editor**

5. **Click:** "Deploy"

6. **Set Secrets:**
   - Go to Settings → Secrets
   - Add:
     - `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
     - `SUPABASE_SERVICE_ROLE_KEY` = (Get from Settings → API → service_role key)
     - `SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

### Step 3: Verify Deployment

**Test demo-spin:**
```bash
# Should return function response (may need auth)
curl https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/demo-spin
```

**Test claim-bonus:**
```bash
# Should return function response (may need auth)
curl https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/claim-bonus
```

## 📋 Function Details

### demo-spin
- **Endpoint:** `/functions/v1/demo-spin`
- **Method:** POST
- **Auth:** Required (JWT token)
- **Features:**
  - Master Mode (98% win for owners)
  - $111 Hook (85% win when balance <= $111)
  - Game-specific configs
  - Rate limiting (60 spins/min)
  - Provably fair

### claim-bonus
- **Endpoint:** `/functions/v1/claim-bonus`
- **Method:** POST
- **Auth:** Required (JWT token)
- **Features:**
  - One-time $111 bonus claim
  - Fraud prevention
  - Audit logging

## 🔗 Quick Links

- **Functions Dashboard:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
- **API Settings:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/api
- **Function Files:**
  - `supabase/functions/demo-spin/index.ts`
  - `supabase/functions/claim-bonus/index.ts`

## ✅ Post-Deployment Checklist

- [ ] demo-spin deployed
- [ ] claim-bonus deployed
- [ ] All secrets set
- [ ] Functions accessible
- [ ] Test spin works
- [ ] Test bonus claim works

---

**Total Time: ~5 minutes**

