# 🎮 TEST GAMES - AFTER SQL DEPLOYMENT

## ⚠️ Games Won't Work Until SQL is Deployed!

**Current Status:**
- ✅ Edge functions deployed (`spin`, `claim-bonus`)
- ❌ **SQL tables NOT created** - games table doesn't exist
- ❌ **No games in database** - frontend can't load games

---

## 🚀 Test After SQL Deployment

### 1. Test Landing Page

Visit: **https://collective-win.vercel.app**

**Should see:**
- ✅ 50 game cards with images
- ✅ No black placeholders
- ✅ Games load from database

**If you see:**
- ❌ "No games found" → SQL not deployed
- ❌ Black placeholders → SQL deployed but thumbnail update not run
- ❌ Games but no images → Run `UPDATE_GAME_THUMBNAILS.sql`

---

### 2. Test Game Play

1. **Sign up** for account
2. **Claim $111 bonus**
3. **Click on a game** (e.g., "Gates of Olympus")
4. **Place a bet** (e.g., $1.00)
5. **Click "Spin"**

**Should see:**
- ✅ Reels spin
- ✅ Win/loss calculated
- ✅ Balance updates
- ✅ Sounds play

**If you see:**
- ❌ "Game not found" → SQL not deployed
- ❌ "Function error" → Check function logs
- ❌ "Balance error" → User table not created

---

### 3. Test Functions Directly

**Test spin function:**
```bash
curl -X POST https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/spin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "game_code": "gates-of-olympus",
    "wager": 1.0
  }'
```

**Test claim-bonus:**
```bash
curl -X POST https://yiorietrtfosjnpzznnr.supabase.co/functions/v1/claim-bonus \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{}'
```

---

## ✅ Expected Results After SQL

1. **Landing page:**
   - 50 games displayed
   - All have images (no placeholders)
   - Games are clickable

2. **Game play:**
   - Games load
   - Spins work
   - Balance updates
   - Wins calculated

3. **Signup/Bonus:**
   - Signup creates user
   - $111 bonus awarded
   - Bonus shows in balance

---

## 🔧 Troubleshooting

### "No games found"
→ **SQL not deployed** - Run `REAL_MONEY_COMPLETE_MIGRATION.sql`

### "Black placeholders"
→ **Thumbnails not set** - Run `UPDATE_GAME_THUMBNAILS.sql`

### "Function 404"
→ **Function not deployed** - Already done ✅

### "Database error"
→ **Tables don't exist** - Deploy SQL migrations

---

**Deploy SQL first, then test!** 🚀

