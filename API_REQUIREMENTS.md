# API Requirements for Licensed Games

## Current Status

### ✅ WORKING NOW (No APIs Needed)
- **31 Demo Games** - Fully functional with custom slot engine
- All game mechanics work: RTP, features, multipliers, free spins
- Deterministic outcomes, FSM protection, proper win calculations
- **You can play these games RIGHT NOW** - they work perfectly!

### ⚠️ NEEDS API INTEGRATION (For Real Licensed Games)
- Licensed games from JILI, Boomberg, Pragmatic Play, etc.
- These require aggregator API access

## Required APIs for Licensed Games

### 1. Game Aggregator Service

**Recommended: SoftGamings**
- Website: https://www.softgamings.com
- Supports: JILI, Boomberg, Pragmatic Play, NetEnt, Evolution, 100+ providers
- Pricing: Contact for commercial license
- Setup: 1-2 weeks for approval and integration

**Alternative: BetConstruct**
- Similar provider coverage
- Enterprise-focused
- Requires business license

### 2. What You Need from Aggregator

**API Credentials:**
```
- API Endpoint: https://api.softgamings.com/v1 (example)
- API Key: <provided by aggregator>
- Secret Key: <provided by aggregator>
- Merchant ID: <your merchant account>
```

**Game Launch Flow:**
1. User clicks "Play" on licensed game
2. Frontend calls `game-launch` edge function
3. Edge function calls aggregator API with:
   - User ID
   - Game code
   - Currency (AUD)
   - Mode (real/demo)
4. Aggregator returns iframe URL
5. Game loads in iframe
6. Transactions handled via webhooks

**Webhook Requirements:**
- Bet transactions
- Win transactions
- Balance updates
- Game session end

### 3. Database Tables Needed

**Already Created (in migrations):**
- `game_providers` - Provider information
- `game_provider_configs` - API credentials (NEEDS POPULATION)
- `licensed_games` - Game catalog (NEEDS POPULATION)

**What to Populate:**
```sql
-- Example: Add SoftGamings config
INSERT INTO game_provider_configs (
  provider_id,
  aggregator_api_key,
  aggregator_secret_key,
  iframe_base_url,
  launch_url_template,
  status
) VALUES (
  (SELECT id FROM game_providers WHERE code = 'softgamings'),
  'YOUR_API_KEY',
  'YOUR_SECRET_KEY',
  'https://games.softgamings.com',
  'https://games.softgamings.com/launch?game={gameCode}&token={token}',
  'active'
);
```

### 4. Missing Edge Function

**File:** `supabase/functions/game-launch/index.ts`

**Needs to:**
1. Authenticate user
2. Get provider config from database
3. Call aggregator API to get launch URL
4. Create game session
5. Return launch URL to frontend

**Example Flow:**
```typescript
// Pseudo-code
const response = await fetch(aggregatorAPI, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    game_code: params.gameCode,
    user_id: params.userId,
    currency: 'AUD',
    mode: params.mode
  })
});

const { launch_url, session_token } = await response.json();
return { launchUrl: launch_url, sessionToken: session_token };
```

## What Works Without APIs

### Demo Games (31 Games) - FULLY FUNCTIONAL ✅
- Big Bass Splash
- Gates of Olympus
- Sweet Bonanza
- Starlight Princess
- Egypt Fire (Hold and Win)
- Golden Pharaoh Megaways
- And 25+ more...

**Features:**
- ✅ Proper RTP (96-97%)
- ✅ All features work (free spins, multipliers, etc.)
- ✅ Deterministic outcomes
- ✅ FSM protection
- ✅ Sound effects
- ✅ Win calculations
- ✅ Feature triggers

**You can play these RIGHT NOW!**

## Next Steps

### Option 1: Play Demo Games Now (Recommended)
1. Set up environment variables (provided)
2. Run database migrations
3. Start playing demo games immediately
4. All 31 games work perfectly!

### Option 2: Add Licensed Games Later
1. Sign up with SoftGamings (or similar)
2. Get API credentials
3. Populate database with provider configs
4. Implement `game-launch` edge function
5. Add webhook handler
6. Test integration

## Summary

**Current State:**
- ✅ 31 demo games - WORKING NOW
- ⚠️ Licensed games - Need aggregator API

**To Start Playing:**
- Just need environment variables set up
- Demo games work immediately
- No external APIs required for demo games

**For Licensed Games (Later):**
- Need SoftGamings API (or similar)
- Need to implement game-launch function
- Need webhook handler
- Takes 1-2 weeks for aggregator approval

