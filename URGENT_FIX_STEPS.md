# 🚨 URGENT FIX - DO THESE NOW

## ❌ Current Issues:
1. **Black screen still showing** - VITE_ env vars added but site not redeployed
2. **Edge functions 404** - Functions not deployed

## ✅ FIX STEP 1: REDEPLOY VERCEL (CRITICAL!)

**The VITE_ vars won't work until you REDEPLOY!**

1. Go to: https://vercel.com/lpftss-projects/collective-wins-deploy/deployments
2. Find the **latest deployment**
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Wait 2-3 minutes for build to complete

**This is REQUIRED** - Vercel doesn't pick up new env vars until you redeploy!

## ✅ FIX STEP 2: DEPLOY EDGE FUNCTIONS

You have the secrets set (I can see SUPABASEURL, SUPABASEPUBLISHABLEKEY, SUPABASESERVICEKEY).

Now deploy the functions:

1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
2. Click **"Create a new function"** or find `demo-spin`
3. Copy entire file: `supabase/functions/demo-spin/index.ts`
4. Paste and click **"Deploy"**
5. Repeat for `claim-bonus`

## 🔑 Service Key You Provided:
`vck_7G8szvCfFPOXuc724FiZOxe3mTqT9nEwu31WRAo8HQAQHXnQFF0zYrgD`

Make sure this is set as `SUPABASESERVICEKEY` in Supabase Edge Function Secrets (which it looks like it is).

## ✅ After Both Steps:

1. Site should load (no black screen)
2. Games should display
3. Spin button should work

**The redeploy is the critical step - do that first!**

