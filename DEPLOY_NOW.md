# 🚀 Deploy to Vercel NOW

## Quick Deploy (Choose One Method)

### Method 1: CLI Deploy (Fastest)

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS

# Run the deploy script
./deploy.sh

# OR manually:
vercel --prod
```

### Method 2: Vercel Dashboard (Easiest)

1. **Go to:** https://vercel.com/new
2. **Import Git Repository** (if connected to GitHub/GitLab)
   - OR **Upload** the `COLLECTIVE-WINS` folder
3. **Configure:**
   - Framework: **Vite** (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
4. **Add Environment Variables:**
   ```
   VITE_SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ
   ```
5. **Click Deploy!**

## ⚠️ Important: Environment Variables

**MUST SET THESE IN VERCEL DASHBOARD:**

1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - `VITE_SUPABASE_URL` = `https://yiorietrtfosjnpzznnr.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ`

3. **Redeploy** after adding variables:
   ```bash
   vercel --prod
   ```

## ✅ After Deployment

1. **Test the site:** Visit your Vercel URL
2. **Check Supabase connection:** Try logging in
3. **Test games:** Play a demo game
4. **Verify environment:** Check browser console for errors

## 🔧 Troubleshooting

**Build fails?**
- Vercel will install dependencies automatically
- Check build logs in Vercel dashboard

**Environment variables not working?**
- Make sure they start with `VITE_`
- Redeploy after adding variables
- Check Vercel dashboard → Settings → Environment Variables

**Site not loading?**
- Check Vercel deployment logs
- Verify build completed successfully
- Check browser console for errors

## 📝 Files Created

- ✅ `vercel.json` - Vercel configuration
- ✅ `deploy.sh` - Quick deploy script
- ✅ `VERCEL_DEPLOYMENT.md` - Full deployment guide

## 🎯 Ready to Deploy?

Run:
```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
./deploy.sh
```

Or use the Vercel Dashboard method above!

---

**Your site will be live in ~2 minutes!** 🚀

