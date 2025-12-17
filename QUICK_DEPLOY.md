# 🚀 Quick Deploy - All in One

## Automated Script

Run this script to:
1. ✅ Create GitHub repository
2. ✅ Push code to GitHub  
3. ✅ Deploy to Vercel

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
./create_and_deploy.sh
```

The script will:
- Prompt for your GitHub username
- Guide you to create the repo (if needed)
- Push all code to GitHub
- Deploy to Vercel
- Provide next steps for environment variables

## Manual Steps (If Script Doesn't Work)

### 1. Create GitHub Repository

Go to: https://github.com/new
- Name: `collective-wins`
- Description: COLLECTIVE-WINS Casino Platform
- **DO NOT** initialize with README/gitignore
- Click "Create repository"

### 2. Push to GitHub

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS

# Add your GitHub repo (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/collective-wins.git

# Push
git push -u origin master
```

### 3. Deploy to Vercel

```bash
# Link to Vercel (first time)
vercel

# Deploy to production
vercel --prod
```

### 4. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_imsM3rmYQD2Oq8Ip-CtVag_w8BNiYeQ
```

Then redeploy:
```bash
vercel --prod
```

---

**Ready?** Run `./create_and_deploy.sh` 🚀

