# 🚀 EXECUTE DEPLOYMENT NOW - STEP BY STEP

## ⚡ IMMEDIATE ACTION REQUIRED

Follow these steps **IN ORDER**. Do not skip any step.

---

## STEP 1: SQL MIGRATION (DO THIS FIRST - 5 MINUTES)

### File 1: REAL_MONEY_COMPLETE_MIGRATION.sql

1. **Open SQL Editor:**
   ```
   https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new
   ```

2. **Copy this file:**
   - File: `REAL_MONEY_COMPLETE_MIGRATION.sql`
   - Location: `/var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS/REAL_MONEY_COMPLETE_MIGRATION.sql`
   - **Copy ENTIRE file** (568 lines)

3. **Paste and Run:**
   - Paste into SQL Editor
   - Click **"Run"** or press `Ctrl+Enter`
   - Wait for "Success" message

### File 2: UPDATE_GAME_THUMBNAILS.sql

1. **In same SQL Editor, click "New Query"**

2. **Copy this file:**
   - File: `UPDATE_GAME_THUMBNAILS.sql`
   - Location: `/var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS/UPDATE_GAME_THUMBNAILS.sql`
   - **Copy ENTIRE file**

3. **Paste and Run:**
   - Paste into SQL Editor
   - Click **"Run"**
   - Wait for "Success" message

**✅ VERIFY:** Run this query:
```sql
SELECT COUNT(*) FROM public.licensed_games;
-- Should return: 50
```

---

## STEP 2: DEPLOY EDGE FUNCTIONS (10 MINUTES)

### Function 1: `spin`

1. **Go to Functions Dashboard:**
   ```
   https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
   ```

2. **Delete old function (if exists):**
   - Look for `demo-spin` or any function with wrong name
   - Click "..." → **Delete**

3. **Create new function:**
   - Click **"Deploy a new function"**
   - **Name:** `spin` (EXACTLY - lowercase, no hyphens)
   - Click **"Create function"**

4. **Copy function code:**
   - File: `supabase/functions/spin/index.ts`
   - Location: `/var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS/supabase/functions/spin/index.ts`
   - **Copy ENTIRE file** (613 lines)

5. **Paste and Deploy:**
   - Paste into function editor
   - Click **"Deploy"**

6. **Verify:**
   - URL should show: `/functions/v1/spin` ✅
   - If wrong, delete and recreate with exact name

### Function 2: `claim-bonus`

1. **Same Functions Dashboard:**
   ```
   https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
   ```

2. **Delete old function (if exists):**
   - Look for incorrectly named function
   - Click "..." → **Delete**

3. **Create new function:**
   - Click **"Deploy a new function"**
   - **Name:** `claim-bonus` (EXACTLY - with hyphen)
   - Click **"Create function"**

4. **Copy function code:**
   - File: `supabase/functions/claim-bonus/index.ts`
   - Location: `/var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS/supabase/functions/claim-bonus/index.ts`
   - **Copy ENTIRE file** (165 lines)

5. **Paste and Deploy:**
   - Paste into function editor
   - Click **"Deploy"**

6. **Verify:**
   - URL should show: `/functions/v1/claim-bonus` ✅

---

## STEP 3: TRIGGER VERCEL REBUILD (2 MINUTES)

### Option A: Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Find project: `collective-win`
3. Click on project
4. Go to **"Deployments"** tab
5. Click **"..."** on latest deployment
6. Click **"Redeploy"**
7. Wait 2-3 minutes

### Option B: Git Push (Automated)

Run this command:
```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
git commit --allow-empty -m "chore: trigger Vercel rebuild [deployment]"
git push
```

Wait 2-3 minutes for Vercel to rebuild.

---

## STEP 4: VERIFY EVERYTHING (5 MINUTES)

### 1. Test Live Site
- Visit: https://collective-win.vercel.app
- Should load without errors
- Check browser console (F12) - should be clean

### 2. Test Functions
Open browser console (F12) and run:
```javascript
// Test spin function
fetch('https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/spin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
}).then(r => r.text()).then(console.log)

// Test claim-bonus function
fetch('https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/claim-bonus', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
}).then(r => r.text()).then(console.log)
```

Both should return JSON (may be errors, but should respond).

### 3. Test Full Flow
- Sign up for new account
- Claim $111 bonus
- Play a game
- Everything should work!

---

## ✅ COMPLETION CHECKLIST

- [ ] SQL File 1 (`REAL_MONEY_COMPLETE_MIGRATION.sql`) executed successfully
- [ ] SQL File 2 (`UPDATE_GAME_THUMBNAILS.sql`) executed successfully
- [ ] Verified: `SELECT COUNT(*) FROM public.licensed_games;` returns 50
- [ ] `spin` function deployed with correct name
- [ ] `claim-bonus` function deployed with correct name
- [ ] Function URLs verified (`/functions/v1/spin`, `/functions/v1/claim-bonus`)
- [ ] Vercel rebuild triggered
- [ ] Live site loads without errors
- [ ] Functions respond to requests
- [ ] Signup flow works
- [ ] Bonus claim works
- [ ] Games can be played

---

## 🎯 QUICK REFERENCE

| Step | Time | Status |
|------|------|--------|
| SQL Migration | 5 min | ⏳ DO THIS NOW |
| Edge Functions | 10 min | ⏳ DO THIS NEXT |
| Vercel Rebuild | 2 min | ⏳ THEN THIS |
| Verification | 5 min | ⏳ FINALLY THIS |
| **TOTAL** | **~22 min** | **🚀 START NOW** |

---

**START WITH STEP 1 - SQL MIGRATION!** 🚀

