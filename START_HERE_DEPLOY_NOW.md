# 🚀 START HERE - DEPLOY NOW

## ⚡ IMMEDIATE ACTION - DO THESE STEPS IN ORDER

---

## ✅ STEP 1: SQL MIGRATION (5 MINUTES) - DO THIS FIRST!

### Open SQL Editor:
👉 **https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new**

### Copy File 1:
1. Open: `REAL_MONEY_COMPLETE_MIGRATION.sql` (28KB, 568 lines)
2. **Copy ENTIRE file**
3. Paste into SQL Editor
4. Click **"Run"**
5. Wait for "Success"

### Copy File 2:
1. Click **"New Query"** in SQL Editor
2. Open: `UPDATE_GAME_THUMBNAILS.sql` (1.9KB)
3. **Copy ENTIRE file**
4. Paste into SQL Editor
5. Click **"Run"**
6. Wait for "Success"

**✅ VERIFY:**
```sql
SELECT COUNT(*) FROM public.licensed_games;
-- Should return: 50
```

---

## ✅ STEP 2: DEPLOY FUNCTIONS (10 MINUTES)

### Function: `spin`

👉 **https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions**

1. Delete old `demo-spin` if exists
2. Click **"Deploy a new function"**
3. Name: `spin` (EXACTLY)
4. Copy ENTIRE file: `supabase/functions/spin/index.ts` (20KB, 613 lines)
5. Paste and **Deploy**
6. Verify URL: `/functions/v1/spin` ✅

### Function: `claim-bonus`

1. Same dashboard
2. Click **"Deploy a new function"**
3. Name: `claim-bonus` (EXACTLY - with hyphen)
4. Copy ENTIRE file: `supabase/functions/claim-bonus/index.ts` (5.8KB, 165 lines)
5. Paste and **Deploy**
6. Verify URL: `/functions/v1/claim-bonus` ✅

---

## ✅ STEP 3: VERCEL REBUILD (2 MINUTES)

👉 **https://vercel.com/dashboard**

1. Find project: `collective-win`
2. Click project → **Deployments**
3. Click **"..."** → **"Redeploy"**
4. Wait 2-3 minutes

**OR** (if git push worked):
- Vercel will auto-rebuild (already triggered)

---

## ✅ STEP 4: TEST (5 MINUTES)

### Test Site:
👉 **https://collective-win.vercel.app**

- Should load without errors
- Check console (F12) - should be clean

### Test Functions:
Open browser console (F12):
```javascript
fetch('https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/spin', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: '{}'
}).then(r => r.text()).then(console.log)
```

### Test Full Flow:
- Sign up
- Claim $111 bonus
- Play game

---

## 📋 FILES READY FOR COPY/PASTE

All files are in: `/var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS/`

- ✅ `REAL_MONEY_COMPLETE_MIGRATION.sql` (28KB)
- ✅ `UPDATE_GAME_THUMBNAILS.sql` (1.9KB)
- ✅ `supabase/functions/spin/index.ts` (20KB)
- ✅ `supabase/functions/claim-bonus/index.ts` (5.8KB)

---

## 🎯 QUICK CHECKLIST

- [ ] SQL File 1 executed
- [ ] SQL File 2 executed
- [ ] `spin` function deployed
- [ ] `claim-bonus` function deployed
- [ ] Vercel rebuild triggered
- [ ] Site tested
- [ ] Functions tested
- [ ] Full flow tested

---

**START WITH STEP 1 - SQL MIGRATION!** 🚀

