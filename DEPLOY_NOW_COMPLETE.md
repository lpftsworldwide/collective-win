# 🚀 COMPLETE DEPLOYMENT GUIDE - REAL MONEY CASINO

## ⚠️ CURRENT STATUS

**Live Site Issue:** Old build deployed (shows `DemoBanner is not defined` error)
**Solution:** Code is fixed, need to trigger Vercel rebuild

## ✅ PRE-DEPLOYMENT CHECKLIST

### Code Status ✅
- ✅ All demo references removed from code
- ✅ Function renamed: `demo-spin` → `spin`
- ✅ SQL migration ready: `REAL_MONEY_COMPLETE_MIGRATION.sql`
- ✅ All 50 games: `is_demo_available = false`
- ✅ Frontend calls: `spin` and `claim-bonus` (correct names)
- ✅ Code pushed to GitHub

### What Needs Deployment

---

## 📋 STEP-BY-STEP DEPLOYMENT

### STEP 1: Deploy SQL Migration (Supabase)

**File:** `REAL_MONEY_COMPLETE_MIGRATION.sql`

1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new
2. Open `REAL_MONEY_COMPLETE_MIGRATION.sql` in your editor
3. Copy **entire file** (all 568 lines)
4. Paste into Supabase SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. Wait 10-30 seconds for completion

**Verify:**
```sql
SELECT COUNT(*) FROM public.licensed_games WHERE is_demo_available = false;
-- Should return 50
```

---

### STEP 2: Deploy Edge Functions (Supabase)

#### Function 1: `spin`

1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
2. **Delete old function** (if exists):
   - Look for `demo-spin` or `spin-function`
   - Click "..." → Delete
3. Click **"Deploy a new function"**
4. **Function name:** `spin` (EXACTLY - lowercase, no hyphens)
5. Open `supabase/functions/spin/index.ts` in your editor
6. Copy **entire file**
7. Paste into Supabase function editor
8. Click **"Deploy"**
9. **Verify URL:** Should show `/functions/v1/spin` ✅

#### Function 2: `claim-bonus`

1. Same dashboard: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
2. **Delete old function** (if exists):
   - Look for `claim-function` or wrong name
   - Click "..." → Delete
3. Click **"Deploy a new function"**
4. **Function name:** `claim-bonus` (EXACTLY - with hyphen)
5. Open `supabase/functions/claim-bonus/index.ts` in your editor
6. Copy **entire file**
7. Paste into Supabase function editor
8. Click **"Deploy"**
9. **Verify URL:** Should show `/functions/v1/claim-bonus` ✅

**Function Secrets (Optional - if functions need them):**
- Go to each function → Settings → Secrets
- Add if needed:
  - `supabaseurl` = `https://yiorietrtfosjnpzznnr.supabase.co`
  - `supabaseservicekey` = (your service role key from Supabase)

---

### STEP 3: Trigger Vercel Rebuild

**Option A: Auto-Deploy (Recommended)**
- Code is already pushed to GitHub
- Vercel should auto-deploy
- Check: https://vercel.com/dashboard
- Look for latest deployment

**Option B: Manual Redeploy**
1. Go to: https://vercel.com/dashboard
2. Find project: `collective-win`
3. Click on project
4. Go to "Deployments" tab
5. Click "..." on latest deployment
6. Click **"Redeploy"**
7. Wait 2-3 minutes

**Option C: Push Empty Commit (Force Rebuild)**
```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
git commit --allow-empty -m "Trigger Vercel rebuild"
git push origin main
```

