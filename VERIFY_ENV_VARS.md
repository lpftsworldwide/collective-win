# 🔍 VERIFY ENVIRONMENT VARIABLES IN VERCEL

## ❌ Site Still Shows Error After Redeploy

The error "supabaseUrl is required" means the `VITE_` env vars aren't being picked up.

## ✅ CHECK THESE IN VERCEL:

1. **Go to:** https://vercel.com/lpftss-projects/collective-wins-deploy/settings/environment-variables

2. **Verify these EXACT names exist:**
   - `VITE_SUPABASE_URL` (NOT `SUPABASE_URL`)
   - `VITE_SUPABASE_PUBLISHABLE_KEY` (NOT `SUPABASE_PUBLISHABLE_KEY`)

3. **Check Environment Settings:**
   - Click on each variable
   - Make sure **"Production"** is checked ✅
   - Also check **"Preview"** and **"Development"** if you want

4. **Verify Values:**
   - `VITE_SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

## ⚠️ COMMON MISTAKES:

- ❌ `SUPABASE_URL` (missing `VITE_` prefix)
- ❌ `NEXT_PUBLIC_SUPABASE_URL` (Next.js format, not Vite)
- ❌ Variables set only for "Preview" but not "Production"

## ✅ AFTER FIXING:

1. **Save** the environment variables
2. **Redeploy** again (Deployments → ... → Redeploy)
3. Wait 2-3 minutes
4. Test: https://collective-win.vercel.app

## 🧪 Quick Test:

After redeploy, the console should NOT show "supabaseUrl is required" error.

