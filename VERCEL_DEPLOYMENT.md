# 🚀 Vercel Deployment Guide for COLLECTIVE-WINS

## Quick Deploy (CLI Method)

### 1. Install Vercel CLI (if not installed)
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
vercel login
```

### 3. Deploy
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (first time) or Yes (if updating)
- **Project name?** → `collective-wins` (or your choice)
- **Directory?** → `./` (current directory)
- **Override settings?** → No (uses vercel.json)

### 4. Deploy to Production
```bash
vercel --prod
```

## Environment Variables Setup

### Required Variables in Vercel Dashboard

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```env
VITE_SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ
```

### Optional Variables

```env
VITE_APP_ENV=production
VITE_ENABLE_DEMO_BANNER=true
VITE_ENABLE_SOUNDS=true
```

## Deploy via Vercel Dashboard

### 1. Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your Git repository (if not already connected)
4. Select the `COLLECTIVE-WINS` repository

### 2. Configure Project

- **Framework Preset:** Vite
- **Root Directory:** `./` (or leave default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### 3. Add Environment Variables

Before deploying, add environment variables in the Vercel dashboard:
- Go to **Settings** → **Environment Variables**
- Add all variables from `.env.example`

### 4. Deploy

Click **Deploy** and wait for the build to complete!

## Post-Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] Build completed successfully
- [ ] Site accessible at `https://your-project.vercel.app`
- [ ] Supabase connection working
- [ ] Games loading correctly
- [ ] Authentication working

## Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Make sure all dependencies are in package.json
npm install
```

**Error: Environment variables missing**
- Check Vercel dashboard → Settings → Environment Variables
- Make sure all `VITE_*` variables are set

### Runtime Errors

**Supabase connection fails**
- Verify `VITE_SUPABASE_URL` is correct
- Check Supabase project is active
- Verify RLS policies allow public access (for demo)

**Games not loading**
- Check browser console for errors
- Verify edge functions are deployed to Supabase
- Check network tab for failed API calls

## Continuous Deployment

Once connected to Git:
- **Automatic:** Every push to `main` branch deploys to production
- **Preview:** Every push to other branches creates preview deployments

## Performance Optimization

Vercel automatically:
- ✅ CDN caching for static assets
- ✅ Edge network optimization
- ✅ Automatic HTTPS
- ✅ Image optimization (if using Vercel Image)

## Monitoring

- **Analytics:** Enable in Vercel Dashboard → Analytics
- **Logs:** View in Vercel Dashboard → Deployments → [Your Deployment] → Logs
- **Real-time:** View in Vercel Dashboard → Deployments → [Your Deployment] → Functions

## Next Steps After Deployment

1. ✅ Test all games
2. ✅ Verify authentication flow
3. ✅ Test demo spins
4. ✅ Check mobile responsiveness
5. ✅ Verify Supabase edge functions are deployed
6. ✅ Test payment flows (if implemented)

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Project Issues: Check GitHub issues

---

**Ready to deploy?** Run `vercel` in the project directory! 🚀

