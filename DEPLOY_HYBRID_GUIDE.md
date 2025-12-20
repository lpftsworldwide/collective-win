# 🚀 HYBRID AUTOMATED DEPLOYMENT GUIDE

## ⚠️ Supabase CLI Login Issues?

If you're seeing "Failed to create login session" errors, use the **Dashboard-Only** method instead:

👉 **See:** `DEPLOY_MANUAL_DASHBOARD.md` (No CLI required!)

---

## Overview

This guide uses **hybrid automation** - automating what can be automated, guiding you through what can't.

**Note:** If Supabase CLI authentication fails, the script will fall back to manual instructions.

**Automated:**
- ✅ Edge function deployment (`spin`, `claim-bonus`)
- ✅ Vercel rebuild trigger
- ✅ Function verification

**Manual (Guided):**
- 📋 SQL migration (copy/paste in Supabase SQL Editor)

---

## 🎯 Quick Start

### Run the Automation Script

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
./deploy-hybrid-automated.sh
```

The script will:
1. Guide you through SQL migration (copy/paste)
2. Automatically deploy edge functions
3. Trigger Vercel rebuild
4. Verify everything worked

---

## 📋 Detailed Steps

### Prerequisites

1. **Supabase CLI** (via npx - already available ✅)
2. **Vercel CLI** (already available ✅)
3. **Supabase Access Token** (for CLI authentication)

---

### STEP 1: SQL Migration (Manual - 5 minutes)

**The script will guide you, but here's what happens:**

1. Script opens SQL file for you to copy
2. You go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new
3. Copy entire contents of `REAL_MONEY_COMPLETE_MIGRATION.sql`
4. Paste into SQL Editor
5. Click "Run"
6. Wait for "Success" message
7. Then run `UPDATE_GAME_THUMBNAILS.sql` (same process)

**Why manual?** Supabase blocks direct SQL execution via API for security.

---

### STEP 2: Supabase CLI Authentication

**First time only:**

```bash
npx supabase login
```

The script will check if you're already authenticated and guide you if needed.

---

### STEP 3: Edge Functions (Automated)

The script automatically:
- Deploys `spin` function
- Deploys `claim-bonus` function
- Verifies deployment

**If automation fails**, the script provides manual instructions.

---

### STEP 4: Function Secrets (If Needed)

Some functions may need environment variables. The script will guide you to:
1. Go to Supabase Dashboard → Functions → Settings → Secrets
2. Add if needed:
   - `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (from Settings → API)

---

### STEP 5: Vercel Rebuild (Automated)

The script will:
- Push an empty commit to trigger Vercel rebuild
- Or provide manual instructions if git push fails

**Wait 2-3 minutes** for Vercel to rebuild.

---

### STEP 6: Verification

The script verifies:
- ✅ Edge functions are responding
- ✅ Deployment URLs are correct
- ✅ All steps completed

---

## 🔧 Troubleshooting

### "Supabase CLI not authenticated"

```bash
npx supabase login
```

Then run the script again.

---

### "Edge function deployment failed"

**Manual deployment:**
1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
2. Click "Deploy a new function"
3. Name: `spin` (or `claim-bonus`)
4. Copy contents from `supabase/functions/spin/index.ts`
5. Paste and deploy

---

### "Vercel rebuild not triggered"

**Manual options:**
1. Push empty commit:
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push
   ```

2. Or go to Vercel Dashboard → Redeploy

---

### "SQL migration failed"

**Check:**
- Did you copy the ENTIRE file?
- Are there any error messages in SQL Editor?
- Check Supabase logs for details

**Common issues:**
- Tables already exist → That's OK, `CREATE TABLE IF NOT EXISTS` handles it
- Permission errors → Check RLS policies

---

## ✅ Post-Deployment Checklist

After running the script, verify:

1. **SQL Migration:**
   ```sql
   SELECT COUNT(*) FROM public.licensed_games;
   -- Should return: 50
   ```

2. **Edge Functions:**
   - Test: `https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/spin`
   - Test: `https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/claim-bonus`

3. **Live Site:**
   - Visit: https://collective-win.vercel.app
   - Sign up
   - Claim $111 bonus
   - Play a game

---

## 🎯 Quick Reference

| Step | Automation | Time |
|------|------------|------|
| SQL Migration | Manual (guided) | 5 min |
| Edge Functions | Automated | 2 min |
| Vercel Rebuild | Automated | 1 min |
| Verification | Automated | 1 min |
| **Total** | **Hybrid** | **~10 min** |

---

## 🚀 Ready to Deploy?

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
./deploy-hybrid-automated.sh
```

**The script will guide you through everything!** 🎉

---

**Last Updated:** 2024-12-20

