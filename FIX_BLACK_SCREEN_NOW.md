# 🚨 FIX BLACK SCREEN - IMMEDIATE ACTION REQUIRED

## ❌ Current Issue
**Black screen on https://collective-win.vercel.app**
**Error:** `supabaseUrl is required`

## ✅ SOLUTION: Set Vercel Environment Variables

### Step 1: Go to Vercel Dashboard
https://vercel.com/dashboard

### Step 2: Find Your Project
- Project: `collective-win` or `collective-win-git-main-lpftss-projects`
- Click on it

### Step 3: Go to Settings → Environment Variables
Add these EXACT variables (case-sensitive):

```
VITE_SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ
```

**IMPORTANT:**
- ✅ Must start with `VITE_` (Vite requirement)
- ✅ Set for **Production** environment (or "All Environments")
- ✅ After adding, **REDEPLOY** the site

### Step 4: Redeploy
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait 1-2 minutes

## 🔍 Verify Edge Functions Are Deployed

Check if functions are actually deployed:
```bash
curl https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/demo-spin
```

If you get 404, they're NOT deployed. Deploy them:
1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
2. Deploy `demo-spin` and `claim-bonus`

## ✅ After Fix
The site should:
- ✅ Load without black screen
- ✅ Show games catalog
- ✅ Allow clicking games
- ✅ Spin button works (if functions deployed)

