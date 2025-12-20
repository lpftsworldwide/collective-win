# 🖼️ FIX: Game Images Not Loading

## ❌ Problem

Game images show as colored placeholders instead of actual images on the landing page.

## ✅ Solution

The images exist in `public/game-tiles/` but the database `thumbnail_url` values might not be set correctly.

---

## 🔧 Fix Steps

### Step 1: Verify Database Has Thumbnail URLs

Run this SQL in Supabase SQL Editor:

```sql
-- Check if thumbnails are set
SELECT game_code, name, thumbnail_url 
FROM public.licensed_games 
WHERE thumbnail_url IS NULL 
LIMIT 10;
```

If many are NULL, run the update:

```sql
-- Update all games with correct thumbnail paths
UPDATE public.licensed_games
SET thumbnail_url = '/game-tiles/' || game_code || '.jpg'
WHERE thumbnail_url IS NULL 
  AND game_code IN (
    'big-bass-splash', 'gates-of-olympus', 'sweet-bonanza', 'starlight-princess',
    'legend-of-cleopatra', 'egypt-fire', 'golden-pharaoh-megaways', 'crystal-fortune-deluxe',
    'oceans-treasure-quest', 'blackjack-royal-vip', 'dragons-fire-prosperity', 'lightning-strike-roulette',
    'wild-west-bounty-hunter', 'cosmic-gems-cluster', 'mega-fortune-jackpot-king', 'ancient-aztec-gold',
    'baccarat-royale-supreme', 'neon-city-nights', 'viking-conquest-saga', 'crash-rocket-multiplier',
    'diamond-dynasty-deluxe', 'egyptian-mysteries-unlimited', 'fruit-blitz-super-spin', 'pirates-plunder-megaways',
    'starburst-crystal-classic', 'buffalo-thunder-lightning', 'zeus-power-reels', 'sugar-rush-candy-blitz',
    'moon-princess-trinity', 'roulette-pro-european', 'aztec-bonanza-infinity', 'mega-moolah-fortune',
    'dead-or-alive-outlaw', 'jammin-jars-cluster-party', 'book-of-secrets-deluxe', 'gonzos-quest-megaways',
    'bonanza-goldmine-megaways', 'legacy-of-egypt-power', 'immortal-romance-remastered', 'fire-joker-respin',
    'reactoonz-quantum-leap', 'street-racer-nitro', 'tiki-fortune-totem', 'tomb-raider-expedition',
    'space-invaders-arcade', 'rainbow-riches-megaways', 'wolf-gold-moon-spin', 'poker-face-texas-holdem',
    'jungle-adventure-expedition', 'mega-ball-live', 'gladiator-arena-champion', 'fortune-tiger-prosperity',
    'fishing-frenzy-megaways'
  );
```

### Step 2: Verify Images Are in Public Folder

Images should be in: `public/game-tiles/*.jpg`

Check:
```bash
ls public/game-tiles/*.jpg | wc -l
```

Should show ~30+ images.

### Step 3: Check Image Paths in Code

The component uses: `game.thumbnail_url`

This should be: `/game-tiles/game-code.jpg`

---

## 🧪 Test After Fix

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Reload page**
3. **Check browser console** for 404 errors
4. **Verify images load**

---

## 🔍 Debugging

### Check Browser Console

Open DevTools (F12) → Console:
- Look for 404 errors on image paths
- Check if paths are correct

### Check Network Tab

Open DevTools → Network:
- Filter by "Img"
- Check which images fail to load
- Verify the paths

### Common Issues

1. **Database not updated** - Run UPDATE_GAME_THUMBNAILS.sql
2. **Wrong path format** - Should be `/game-tiles/game-code.jpg`
3. **Images not in public folder** - Move to `public/game-tiles/`
4. **Cache issue** - Clear browser cache

---

## ✅ Quick Fix

Run this SQL in Supabase:

```sql
UPDATE public.licensed_games
SET thumbnail_url = '/game-tiles/' || game_code || '.jpg'
WHERE thumbnail_url IS NULL OR thumbnail_url = '';
```

Then clear cache and reload!

---

**Run the SQL update and images should load!** 🖼️

