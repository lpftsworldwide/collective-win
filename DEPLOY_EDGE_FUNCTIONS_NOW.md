 🚀 DEPLOY EDGE FUNCTIONS NOW - Quick Guide

## Status Check
✅ Vercel site: **LIVE** (https://collective-win.vercel.app)
✅ Database migrations: **COMPLETE**
❌ Edge functions: **NOT DEPLOYED** (404 errors)

## ⚡ Quick Deploy Steps

### Option 1: Supabase Dashboard (Easiest)

1. **Go to Edge Functions:**
   https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions

2. **Deploy `demo-spin`:**
   - Click "Create a new function"
   - Name: `demo-spin`
   - Copy entire contents of: `supabase/functions/demo-spin/index.ts`
   - Paste into editor
   - Click "Deploy"

3. **Deploy `claim-bonus`:**
   - Click "Create a new function"
   - Name: `claim-bonus`
   - Copy entire contents of: `supabase/functions/claim-bonus/index.ts`
   - Paste into editor
   - Click "Deploy"

4. **Set Secrets:**
   - Go to: Settings → Edge Functions → Secrets
   - Add these secrets (NOT starting with SUPABASE_):
     - `supabaseurl` = `https://yiorietrtfosjnpzznnr.supabase.co`
     - `supabaseservicekey` = `<get from Settings → API → service_role key>`
     - `supabasepublishablekey` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

### Option 2: Supabase CLI (If installed)

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS

# Login (if not already)
supabase login

# Link project
supabase link --project-ref yiorietrtfosjnpzznnr

# Deploy functions
supabase functions deploy demo-spin --project-ref yiorietrtfosjnpzznnr
supabase functions deploy claim-bonus --project-ref yiorietrtfosjnpzznnr

# Set secrets
supabase secrets set supabaseurl=https://yiorietrtfosjnpzznnr.supabase.co --project-ref yiorietrtfosjnpzznnr
supabase secrets set supabaseservicekey=<your-service-key> --project-ref yiorietrtfosjnpzznnr
supabase secrets set supabasepublishablekey=sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ --project-ref yiorietrtfosjnpzznnr
```

## ✅ Verify Deployment

After deploying, run:
```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
bash verify-live-deployment.sh
```

You should see:
- ✅ Function demo-spin is deployed
- ✅ Function claim-bonus is deployed

## 🎮 Test Live Site

1. Visit: https://collective-win.vercel.app
2. Check if games load
3. Try clicking a game
4. Test spin functionality (will need auth first)

## 📝 Notes

- Edge functions MUST be deployed for games to work
- Without them, you'll get 404 errors when trying to spin
- The frontend is already live and waiting for backend functions

#