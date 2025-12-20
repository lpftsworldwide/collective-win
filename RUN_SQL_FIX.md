# 🚀 RUN SQL FIX FOR IMAGES

## ✅ Automated Script Created!

I've created `run-image-fix-sql.py` that will automatically update all game thumbnail URLs.

---

## 🚀 Quick Run

### Option 1: Run with Service Role Key

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS

# Set your service role key
export SUPABASE_SERVICE_ROLE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'

# Run the script
python3 run-image-fix-sql.py
```

### Option 2: Find SQL Editor in Supabase

If you prefer manual:

1. **Go to:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr
2. **Click:** "SQL Editor" in the left sidebar (under "Database")
3. **OR:** Direct link: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new
4. **Paste this SQL:**

```sql
UPDATE public.licensed_games
SET thumbnail_url = '/game-tiles/' || game_code || '.jpg'
WHERE thumbnail_url IS NULL 
   OR thumbnail_url = ''
   OR thumbnail_url NOT LIKE '/game-tiles/%';
```

5. **Click:** "Run" button

---

## 🔍 Where to Find SQL Editor

**In Supabase Dashboard:**
- Left sidebar → **"SQL Editor"** (under Database section)
- OR: **"Database"** → **"SQL Editor"**
- Direct URL: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new

---

## ✅ What the Script Does

1. ✅ Checks which games need thumbnails
2. ✅ Updates `thumbnail_url` to `/game-tiles/game-code.jpg`
3. ✅ Verifies the update worked
4. ✅ Shows you how many games were updated

---

## 🧪 After Running

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Reload:** https://collective-win.vercel.app
3. **Check:** Images should now display!

---

**Run the Python script or use SQL Editor - both will fix the images!** 🖼️

