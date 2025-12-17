# Game Logic Verification Guide

## 🎯 Overview

This document explains the architectural improvements made to ensure reliable image rendering and verifiable game logic integrity in the slot machine gaming platform.

## 🔧 What Was Fixed

### 1. **React Rendering Stability (Image Loading Fix)**

**Problem:** Images were flickering or failing to load during spin animations.

**Root Cause:** Using array indices as React keys violated immutability rules, causing component destruction and recreation during state updates.

**Solution Implemented:**
```typescript
// ❌ BEFORE: Unstable keys using array indices
{reels.map((reel, reelIndex) => (
  <div key={reelIndex}>  // BAD: Index changes on array mutation
    {reel.map((symbol, symbolIndex) => (
      <div key={symbolIndex}>{symbol}</div>  // BAD: Causes re-mounting
    ))}
  </div>
))}

// ✅ AFTER: Stable keys with unique IDs
interface ReelSymbol {
  id: string;  // Permanent, unique identifier
  symbol: string;
  reelIndex: number;
  position: number;
}

{reelData.map((reel) => (
  <div key={`reel-${reel[0].reelIndex}`}>
    {reel.map((symbolData) => (
      <div key={symbolData.id}>  // GOOD: Stable ID preserves component
        {SYMBOL_MAP[symbolData.symbol]}
      </div>
    ))}
  </div>
))}
```

**Key Principles Applied:**
- ✅ Store only raw data in state, never component instances
- ✅ Use stable, permanent IDs as React keys
- ✅ Map data to components in render method, not in state
- ✅ Reduce re-render frequency during animations (update every 200ms instead of 100ms)

### 2. **Edge Function Integrity & Observability**

**Problem:** Doubt about whether the game logic actually works correctly.

**Solution:** Enhanced logging, validation, and performance tracking.

**Improvements Made:**
```typescript
// Comprehensive audit logging
const auditLog = {
  timestamp: new Date().toISOString(),
  user_id: user.id,
  game_id,
  wager_amount,
  payout_amount: outcome.payout_amount,
  payout_multiplier: outcome.payout_multiplier,
  target_rtp: targetRTP,
  win_lines: outcome.win_lines,
  session_id: txResult.session_id,
  new_balance: txResult.new_balance,
  execution_time_ms: executionTime.toFixed(2),
  reels_result: outcome.reels.map(r => r.map(s => s.symbol).join('-')).join(' | ')
};

console.log('[SPIN_AUDIT]', JSON.stringify(auditLog));
```

**Performance Monitoring:**
```typescript
// Client-side tracking
const spinStartTime = performance.now();
const networkTime = performance.now() - spinStartTime;
console.log(`[GamePlay] Spin completed in ${networkTime.toFixed(2)}ms`);

// Server-side tracking
if (executionTime > 100) {
  console.warn(`[PERFORMANCE] Slow spin detected: ${executionTime.toFixed(2)}ms`);
}
```

**Input Validation:**
```typescript
// Maximum bet limit to prevent abuse
const MAX_WAGER = 1000;
if (wager_amount > MAX_WAGER) {
  return new Response(
    JSON.stringify({ error: `Maximum wager is $${MAX_WAGER}` }),
    { status: 400 }
  );
}
```

## 🧪 Local Development & Testing

### Prerequisites
```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Or using npm
npm install -g supabase
```

### Running Edge Functions Locally

```bash
# Start local Supabase services
supabase start

# Serve the spin-outcome function locally
supabase functions serve spin-outcome --env-file .env

# The function will be available at:
# http://localhost:54321/functions/v1/spin-outcome
```

### Testing the Edge Function

```bash
# Run unit tests
cd supabase/functions/spin-outcome
deno test --allow-env --allow-net spin-outcome.test.ts

# Expected output:
# ✅ RNG Security: getSecureRandom produces values in range [0,1)
# ✅ Symbol Weighting: Distribution matches configured weights
# ✅ Win Calculation: 3+ consecutive matches trigger payout
# ✅ RTP Adjustment: Target RTP influences payout multiplier
# ✅ RTP Simulation: 1000 spins trend toward target RTP
```

### Manual Spin Test

```bash
# Test a spin with curl (requires valid auth token)
curl -X POST http://localhost:54321/functions/v1/spin-outcome \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "game_id": "big-bass-splash",
    "wager_amount": 10
  }'
```

## 📊 Verifying Game Logic

### 1. Check Edge Function Logs

In your terminal running `supabase functions serve`, you'll see:

```json
[SPIN_AUDIT] {
  "timestamp": "2025-11-23T10:55:00.123Z",
  "user_id": "abc-123",
  "game_id": "big-bass-splash",
  "wager_amount": 10,
  "payout_amount": 25.50,
  "payout_multiplier": 2.55,
  "target_rtp": 96.71,
  "win_lines": [1],
  "session_id": "xyz-789",
  "new_balance": 115.50,
  "execution_time_ms": "45.23",
  "reels_result": "cherry-bell-7 | cherry-cherry-lemon | cherry-orange-bell | lemon-cherry-bar | orange-cherry-plum"
}
```

