# 🚀 DEPLOY FIXED EDGE FUNCTIONS

## ✅ FIXES APPLIED TO CODE:

1. **CORS Security** - Restricted to production domains only
2. **Rate Limiting** - Enforced (60 spins/minute)
3. **Security Headers** - Added proper CORS headers

## ⚠️ CRITICAL: Fix Function URL Mismatch

Your functions are deployed with **WRONG URL SLUGS**. You need to redeploy them.

### Step 1: Delete Old Functions

1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
2. Click on `claim-bonus` → Click "..." menu → Delete
3. Click on `demo-spin` → Click "..." menu → Delete

### Step 2: Set Required Secrets

1. Go to: Edge Functions → Secrets
2. Add/Verify these secrets exist:
   - `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (Your service role key from Supabase Dashboard → Settings → API)
   - `SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

### Step 3: Deploy Functions

**Option A: Using Supabase CLI (Recommended)**

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS

# Login to Supabase (if not already)
supabase login

# Link to your project
supabase link --project-ref yiorietrtfosjnpzznnr

# Deploy claim-bonus
supabase functions deploy claim-bonus --project-ref yiorietrtfosjnpzznnr

# Deploy demo-spin
supabase functions deploy demo-spin --project-ref yiorietrtfosjnpzznnr
```

**Option B: Using Supabase Dashboard**

1. Go to: Edge Functions → Deploy a new function
2. For `claim-bonus`:
   - Function name: `claim-bonus` (EXACTLY this)
   - Copy code from: `supabase/functions/claim-bonus/index.ts`
   - Paste and deploy
3. For `demo-spin`:
   - Function name: `demo-spin` (EXACTLY this)
   - Copy code from: `supabase/functions/demo-spin/index.ts`
   - Paste and deploy

### Step 4: Verify URLs

After deployment, check that:
- `claim-bonus` URL shows: `/functions/v1/claim-bonus` ✅
- `demo-spin` URL shows: `/functions/v1/demo-spin` ✅

**NOT:**
- ❌ `/functions/v1/super-endpo...`
- ❌ `/functions/v1/dynamic-res...`

## 🧪 TEST AFTER DEPLOYMENT:

1. **Test Signup Bonus:**
   ```bash
   curl -X POST https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/claim-bonus \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json"
   ```
   Should return: `{"success": true, "bonus_amount": 111}`

2. **Test Game Spin:**
   ```bash
   curl -X POST https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/demo-spin \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"gameId":"big-bass-splash","wager":1.0}'
   ```
   Should return: `{"success": true, "winAmount": ...}`

3. **Test Rate Limiting:**
   - Make 70+ spin requests in 1 minute
   - Should get: `{"error": "Rate limit exceeded", "status": 429}`

4. **Test CORS:**
   - Request from unauthorized domain should be blocked
   - Request from `collective-win.vercel.app` should work

## 📋 CHECKLIST:

- [ ] Old functions deleted
- [ ] Secrets set in Supabase Dashboard
- [ ] `claim-bonus` deployed with correct name
- [ ] `demo-spin` deployed with correct name
- [ ] URLs show correct slugs (`/functions/v1/claim-bonus`, `/functions/v1/demo-spin`)
- [ ] Signup bonus works
- [ ] Game spins work
- [ ] Rate limiting works
- [ ] CORS blocks unauthorized domains

## 🔐 SECURITY IMPROVEMENTS:

✅ **CORS Restricted:** Only allows requests from:
- `https://collective-win.vercel.app`
- `https://collective-win-git-main-lpftss-projects.vercel.app`
- `http://localhost:5173` (dev)
- `http://localhost:3000` (dev)

✅ **Rate Limiting:** Max 60 spins per minute per user

✅ **Service Role Key:** Using environment variables (secure)

✅ **RLS Policies:** All tables protected

