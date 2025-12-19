# 🚀 LIVE DEPLOYMENT - DO THIS NOW

## ⚡ Quick Deploy (10 minutes total)

### STEP 1: Deploy Migrations (2 minutes)

1. **Open:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new

2. **Copy entire file:** `DEPLOY_ALL_MIGRATIONS.sql`
   - File is 417 lines
   - Select all (Ctrl+A / Cmd+A)
   - Copy (Ctrl+C / Cmd+C)

3. **Paste into SQL Editor**

4. **Click:** "Run" button

5. **Wait for:** Success message ✅

### STEP 2: Deploy demo-spin Function (3 minutes)

1. **Open:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions

2. **Click:** "Create Function" or find `demo-spin`

3. **Function Name:** `demo-spin`

4. **Copy entire file:** `supabase/functions/demo-spin/index.ts`
   - Select all (Ctrl+A / Cmd+A)
   - Copy (Ctrl+C / Cmd+C)

5. **Paste into editor**

6. **Click:** "Deploy"

7. **Go to:** Settings → Secrets

8. **Add secrets:**
   - `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (Get from Settings → API → service_role key)

### STEP 3: Deploy claim-bonus Function (3 minutes)

1. **Still in Functions page**

2. **Click:** "Create Function" or find `claim-bonus`

3. **Function Name:** `claim-bonus`

4. **Copy entire file:** `supabase/functions/claim-bonus/index.ts`
   - Select all (Ctrl+A / Cmd+A)
   - Copy (Ctrl+C / Cmd+C)

5. **Paste into editor**

6. **Click:** "Deploy"

7. **Go to:** Settings → Secrets

8. **Add secrets:**
   - `SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (Get from Settings → API → service_role key)
   - `SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

### STEP 4: Verify Vercel (1 minute)

1. **Check:** https://vercel.com/dashboard
2. **Verify env vars are set:**
   - `VITE_SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

### STEP 5: Test Live Site (1 minute)

1. **Visit:** https://collective-win.vercel.app
2. **Sign up** → **Claim $111 bonus** → **Play games!**

## ✅ Verification Checklist

After deployment, verify:

- [ ] Games display in catalog
- [ ] Can click on a game
- [ ] Spin button works
- [ ] Sounds play
- [ ] Wins calculate correctly
- [ ] $111 bonus can be claimed
- [ ] Anticipation works (2 scatters)
- [ ] Rate limiting works

## 🔗 Quick Links

- **SQL Editor:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new
- **Functions:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
- **API Settings:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/api
- **Live Site:** https://collective-win.vercel.app

---

**Total Time: ~10 minutes**

