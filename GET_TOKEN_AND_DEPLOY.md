# 🔑 GET ACCESS TOKEN AND DEPLOY

## ❌ What Happened

You entered the **verification code** (`cf7f0f07`) instead of the **access token**.

- ❌ Verification code: `cf7f0f07` (short, for browser login)
- ✅ Access token: `sbp_0102030405060708091011121314151617181920...` (long, starts with `sbp_`)

---

## ✅ How to Get the Access Token

### Step 1: Go to Access Tokens Page

👉 **https://supabase.com/dashboard/account/tokens**

### Step 2: Generate New Token

1. Click **"Generate new token"**
2. Give it a name (e.g., "CLI Deployment")
3. Click **"Generate"**
4. **Copy the token** - it starts with `sbp_` and is very long

### Step 3: Use the Token

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
./deploy-with-token.sh
```

When prompted, paste the **full token** (starts with `sbp_`)

---

## 🚀 Quick Deploy (After Getting Token)

```bash
# Set token
export SUPABASE_ACCESS_TOKEN="sbp_your_full_token_here"

# Deploy
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
npx supabase functions deploy spin --project-ref yiorietrtfosjnpzznnr
npx supabase functions deploy claim-bonus --project-ref yiorietrtfosjnpzznnr
```

---

## 📋 Token Format

✅ **Correct:** `sbp_0102030405060708091011121314151617181920...` (very long)
❌ **Wrong:** `cf7f0f07` (short, this is verification code)

---

**Get the token from the dashboard, then run the deploy script again!** 🚀
