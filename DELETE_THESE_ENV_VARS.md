# 🗑️ DELETE THESE ENVIRONMENT VARIABLES

## ✅ KEEP ONLY THESE (Add if missing):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## ❌ DELETE ALL OF THESE:

### PostgreSQL Variables (Not needed for frontend):
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Supabase Variables (Wrong format - delete these):
- `SUPABASE_URL` ❌ (should be `VITE_SUPABASE_URL`)
- `SUPABASE_PUBLISHABLE_KEY` ❌ (should be `VITE_SUPABASE_PUBLISHABLE_KEY`)
- `SUPABASE_JWT_SECRET` ❌ (not needed for frontend)
- `SUPABASE_SERVICE_ROLE_KEY` ❌ (not needed for frontend)
- `SUPABASE_SECRET_KEY` ❌ (not needed for frontend)

### Next.js Variables (Wrong framework - delete these):
- `NEXT_PUBLIC_SUPABASE_URL` ❌ (this is Next.js, you're using Vite)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ❌ (this is Next.js, you're using Vite)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_K...` ❌ (this is Next.js, you're using Vite)

## 📝 Steps:

1. Go to: https://vercel.com/lpftss-projects/collective-wins-deploy/settings/environment-variables
2. Click the **three dots (⋮)** next to each variable listed above
3. Click **"Delete"**
4. Repeat for all variables in the list above

## ✅ After Deleting:

You should ONLY have:
- `VITE_SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

If either is missing, **ADD** them with the values above.

## 🚀 Then Redeploy:

After cleaning up, go to **Deployments** → Click **"..."** → **"Redeploy"**