**Environment Variables (Verify in Vercel):**
- Go to: https://vercel.com/dashboard → Project → Settings → Environment Variables
- Verify these exist:
  - `VITE_SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
  - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

---

## 🧪 POST-DEPLOYMENT TESTING

### Test 1: Website Loads ✅
- Go to: https://collective-win.vercel.app
- **Expected:** Game catalog loads (no black screen, no `DemoBanner` error)
- **Check:** Browser console (F12) - should have no errors

### Test 2: Games Display ✅
- **Expected:** 50 games show in catalog
- **Check:** Games have images (not placeholders)
- **Check:** Click a game - should open game page

### Test 3: Signup & Bonus ✅
1. Click "Sign Up" or "Join Now"
2. Create account (email + password)
3. **Expected:** See "$111 Welcome Bonus" offer
4. Click "Claim $111 Bonus"
5. **Expected:** Success message, bonus credited

### Test 4: Game Play ✅
1. Click any game (e.g., "Big Bass Splash")
2. Click "Spin" button
3. **Expected:**
   - Balance decreases by wager amount
   - Reels spin animation
   - Win/loss result displayed
   - Balance updates correctly
   - No errors in console

### Test 5: Function URLs (Direct Test)
```bash
# Test spin function
curl -X POST 'https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/spin' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"gameId": "big-bass-splash", "wager": 1}'

# Test claim-bonus function  
curl -X POST 'https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/claim-bonus' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

---

## ⚠️ COMMON ISSUES & FIXES

### Issue: Black Screen / "DemoBanner is not defined"
**Cause:** Old Vercel build deployed
**Fix:** 
1. Trigger Vercel rebuild (Step 3 above)
2. Wait 2-3 minutes
3. Hard refresh browser (Ctrl+Shift+R)

### Issue: 404 on Functions
**Cause:** Function names incorrect
**Fix:** 
- Verify function names are EXACTLY `spin` and `claim-bonus`
- Check function URLs in Supabase dashboard
- Must match: `/functions/v1/spin` and `/functions/v1/claim-bonus`

### Issue: "Failed to Load Games"
**Cause:** SQL migration not run
**Fix:** Run `REAL_MONEY_COMPLETE_MIGRATION.sql` in Supabase (Step 1)

### Issue: Bonus Not Claiming
**Cause:** `claim-bonus` function not deployed or wrong name
**Fix:** 
- Verify function exists in Supabase
- Check function name is exactly `claim-bonus`
- Check browser console for errors

### Issue: Games Not Spinning
**Cause:** `spin` function not deployed or wrong name
**Fix:**
- Verify function exists in Supabase
- Check function name is exactly `spin` (not `demo-spin`)
- Check browser console for errors

---

## ✅ SUCCESS CRITERIA

After deployment, verify:

- [ ] Website loads without black screen
- [ ] No `DemoBanner` error in console
- [ ] Games display in catalog (50 games)
- [ ] Game images load (not placeholders)
- [ ] Signup works
- [ ] $111 bonus can be claimed
- [ ] Games can be played (spin button works)
- [ ] Balance updates correctly
- [ ] No console errors
- [ ] Functions respond (no 404s)

---

## 🔗 QUICK LINKS

- **Supabase Dashboard:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr
- **Supabase SQL Editor:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new
- **Supabase Functions:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Live Site:** https://collective-win.vercel.app
- **GitHub Repo:** https://github.com/lpftsworldwide/collective-win

---

## 🎯 DEPLOYMENT ORDER (IMPORTANT!)

### ⚡ QUICK START: Hybrid Automation

**NEW!** Run the automated deployment script:

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
./deploy-hybrid-automated.sh
```

This script:
- ✅ Guides you through SQL migration (copy/paste)
- ✅ Automatically deploys edge functions
- ✅ Triggers Vercel rebuild
- ✅ Verifies everything worked

**See:** `DEPLOY_HYBRID_GUIDE.md` for full details

---

### 📋 Manual Deployment Order

If you prefer manual control:

1. **First:** Run SQL migration in Supabase (Step 1)
2. **Second:** Deploy edge functions (Step 2)
3. **Third:** Trigger Vercel rebuild (Step 3)
4. **Fourth:** Test live site (Post-Deployment Testing)

**Do NOT skip steps! Each step depends on the previous one.**

---

**Ready? Run the automation script or follow manual steps below!** 🚀
