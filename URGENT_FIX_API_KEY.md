# 🚨 URGENT: Fix "Unregistered API key" Error

## The Problem

**Error:** "Registration Failed - Unregistered API key"

This happens when:
- Supabase publishable key is incorrect
- Key has expired or been rotated
- Vercel environment variable is missing/wrong

---

## ✅ Quick Fix (5 minutes)

### 1. Get Correct Key from Supabase

**Go to:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/api

**Look for:** "Project API keys" section

**Copy:** The **"anon"** or **"public"** key (NOT service_role!)

**Format:** Should start with `eyJ...` (JWT) or `sb_...` (new format)

### 2. Update Vercel Environment Variable

**Go to:** https://vercel.com/dashboard

**Steps:**
1. Click on project: `collective-win`
2. Go to **Settings** → **Environment Variables**
3. Find or add: `VITE_SUPABASE_PUBLISHABLE_KEY`
4. **Paste the correct key** from Step 1
5. Select all environments: **Production**, **Preview**, **Development**
6. Click **Save**
7. **Redeploy** (or wait for auto-redeploy)

### 3. Verify Fix

1. Wait 1-2 minutes for Vercel to redeploy
2. Visit: https://collective-win.vercel.app/auth
3. Try registration again
4. Error should be gone!

---

## 🔍 Current Status

**Fallback key in code:** `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

**This might be expired** - need to get fresh key from Supabase Dashboard!

---

## ⚠️ Important Notes

- The **anon/public** key is safe to expose (it's public)
- The **service_role** key should NEVER be in frontend
- Always use environment variables in production
- The hardcoded fallback is just a backup

---

## 🎯 After Fix

- ✅ Registration will work
- ✅ Signup will succeed
- ✅ Email confirmation will work
- ✅ Bonus claim will work

---

**DO THIS NOW:** Get the correct key from Supabase and update Vercel! 🔑

