# 🚨 CRITICAL: Vite Requires VITE_ Prefix

## ❌ The Problem:

Vite **ONLY** exposes environment variables that start with `VITE_` prefix.

If your variables are named:
- `vitesupabaseurl` (no underscore, no prefix)
- `vitepublishiblekey` (no underscore, no prefix)

**Vite will NOT expose them!**

## ✅ SOLUTION: Variables MUST Start with `VITE_`

Even if Vercel doesn't allow underscores elsewhere, the prefix `VITE_` is **REQUIRED**.

### Try These Names in Vercel:

1. **`VITE_SUPABASE_URL`** (with underscore after VITE_)
   - Value: `https://yiorietrtfosjnpzznnr.supabase.co`

2. **`VITE_SUPABASE_PUBLISHABLE_KEY`** (with underscores)
   - Value: `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

### If Vercel Still Won't Accept Underscores:

Try these alternatives (Vite might accept them):
- `VITESUPABASEURL` (all caps, no underscores)
- `VITESUPABASEPUBLISHABLEKEY` (all caps, no underscores)

Then I'll update the code to read these formats.

## 🔍 Debug:

I've added console logging. After next deploy, check browser console - it will show which env vars are available.

## ⚠️ Important:

The variable name **MUST** start with `VITE_` for Vite to expose it. This is a Vite requirement, not Vercel.

