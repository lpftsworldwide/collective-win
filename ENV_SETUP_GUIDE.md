# Environment Variables Setup Guide

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your values** (see below)

3. **Get Service Role Key** (for edge functions):
   - Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/api
   - Copy the **service_role** key (NOT the anon key)
   - Add to Supabase Dashboard → Edge Functions → Settings → Secrets
   - Name: `SUPABASE_SERVICE_ROLE_KEY`

## Required Variables (You Already Have)

✅ **VITE_SUPABASE_URL**
```
https://yiorietrtfosjnpzznnr.supabase.co
```

✅ **VITE_SUPABASE_PUBLISHABLE_KEY**
```
sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ
```

## Required Variables (You Need to Get)

⚠️ **SUPABASE_SERVICE_ROLE_KEY** (for edge functions)
- **Where to get it:** Supabase Dashboard → Settings → API → service_role key
- **Where to set it:** Supabase Dashboard → Edge Functions → Settings → Secrets
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Why:** Edge functions need this to access the database with admin privileges

## Step-by-Step: Getting Service Role Key

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/api

2. **Find Service Role Key:**
   - Look for "service_role" key (it's secret - has admin access)
   - Click "Reveal" to show it
   - Copy the entire key

3. **Add to Edge Functions Secrets:**
   - Go to: Supabase Dashboard → Edge Functions → Settings
   - Click "Add Secret"
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: (paste the service_role key)
   - Click "Save"

4. **Verify:**
   - Your edge functions will now have access to the database
   - Functions like `demo-spin` will work correctly

## Optional Variables (For Licensed Games Later)

If you want to add real licensed games (JILI, Boomberg, etc.) later, you'll need:

- SoftGamings API credentials (or similar aggregator)
- These go in the database, not .env.local
- See `API_REQUIREMENTS.md` for details

## File Locations

- **`.env.example`** - Template file (safe to commit to git)
- **`.env.local`** - Your actual values (DO NOT commit - in .gitignore)
- **Edge Function Secrets** - Set in Supabase Dashboard (not in .env.local)

## Verification

After setting up:

1. ✅ Check `.env.local` exists with your values
2. ✅ Check Service Role Key is in Supabase Edge Functions secrets
3. ✅ Run `npm run dev` to start the app
4. ✅ Try logging in and playing a demo game

## Troubleshooting

**"Missing environment variable" error:**
- Make sure `.env.local` exists (not just `.env.example`)
- Restart the dev server after creating `.env.local`

**Edge functions not working:**
- Check Service Role Key is set in Supabase Dashboard → Edge Functions → Secrets
- Verify the key name is exactly: `SUPABASE_SERVICE_ROLE_KEY`

**Can't connect to Supabase:**
- Verify `VITE_SUPABASE_URL` is correct
- Verify `VITE_SUPABASE_PUBLISHABLE_KEY` is correct
- Check Supabase project is not paused

