# 📋 COPY THESE TO VERCEL ENVIRONMENT VARIABLES

## ✅ Add These Exact Variables to Vercel:

Go to: https://vercel.com/lpftss-projects/collective-wins-deploy/settings/environment-variables

### Variable 1:
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://yiorietrtfosjnpzznnr.supabase.co`
- **Environment:** ✅ Production (and Preview/Development if you want)

### Variable 2:
- **Name:** `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value:** `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`
- **Environment:** ✅ Production (and Preview/Development if you want)

## ⚠️ CRITICAL REQUIREMENTS:

1. **Variable names MUST start with `VITE_`** (Vite requirement)
2. **Use underscores:** `VITE_SUPABASE_URL` (not `VITESUPABASEURL`)
3. **Set for Production environment** ✅
4. **After adding, REDEPLOY** (Deployments → ... → Redeploy)

## 🔍 If Vercel Won't Accept Underscores:

If Vercel truly doesn't allow underscores, try:
- `VITESUPABASEURL` (all caps, no underscores)
- `VITESUPABASEPUBLISHABLEKEY` (all caps, no underscores)

Then let me know and I'll update the code to read these formats.

## ✅ After Adding:

1. Save the variables
2. Go to Deployments tab
3. Click "..." on latest deployment
4. Click "Redeploy"
5. Wait 2-3 minutes
6. Test: https://collective-win.vercel.app

The site should work!

