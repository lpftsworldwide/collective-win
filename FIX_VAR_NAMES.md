# 🚨 FIX VARIABLE NAMES - THEY'RE WRONG!

## ❌ Current (WRONG):
- `vitepublishiblekey` ❌
- `vitesupabaseurl` ❌

## ✅ Should Be (CORRECT):
- `VITE_SUPABASE_PUBLISHABLE_KEY` ✅
- `VITE_SUPABASE_URL` ✅

## 📝 FIX STEPS:

### Option 1: Edit Existing Variables (If Possible)

1. Click the **three dots (⋮)** next to `vitepublishiblekey`
2. Click **"Edit"**
3. Change name to: `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Keep the value: `sb_publishable_05mjCsGeFCVN41UkB...` (or the full key)
5. Make sure **Production** is checked
6. Click **"Save"**

7. Repeat for `vitesupabaseurl`:
   - Change name to: `VITE_SUPABASE_URL`
   - Keep the value: `https://yiorietrtfosjnpzznnr.supabase.co`
   - Make sure **Production** is checked
   - Click **"Save"**

### Option 2: Delete Wrong Ones & Add Correct Ones

If you can't edit the names:

1. **Delete the wrong ones:**
   - Click **⋮** next to `vitepublishiblekey` → **Delete**
   - Click **⋮** next to `vitesupabaseurl` → **Delete**

2. **Add correct ones:**
   - Click **"Add Environment Variable"**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://yiorietrtfosjnpzznnr.supabase.co`
   - Environment: Check **Production** ✅
   - Click **"Save"**

   - Click **"Add Environment Variable"** again
   - Name: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Value: `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ` (the correct one)
   - Environment: Check **Production** ✅
   - Click **"Save"**

## ⚠️ About Old Variables:

The old variables (POSTGRES_*, SUPABASE_*, NEXT_PUBLIC_*) are from a different project or template. You can't delete them if they're:
- Protected by Vercel
- From a different integration

**That's OK!** Just make sure the correct `VITE_` ones exist. Vite will only use variables starting with `VITE_`.

## ✅ After Fixing:

1. **Redeploy** (Deployments → ... → Redeploy)
2. Wait 2-3 minutes
3. Test: https://collective-win.vercel.app

The site should work after this!

