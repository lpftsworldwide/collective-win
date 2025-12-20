# 🚀 MANUAL DEPLOYMENT VIA DASHBOARD (No CLI Required)

## ⚠️ Supabase CLI Login Issue

If you're seeing "Failed to create login session" errors, use this **dashboard-only** method instead.

**No CLI authentication needed!** Everything is done through the Supabase and Vercel web dashboards.

---

## 📋 STEP-BY-STEP DEPLOYMENT

### STEP 1: SQL Migration (Supabase Dashboard)

**Time:** 5 minutes

1. **Open SQL Editor:**
   - Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new

2. **Copy SQL File 1:**
   - Open: `REAL_MONEY_COMPLETE_MIGRATION.sql`
   - Copy **ENTIRE file** (all 568 lines)
   - Paste into SQL Editor
   - Click **"Run"** (or press `Ctrl+Enter`)
   - Wait for "Success" message (10-30 seconds)

3. **Copy SQL File 2:**
   - Open: `UPDATE_GAME_THUMBNAILS.sql`
   - Copy **ENTIRE file**
   - Paste into SQL Editor (new query)
   - Click **"Run"**
   - Wait for "Success" message

4. **Verify:**
   ```sql
   SELECT COUNT(*) FROM public.licensed_games;
   -- Should return: 50
   ```

---

### STEP 2: Deploy Edge Functions (Supabase Dashboard)

**Time:** 10 minutes

#### Function 1: `spin`

1. **Go to Functions:**
   - https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions

2. **Delete old function (if exists):**
   - Look for `demo-spin` or any incorrectly named function
   - Click "..." → **Delete**

3. **Deploy new function:**
   - Click **"Deploy a new function"**
   - **Function name:** `spin` (EXACTLY - lowercase, no hyphens)
   - Click **"Create function"**

4. **Copy function code:**
   - Open: `supabase/functions/spin/index.ts`
   - Copy **ENTIRE file** (all 613 lines)
   - Paste into the function editor
   - Click **"Deploy"**

5. **Verify URL:**
   - Should show: `/functions/v1/spin` ✅
   - If it shows something else, the name is wrong - delete and recreate

#### Function 2: `claim-bonus`

1. **Same dashboard:**
   - https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions

2. **Delete old function (if exists):**
   - Look for incorrectly named function
   - Click "..." → **Delete**

3. **Deploy new function:**
   - Click **"Deploy a new function"**
   - **Function name:** `claim-bonus` (EXACTLY - with hyphen)
   - Click **"Create function"**

4. **Copy function code:**
   - Open: `supabase/functions/claim-bonus/index.ts`
   - Copy **ENTIRE file** (all 165 lines)
   - Paste into the function editor
   - Click **"Deploy"**

5. **Verify URL:**
   - Should show: `/functions/v1/claim-bonus` ✅

---

### STEP 3: Set Function Secrets (If Needed)

**Time:** 2 minutes

Some functions may need environment variables:

1. **Go to each function:**
   - Click on `spin` → **Settings** → **Secrets**
   - Click on `claim-bonus` → **Settings** → **Secrets**

2. **Add secrets (if needed):**
   - `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (from Settings → API → Service Role Key)

3. **Save**

**Note:** Most functions work without secrets if they use the default Supabase client.

---

### STEP 4: Trigger Vercel Rebuild

**Time:** 2 minutes

**Option A: Vercel Dashboard (Easiest)**

1. Go to: https://vercel.com/dashboard
2. Find project: `collective-win`
3. Click on project
4. Go to **"Deployments"** tab
5. Click **"..."** on latest deployment
6. Click **"Redeploy"**
7. Wait 2-3 minutes for rebuild

**Option B: Push Empty Commit**

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
git commit --allow-empty -m "chore: trigger Vercel rebuild"
git push
```

Wait 2-3 minutes for Vercel to auto-rebuild.

---

### STEP 5: Verify Deployment

**Time:** 5 minutes

1. **Test Live Site:**
   - Visit: https://collective-win.vercel.app
   - Should load without errors
   - Check browser console (F12) for errors

2. **Test Edge Functions:**
   - Open browser console (F12)
   - Run:
   ```javascript
   fetch('https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/spin', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({})
   }).then(r => r.text()).then(console.log)
   ```
   - Should return JSON (may be error, but should respond)

3. **Test Signup Flow:**
   - Create new account
   - Claim $111 bonus
   - Play a game

---

## ✅ Deployment Checklist

- [ ] SQL migration completed (both files)
- [ ] `spin` function deployed with correct name
- [ ] `claim-bonus` function deployed with correct name
- [ ] Function URLs verified (`/functions/v1/spin`, `/functions/v1/claim-bonus`)
- [ ] Vercel rebuild triggered
- [ ] Live site loads without errors
- [ ] Signup flow works
- [ ] Bonus claim works
- [ ] Games can be played

---

## 🔧 Troubleshooting

### "Function name already exists"

**Solution:** Delete the old function first, then create new one with exact name.

---

### "Function URL is wrong"

**Problem:** Function name doesn't match what code expects.

**Solution:**
- Code expects: `spin` and `claim-bonus`
- Function name MUST match exactly
- Delete and recreate with correct name

---

### "Vercel site shows old code"

**Problem:** Vercel hasn't rebuilt yet.

**Solution:**
- Wait 2-3 minutes
- Or manually trigger rebuild in Vercel dashboard
- Or push empty commit to GitHub

---

### "Functions return 404"

**Problem:** Function name mismatch or not deployed.

**Solution:**
1. Check function name in Supabase dashboard
2. Verify URL shows `/functions/v1/spin` (not `/functions/v1/demo-spin`)
3. Redeploy function if needed

---

## 🎯 Quick Reference

| Step | Method | Time |
|------|--------|------|
| SQL Migration | Dashboard (copy/paste) | 5 min |
| Edge Functions | Dashboard (copy/paste) | 10 min |
| Vercel Rebuild | Dashboard (redeploy) | 2 min |
| Verification | Browser testing | 5 min |
| **Total** | **Dashboard Only** | **~22 min** |

---

## 🚀 Ready to Deploy?

Follow the steps above in order. No CLI needed - everything is done through web dashboards!

**Estimated total time: ~22 minutes**

---

**Last Updated:** 2024-12-20

