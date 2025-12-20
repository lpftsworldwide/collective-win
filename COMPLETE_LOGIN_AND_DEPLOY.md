# ✅ COMPLETE LOGIN AND DEPLOY

## Step 1: Complete Supabase Login

You have the verification code displayed in your browser: **`cf7f0f07`**

1. **Go back to your terminal** where you ran `npx supabase login`
2. **Enter the verification code:** `cf7f0f07`
3. **Press Enter**

You should see: `✅ Logged in successfully`

---

## Step 2: Verify Login

```bash
npx supabase projects list
```

You should see your projects listed.

---

## Step 3: Deploy Everything

Once logged in, run:

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
python3 deploy-full-automated.py
```

The script will:
- ✅ Deploy SQL migrations (if you provide database URL)
- ✅ Deploy edge functions automatically
- ✅ Verify everything

---

## Quick Deploy (After Login)

Or deploy functions directly:

```bash
# Link project
npx supabase link --project-ref yiorietrtfosjnpzznnr

# Deploy functions
npx supabase functions deploy spin --project-ref yiorietrtfosjnpzznnr
npx supabase functions deploy claim-bonus --project-ref yiorietrtfosjnpzznnr
```

---

**Complete the login first, then we'll deploy!** 🚀

