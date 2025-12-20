# ✅ ADD VERCEL ENVIRONMENT VARIABLE

## 🔑 Key Added to Code

I've updated the fallback key in `src/integrations/supabase/client.ts` with your correct key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpb3JpZXRydGZvc2pucHp6bm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzkyODgsImV4cCI6MjA3MjkxNTI4OH0.UcG3lSxiUp5ehj8p_6ikT-KP9cLT0_4gvJ1RbVhLXk0
```

**This will work as a fallback**, but you should also add it to Vercel for proper configuration.

---

## 🚀 Add to Vercel (Recommended)

### Option 1: Via Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com/dashboard
2. **Login** to your account
3. **Click** on project: `collective-win`
4. **Go to:** Settings → Environment Variables
5. **Click:** "Add New"
6. **Enter:**
   - **Key:** `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpb3JpZXRydGZvc2pucHp6bm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzkyODgsImV4cCI6MjA3MjkxNTI4OH0.UcG3lSxiUp5ehj8p_6ikT-KP9cLT0_4gvJ1RbVhLXk0`
   - **Environments:** Select all (Production, Preview, Development)
7. **Click:** Save
8. **Redeploy** (or wait for auto-redeploy)

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production
# Paste the key when prompted
# Repeat for preview and development:
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY preview
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY development

# Redeploy
vercel --prod
```

---

## ✅ What I Did

1. ✅ Updated fallback key in `client.ts` with your correct key
2. ✅ This ensures site works even if Vercel env vars fail
3. ⏳ You need to add it to Vercel for proper configuration

---

## 🧪 Test After Adding

1. Wait 1-2 minutes for Vercel to redeploy
2. Visit: https://collective-win.vercel.app/auth
3. Try registration
4. Error should be fixed!

---

## 📝 Next Steps

1. **Commit the code change:**
   ```bash
   git add src/integrations/supabase/client.ts
   git commit -m "fix: update Supabase publishable key fallback"
   git push
   ```

2. **Add to Vercel** (use Option 1 above)

3. **Test registration** - should work now!

---

**The fallback is updated - site should work! Add to Vercel for best practice.** ✅

