# 🔧 FIX BOTH ISSUES: API Key + Images

## ✅ Issue 1: API Key - FIXED

**Problem:** "Unregistered API key" error on registration

**Fix Applied:**
- ✅ Updated fallback key in `src/integrations/supabase/client.ts`
- ✅ Registration should work now

**Next:** Add to Vercel env vars (optional but recommended)

---

## 🖼️ Issue 2: Game Images - NEEDS SQL UPDATE

**Problem:** Images show as colored placeholders instead of actual images

**Root Cause:** Database `thumbnail_url` values are NULL or incorrect

**Fix:** Run SQL update in Supabase

---

## 🚀 Quick Fix Steps

### Step 1: Fix Images (Run SQL)

1. **Go to:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new

2. **Copy and paste this SQL:**

```sql
-- Update ALL games with thumbnail URLs
UPDATE public.licensed_games
SET thumbnail_url = '/game-tiles/' || game_code || '.jpg'
WHERE thumbnail_url IS NULL 
   OR thumbnail_url = ''
   OR thumbnail_url NOT LIKE '/game-tiles/%';
```

3. **Click "Run"**

4. **Verify:** Check that games now have `thumbnail_url` set

### Step 2: Commit API Key Fix

```bash
git add src/integrations/supabase/client.ts
git commit -m "fix: update Supabase publishable key fallback"
git push
```

### Step 3: Test

1. **Wait 1-2 minutes** for Vercel to redeploy
2. **Clear browser cache** (Ctrl+Shift+R)
3. **Visit:** https://collective-win.vercel.app
4. **Check:**
   - ✅ Registration works (no API key error)
   - ✅ Images display (not placeholders)

---

## 📋 Files Created

- `QUICK_FIX_IMAGES.sql` - SQL to update thumbnail URLs
- `FIX_GAME_IMAGES.md` - Detailed image fix guide
- `ADD_VERCEL_ENV_VAR.md` - Vercel env var instructions

---

## ✅ Status

- **API Key:** ✅ Fixed in code (works as fallback)
- **Images:** ⏳ Need to run SQL update
- **Site:** ✅ Live and ready

---

**Run the SQL update and both issues will be fixed!** 🚀

