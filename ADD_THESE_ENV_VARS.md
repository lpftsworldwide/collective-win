# ✅ ADD THESE ENVIRONMENT VARIABLES TO VERCEL

## 🎯 What You Need to Add

In your Vercel Dashboard → Environment Variables, **ADD** these two:

### Variable 1:
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://yiorietrtfosjnpzznnr.supabase.co`
- **Environment:** Production (or All Environments)

### Variable 2:
- **Name:** `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value:** `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`
- **Environment:** Production (or All Environments)

## ⚠️ Why You Need These

You currently have:
- ❌ `SUPABASE_URL` (won't work - missing `VITE_` prefix)
- ❌ `SUPABASE_PUBLISHABLE_KEY` (won't work - missing `VITE_` prefix)
- ❌ `NEXT_PUBLIC_SUPABASE_URL` (Next.js format, not Vite)

**Vite only reads environment variables that start with `VITE_`**

## 📝 Steps:

1. Go to: https://vercel.com/lpftss-projects/collective-wins-deploy/settings/environment-variables
2. Click **"Add New"** button
3. Add `VITE_SUPABASE_URL` with value `https://yiorietrtfosjnpzznnr.supabase.co`
4. Click **"Add New"** again
5. Add `VITE_SUPABASE_PUBLISHABLE_KEY` with value `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`
6. **IMPORTANT:** After adding, go to **Deployments** tab and **Redeploy** the latest deployment

## ✅ After Redeploy

The black screen should be fixed and games should load!

