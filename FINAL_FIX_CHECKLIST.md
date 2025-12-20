# 🚨 FINAL FIX CHECKLIST - DO THESE NOW

## ❌ Current Issues Found:

1. **Black Screen Still Showing** - Vercel needs REDEPLOY
2. **Edge Functions 404** - URLs might be wrong or functions not properly deployed

## ✅ FIX 1: REDEPLOY VERCEL (CRITICAL!)

**The VITE_ env vars won't work until you REDEPLOY!**

1. Go to: https://vercel.com/lpftss-projects/collective-wins-deploy/deployments
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes

**This is MANDATORY - new env vars only work after redeploy!**

## ✅ FIX 2: Verify Edge Function URLs

From your screenshot, I see the functions are deployed but the URLs look wrong:
- `claim-bonus` shows URL: `/functions/v1/super-endpo...` ❌
- `demo-spin` shows URL: `/functions/v1/dynamic-res...` ❌

**They should be:**
- `/functions/v1/claim-bonus` ✅
- `/functions/v1/demo-spin` ✅

### Check Function Names:

1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
2. Click on `claim-bonus` function
3. Check the **"Details"** tab
4. Verify the **"Slug"** is exactly `claim-bonus`
5. If it's wrong, you may need to delete and recreate with correct name

6. Repeat for `demo-spin` - verify slug is exactly `demo-spin`

## ✅ FIX 3: Test After Fixes

After redeploying Vercel and verifying function names:

1. Visit: https://collective-win.vercel.app
2. Should see games (no black screen)
3. Click a game
4. Try spinning (should work if functions are correct)

## 🔍 Quick Test Commands:

```bash
# Test site (should not show supabaseUrl error)
curl -s https://collective-win.vercel.app | grep -i "supabaseUrl" || echo "✅ No error"

# Test functions (should return 401/400, not 404)
curl -s https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/demo-spin -H "Authorization: Bearer sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ" -d '{}'
curl -s https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/claim-bonus -H "Authorization: Bearer sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ" -d '{}'
```

If functions return 401/400 = ✅ Working (just needs auth)
If functions return 404 = ❌ Wrong name/not deployed

