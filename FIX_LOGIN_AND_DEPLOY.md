# 🔧 FIX LOGIN AND DEPLOY

## ❌ Problem: Login Not Completed

The Supabase CLI login didn't complete successfully. Here's how to fix it:

---

## ✅ Solution 1: Complete Login in Your Terminal

1. **In your terminal, run:**
   ```bash
   npx supabase login
   ```

2. **Browser will open** - you'll see verification code

3. **Go back to terminal** - it will prompt: `Enter verification code:`

4. **Enter the code** from browser (e.g., `cf7f0f07`)

5. **Press Enter**

6. **Verify it worked:**
   ```bash
   npx supabase projects list
   ```
   Should show your projects!

---

## ✅ Solution 2: Use Access Token Directly (Faster)

If login keeps failing, get token from dashboard:

1. **Go to:** https://supabase.com/dashboard/account/tokens

2. **Create new token** (or use existing)

3. **Copy the token** (starts with `sbp_...`)

4. **Set it as environment variable:**
   ```bash
   export SUPABASE_ACCESS_TOKEN="sbp_your_token_here"
   ```

5. **Then deploy:**
   ```bash
   cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
   ./deploy-after-login.sh
   ```

---

## ✅ Solution 3: Deploy Functions with Token

If you have the token, deploy directly:

```bash
export SUPABASE_ACCESS_TOKEN="sbp_your_token_here"

cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS

# Deploy functions
npx supabase functions deploy spin --project-ref yiorietrtfosjnpzznnr
npx supabase functions deploy claim-bonus --project-ref yiorietrtfosjnpzznnr
```

---

## 🚀 Quick Deploy Script (With Token)

Create this file and run it:

```bash
cat > deploy-with-token.sh << 'EOF'
#!/bin/bash
# Get token from user
read -p "Enter Supabase Access Token (from dashboard): " TOKEN
export SUPABASE_ACCESS_TOKEN="$TOKEN"

echo "🚀 Deploying functions..."

npx supabase functions deploy spin --project-ref yiorietrtfosjnpzznnr
npx supabase functions deploy claim-bonus --project-ref yiorietrtfosjnpzznnr

echo "✅ Done!"
EOF

chmod +x deploy-with-token.sh
./deploy-with-token.sh
```

---

## 📋 Where to Get Token

1. Go to: https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Copy the token (starts with `sbp_...`)
4. Use it in the commands above

---

**Try Solution 2 (Access Token) - it's the fastest!** 🚀

