# 🔧 FIX: "Unregistered API key" Error

## ❌ Problem

The registration form shows: **"Registration Failed - Unregistered API key"**

This means the Supabase publishable key is incorrect or expired.

---

## ✅ Solution

### Step 1: Get Correct Publishable Key

1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/api
2. Find **"Project API keys"** section
3. Copy the **"anon"** or **"public"** key (starts with `eyJ...` or `sb_...`)
4. This is your **publishable key**

### Step 2: Update Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select your project: `collective-win`
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   - **Name:** `VITE_SUPABASE_PUBLISHABLE_KEY`
   - **Value:** (paste the correct key from Step 1)
   - **Environment:** Production, Preview, Development (all)
5. Click **Save**
6. **Redeploy** the site (or wait for auto-redeploy)

### Step 3: Update Fallback in Code (Optional)

If you want to update the hardcoded fallback in `client.ts`:

1. Open: `src/integrations/supabase/client.ts`
2. Replace the fallback key on line 18 with the correct key
3. Commit and push

---

## 🔍 Verify Correct Key Format

The publishable key should:
- Start with `eyJ...` (JWT format) OR `sb_...` (new format)
- Be the **anon/public** key (NOT the service_role key)
- Be found in: Supabase Dashboard → Settings → API → Project API keys

---

## ⚠️ Important

- The **anon/public** key is safe to expose (it's meant to be public)
- The **service_role** key should NEVER be in frontend code
- Always use environment variables in production

---

## 🚀 After Fix

1. Wait for Vercel to redeploy (1-2 minutes)
2. Test registration again
3. Error should be gone!

---

**Get the correct key from Supabase Dashboard and update Vercel env vars!** 🔑