### 2. Browser Console Verification

Open your browser's developer console while playing. You'll see:

```javascript
[GamePlay] Spin Result: {
  sessionId: "xyz-789",
  wager: 10,
  payout: 25.50,
  multiplier: 2.55,
  rtp: 96.71,
  balance: 115.50
}

[GamePlay] Spin completed in 82.45ms (Network + Edge Function: 45.23ms)
```

### 3. Database Audit Trail

Query the `game_sessions` table to verify atomicity:

```sql
SELECT 
  id,
  user_id,
  game_id,
  wager_amount,
  payout_amount,
  start_time,
  end_time
FROM game_sessions
ORDER BY start_time DESC
LIMIT 10;
```

## 🎮 Performance Metrics

### Expected Performance

| Metric | Target | Typical |
|--------|--------|---------|
| Edge Function Execution | <100ms | 40-60ms |
| Network Latency | Varies | 20-40ms |
| Total Spin Time (UI) | <150ms | 80-120ms |
| Animation Duration | 1500ms | Fixed |

### Monitoring Slow Performance

If you see warnings like:
```
[PERFORMANCE] Slow spin detected: 145.67ms (target: <100ms)
```

This indicates:
- Database query latency (check connection pooling)
- RTP config fetch delay
- Network congestion to Supabase backend

## 🔐 Security Verification

### RNG Security
- Uses `crypto.getRandomValues()` for cryptographically secure random numbers
- Server-side execution prevents client manipulation
- Logged outcomes provide audit trail

### Transaction Atomicity
- Uses database RPC `process_wager_transaction`
- Balance updates and session creation in single transaction
- Prevents race conditions with row-level locking

### Input Validation
```typescript
// Maximum wager limit
if (wager_amount > MAX_WAGER) { /* reject */ }

// Type checking
if (typeof wager_amount !== 'number') { /* reject */ }

// Positive values only
if (wager_amount <= 0) { /* reject */ }
```

## 🚀 Deployment

Edge functions deploy automatically when you push code. To verify deployment:

```bash
# Check function status
supabase functions list

# View live logs
supabase functions logs spin-outcome --follow
```

## 📈 RTP Verification Process

To verify RTP accuracy over time:

1. **Track Historical Data:**
```sql
SELECT 
  game_id,
  COUNT(*) as total_spins,
  SUM(wager_amount) as total_wagered,
  SUM(payout_amount) as total_payout,
  ROUND((SUM(payout_amount) / SUM(wager_amount)) * 100, 2) as actual_rtp
FROM game_sessions
WHERE game_id = 'big-bass-splash'
GROUP BY game_id;
```

2. **Compare to Target RTP:**
```sql
SELECT 
  gs.game_id,
  gc.current_rtp as target_rtp,
  ROUND((SUM(gs.payout_amount) / SUM(gs.wager_amount)) * 100, 2) as actual_rtp,
  COUNT(*) as sample_size
FROM game_sessions gs
JOIN game_rtp_config gc ON gs.game_id = gc.game_id
GROUP BY gs.game_id, gc.current_rtp
HAVING COUNT(*) > 1000;  -- Require sufficient sample size
```

3. **Expected Variance:**
- Small sample (<100 spins): High variance expected (80-120% RTP)
- Medium sample (100-1000 spins): Moderate variance (90-105% RTP)
- Large sample (>1000 spins): Low variance (95-98% RTP for 96.5% target)

## 🐛 Troubleshooting

### Images Still Not Loading?

1. **Check browser cache:** Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
2. **Verify asset paths:** Ensure game tile images exist in `/public/game-tiles/`
3. **Check console for errors:** Look for 404s or CORS issues
4. **Inspect React keys:** Open React DevTools and verify stable component IDs

### Edge Function Errors?

1. **Check logs:** `supabase functions logs spin-outcome`
2. **Verify database:** Ensure `game_rtp_config` table has data for the game
3. **Check auth:** Verify JWT token is being passed correctly
4. **Test locally:** Use `supabase functions serve` to debug

### Slow Performance?

1. **Check database connection:** Verify connection pooling is configured
2. **Optimize queries:** Use `EXPLAIN ANALYZE` on slow queries
3. **Monitor cold starts:** Check if function is staying warm
4. **Network latency:** Test from different geographic locations

## 📚 Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Runtime Documentation](https://deno.land/manual)
- [React Keys Best Practices](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key)
- [RTP Calculation Standards](https://www.gamblingcommission.gov.uk/licensees-and-businesses/page/rtp-and-variance)

---

**Questions or Issues?**

If you encounter problems or have questions about the game logic:
1. Check the audit logs in the browser console
2. Review the edge function logs using `supabase functions logs`
3. Run the unit tests to verify core logic
4. Test locally using `supabase functions serve` for detailed debugging
