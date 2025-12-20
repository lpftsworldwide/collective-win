# 🔑 GET CORRECT SUPABASE API KEY

## Quick Steps

1. **Open Supabase Dashboard:**
   https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/api

2. **Find "Project API keys" section**

3. **Copy the "anon" or "public" key**
   - Should start with `eyJ...` or `sb_...`
   - This is the PUBLISHABLE key (safe to expose)

4. **Update Vercel:**
   - Go to: https://vercel.com/dashboard
   - Project: collective-win
   - Settings → Environment Variables
   - Add/Update: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Value: (paste the key from step 3)
   - Save and redeploy

5. **Test:**
   - Wait 1-2 minutes
   - Try registration again
   - Error should be fixed!

---

**The current fallback key might be expired - get fresh one from Supabase!**
