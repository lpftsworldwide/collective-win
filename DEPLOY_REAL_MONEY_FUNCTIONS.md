# 💰 DEPLOY REAL MONEY FUNCTIONS

## ⚠️ CRITICAL: Function Names Changed!

**OLD (Demo):**
- `demo-spin` ❌

**NEW (Real Money):**
- `spin` ✅

## 🚀 DEPLOYMENT STEPS:

### Step 1: Delete Old Demo Function

1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
2. **Delete** `demo-spin` (if it exists)
3. **Delete** `claim-function` (wrong name - should be `claim-bonus`)

### Step 2: Deploy `spin` Function

1. Click "Deploy a new function"
2. **Function name:** Type exactly `spin` (NOT `demo-spin` or `spin-function`)
3. **Copy code from:** `supabase/functions/spin/index.ts`
4. **Paste** into the `index.ts` file
5. **Deploy**

### Step 3: Deploy `claim-bonus` Function

1. Click "Deploy a new function"
2. **Function name:** Type exactly `claim-bonus` (NOT `claim-function` or `claim-bonus-function`)
3. **Copy code from:** `supabase/functions/claim-bonus/index.ts`
4. **Paste** into the `index.ts` file
5. **Deploy**

### Step 4: Verify URLs

After deployment, URLs MUST show:
- `spin` → `/functions/v1/spin` ✅
- `claim-bonus` → `/functions/v1/claim-bonus` ✅

## 💎 REAL MONEY FEATURES:

✅ **All balances:** Real AUD from database
✅ **All wagers:** Real money (AUD)
✅ **All wins:** Real money payouts (AUD)
✅ **$111 Bonus:** Real money with 35x wagering requirement
✅ **No demo mode:** Everything is real money
✅ **Deposit required:** Users must deposit to play

## 🎯 THE $111 HOOK:

The $111 welcome bonus is the **psychological attraction**:
- Real money bonus (not demo)
- Creates excitement and engagement
- Minimum $30 deposit after bonus
- 35x wagering requirement
- Cannot withdraw until Silver tier

**This is what hooks players and gets them playing!**

## ✅ AFTER DEPLOYMENT:

Your platform will be a **100% REAL MONEY CASINO** with:
- Real AUD transactions
- Real money balances
- Real money bonuses
- Real money gaming
- No demo mode anywhere

