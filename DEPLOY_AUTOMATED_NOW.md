# 🚀 FULLY AUTOMATED DEPLOYMENT - RUN NOW

## Quick Start

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
python3 deploy-full-automated.py
```

The script will:
1. ✅ Prompt for credentials if not found
2. ✅ Deploy SQL migrations automatically
3. ✅ Deploy edge functions automatically
4. ✅ Verify everything worked

---

## Credentials Needed

### Option 1: Interactive (Script will prompt)

Just run:
```bash
python3 deploy-full-automated.py
```

The script will ask for:
- **SUPABASE_SERVICE_ROLE_KEY** - From Dashboard → Settings → API
- **SUPABASE_ACCESS_TOKEN** - From Dashboard → Account → Access Tokens (or login via CLI)
- **DATABASE_URL** - From Dashboard → Settings → Database → Connection string

### Option 2: Command Line Arguments

```bash
python3 deploy-full-automated.py \
  --service-role-key "eyJ..." \
  --access-token "sbp_..." \
  --database-url "postgresql://..."
```

### Option 3: Environment Variables

```bash
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
export SUPABASE_ACCESS_TOKEN="sbp_..."
export DATABASE_URL="postgresql://..."

python3 deploy-full-automated.py
```

---

## Where to Get Credentials

### 1. Service Role Key
- Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/api
- Look for **"service_role"** key (secret, starts with `eyJ...`)
- Copy the entire key

### 2. Access Token
**Option A: CLI Login (Recommended)**
```bash
npx supabase login
```
Then run the script - it will detect CLI authentication.

**Option B: Get Token**
- Go to: https://supabase.com/dashboard/account/tokens
- Create new token
- Copy token

### 3. Database URL
- Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/settings/database
- Look for **"Connection string"** → **"URI"**
- Format: `postgresql://postgres:[PASSWORD]@db.yiorietrtfosjnpzznnr.supabase.co:5432/postgres`
- Replace `[PASSWORD]` with your database password

---

## What Gets Deployed

1. **SQL Migrations:**
   - `REAL_MONEY_COMPLETE_MIGRATION.sql` (creates all tables, games, etc.)
   - `UPDATE_GAME_THUMBNAILS.sql` (fixes game images)

2. **Edge Functions:**
   - `spin` (game spin handler)
   - `claim-bonus` ($111 bonus claim handler)

3. **Verification:**
   - Tests database connection
   - Tests function endpoints
   - Verifies games table

---

## Troubleshooting

### "Access token not provided"
- Run: `npx supabase login`
- Or provide `--access-token` argument

### "Service role key not found"
- Get it from Supabase Dashboard → Settings → API
- Provide via `--service-role-key` or environment variable

### "Database connection string not found"
- Get it from Supabase Dashboard → Settings → Database
- Provide via `--database-url` or environment variable

### "psql not found"
- Install PostgreSQL client: `sudo dnf install postgresql`
- Or deploy SQL manually via SQL Editor

---

## Run It Now!

```bash
cd /var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS
python3 deploy-full-automated.py
```

**The script will guide you through everything!** 🚀

