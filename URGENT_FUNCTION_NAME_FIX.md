# 🚨 URGENT: Function Names Still Wrong!

## ❌ CURRENT STATE (WRONG):

From your screenshot:
- Function name: `claim-function` → URL: `clever-serv...` ❌
- Function name: `demo-spin` → URL: `swift-servi...` ❌

## ✅ WHAT IT SHOULD BE:

- Function name: `claim-bonus` → URL: `/functions/v1/claim-bonus` ✅
- Function name: `demo-spin` → URL: `/functions/v1/demo-spin` ✅

## 🔧 FIX NOW:

### Step 1: Delete Both Functions

1. Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/functions
2. Click on `claim-function` → "..." menu → **Delete**
3. Click on `demo-spin` → "..." menu → **Delete**

### Step 2: Create `claim-bonus` Function

1. Click "Deploy a new function"
2. **Function name:** Type exactly `claim-bonus` (NOT `claim-function` or `claim-bonus-function`)
3. In the `index.ts` file, paste code from: `supabase/functions/claim-bonus/index.ts`
4. Click "Deploy function"

### Step 3: Create `demo-spin` Function

1. Click "Deploy a new function"
2. **Function name:** Type exactly `demo-spin` (NOT `demo-spin-function` or anything else)
3. In the `index.ts` file, paste code from: `supabase/functions/demo-spin/index.ts`
4. Click "Deploy function"

### Step 4: Verify URLs

After deployment, the URLs MUST show:
- `claim-bonus` → `/functions/v1/claim-bonus` ✅
- `demo-spin` → `/functions/v1/demo-spin` ✅

**If the URLs still show `clever-serv...` or `swift-servi...`, the function names are STILL WRONG!**

## ⚠️ CRITICAL:

The function name in the Supabase Dashboard **MUST MATCH EXACTLY** what your code calls:
- Your code calls: `supabase.functions.invoke('claim-bonus')`
- So function name MUST be: `claim-bonus` (exactly)

- Your code calls: `supabase.functions.invoke('demo-spin')`
- So function name MUST be: `demo-spin` (exactly)

**No variations, no extra words, no typos!**

