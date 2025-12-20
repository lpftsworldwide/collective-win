# 📋 SQL Files Replacement Guide

## Overview

This guide explains which SQL files replace old ones and the correct order to run them.

---

## 🗂️ SQL File Structure

### **MAIN MIGRATION (Run First)**

**File:** `REAL_MONEY_COMPLETE_MIGRATION.sql`

**Replaces:** 
- ❌ `DEPLOY_ALL_MIGRATIONS.sql` (DELETED - was the old demo version)

**What it does:**
- Creates ALL database tables (`public.users`, `game_providers`, `licensed_games`, `admin_users`, `game_spins`, `user_bonuses`, `provably_fair_verification`, `user_tiers`, `rate_limit_logs`)
- Sets up Row Level Security (RLS) policies
- Inserts 50 real-money games (all with `is_demo_available = false`)
- Creates all triggers and functions
- **This is a COMPLETE database setup from scratch**

**When to use:**
- ✅ **New database** (fresh Supabase project)
- ✅ **Complete reset** (dropping all tables and starting over)

---

### **UPDATE SCRIPTS (Run After Main Migration)**

#### 1. **UPDATE_GAME_THUMBNAILS.sql**

**Replaces:** Nothing (this is NEW)

**What it does:**
- Updates `thumbnail_url` column for all games to point to `/game-tiles/{game_code}.jpg`
- Fixes missing game card images on the frontend

**When to use:**
- ✅ After running `REAL_MONEY_COMPLETE_MIGRATION.sql`
- ✅ If game images aren't showing on the website

---

#### 2. **UPDATE_TO_REAL_MONEY.sql**

**Replaces:** Nothing (this is NEW)

**What it does:**
- Converts existing demo database to real money
- Removes `demo_only` status from games
- Sets all `is_demo_available = false`
- Updates status constraints

**When to use:**
- ✅ If you already have a database with demo games
- ✅ Converting from demo mode to real money mode
- ❌ **NOT needed** if you ran `REAL_MONEY_COMPLETE_MIGRATION.sql` (it already sets real money)

---

## 📝 Execution Order

### **Scenario 1: Fresh Database (Recommended)**

```sql
-- Step 1: Run the complete migration
REAL_MONEY_COMPLETE_MIGRATION.sql

-- Step 2: Update game images
UPDATE_GAME_THUMBNAILS.sql
```

**Result:** ✅ Fully configured real-money database with all games and images

---

### **Scenario 2: Converting Existing Demo Database**

```sql
-- Step 1: Run the complete migration (or keep existing tables)
REAL_MONEY_COMPLETE_MIGRATION.sql
-- OR keep your existing tables if they're already set up

-- Step 2: Convert to real money
UPDATE_TO_REAL_MONEY.sql

-- Step 3: Update game images
UPDATE_GAME_THUMBNAILS.sql
```

**Result:** ✅ Converted database with real-money games and images

---

## 🗑️ Old Files (DELETED)

These files have been **deleted** and replaced:

- ❌ `DEPLOY_ALL_MIGRATIONS.sql` → Replaced by `REAL_MONEY_COMPLETE_MIGRATION.sql`
- ❌ `supabase/functions/demo-spin/index.ts` → Renamed to `supabase/functions/spin/index.ts`

---

## ✅ Quick Reference

| File | Purpose | Run When |
|------|---------|----------|
| `REAL_MONEY_COMPLETE_MIGRATION.sql` | Complete database setup | Fresh database or reset |
| `UPDATE_GAME_THUMBNAILS.sql` | Fix game images | After main migration |
| `UPDATE_TO_REAL_MONEY.sql` | Convert demo → real money | Converting existing demo DB |

---

## 🚀 How to Run in Supabase

1. **Open Supabase Dashboard**
2. **Go to:** SQL Editor
3. **Copy and paste** the SQL file content
4. **Click:** Run (or press `Ctrl+Enter`)
5. **Verify:** Check the output for errors

---

## ⚠️ Important Notes

- **Always backup** your database before running migrations
- **Run migrations in order** (main migration first, then updates)
- **Check for errors** in the Supabase SQL Editor output
- **Verify tables** exist after running: `SELECT * FROM public.licensed_games LIMIT 5;`

---

**Last Updated:** 2024-12-20

