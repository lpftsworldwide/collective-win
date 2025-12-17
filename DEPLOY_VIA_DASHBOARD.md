# 🚀 Deploy to Vercel via Dashboard (Recommended)

The CLI is having issues with the uppercase directory name. Here's the easiest way:

## Step 1: Import from GitHub

1. **Go to:** https://vercel.com/new
2. **Click:** "Import Git Repository"
3. **Select:** `lpftsworldwide/collective-win`
4. **Click:** "Import"

## Step 2: Configure Project

Vercel will auto-detect:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`

**Project Name:** It will suggest `collective-win` (lowercase) - keep it!

## Step 3: Add Environment Variables

**BEFORE clicking Deploy**, click "Environment Variables" and add:

```
VITE_SUPABASE_URL = https://yiorietrtfosjnpzznnr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ
```

## Step 4: Deploy!

Click **"Deploy"** and wait ~2 minutes.

## Step 5: Your Site is Live! 🎉

Your site will be at: `https://collective-win.vercel.app`

---

**This is the fastest way to deploy!** The dashboard method avoids the CLI directory name issue.

