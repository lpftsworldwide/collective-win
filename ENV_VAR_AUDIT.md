# 🔍 ENVIRONMENT VARIABLES AUDIT - WHAT'S ACTUALLY REQUIRED

## ✅ CRITICAL (MUST HAVE)

### Frontend (Vercel)
```bash
VITE_SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Why**: These are used in `src/integrations/supabase/client.ts` to connect to your database.

### Backend (Supabase Edge Functions)
```bash
SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Why**: Edge Functions need these to access the database with admin privileges.

---

## ⚠️ OPTIONAL (NICE TO HAVE)

### Analytics (Optional)
```bash
VITE_GA_ID=G-XXXXXXXXXX  # Google Analytics
```
**Why**: Only if you want analytics tracking. Not required for games to work.

### Email (Optional)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```
**Why**: Only if you want custom email sending. Supabase handles auth emails by default.

### Web3 (Future - Not Currently Used)
```bash
WEB3_RPC_URL=https://polygon-rpc.com
WALLET_PRIVATE_KEY=0x...
```
**Why**: These are in `.env.example` but **NOT USED** in current codebase. Future feature.

---

## ❌ NOT NEEDED (Can Remove)

### External Game Provider APIs
**YOU DON'T NEED THESE!**

Your current setup:
- ✅ Games run on **YOUR OWN** Supabase Edge Functions (`/functions/v1/spin`)
- ✅ All game logic is **YOUR CODE** (no external APIs)
- ✅ Database stores all game configs locally

**You are already the API!** No external game provider needed.

---

## 🎯 MINIMAL WORKING SETUP

**For Frontend (Vercel):**
```bash
VITE_SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**For Backend (Supabase Dashboard → Edge Functions):**
```bash
SUPABASE_URL=https://yiorietrtfosjnpzznnr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**That's it!** Everything else is optional.

---

## 🚀 YOUR CURRENT ARCHITECTURE

```
┌─────────────────┐
│   Vercel        │  ← Frontend (React)
│   (Frontend)    │     Uses: VITE_SUPABASE_URL + KEY
└────────┬────────┘
         │
         │ REST API
         ▼
┌─────────────────┐
│   Supabase      │  ← Backend (PostgreSQL + Edge Functions)
│   (Your API)    │     Uses: SUPABASE_URL + SERVICE_ROLE_KEY
└────────┬────────┘
         │
         │ Database Queries
         ▼
┌─────────────────┐
│   PostgreSQL    │  ← Your Database
│   (Your Data)   │     Stores: Games, Users, Spins
└─────────────────┘
```

**NO EXTERNAL GAME PROVIDER APIS NEEDED!**

Your games run on:
- ✅ Your own Edge Functions (`spin`, `claim-bonus`)
- ✅ Your own database (`licensed_games` table)
- ✅ Your own RNG algorithm (in `spin/index.ts`)

---

## 📋 CLEANUP RECOMMENDATION

**Remove from `.env.example`:**
- ❌ `WEB3_RPC_URL` (not used)
- ❌ `WALLET_PRIVATE_KEY` (not used)
- ❌ `SMTP_*` (optional, Supabase handles emails)
- ❌ `VITE_GA_ID` (optional analytics)

**Keep:**
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_PUBLISHABLE_KEY`
- ✅ `SUPABASE_URL` (for Edge Functions)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (for Edge Functions)

---

## ✅ SUMMARY

**Question**: "Are all these env vars required?"

**Answer**: **NO!** Only 4 are critical:
1. `VITE_SUPABASE_URL`
2. `VITE_SUPABASE_PUBLISHABLE_KEY`
3. `SUPABASE_URL` (Edge Functions)
4. `SUPABASE_SERVICE_ROLE_KEY` (Edge Functions)

**Question**: "Should APIs for popular games exist?"

**Answer**: **NO!** You're already running your own:
- ✅ Your own game engine (Edge Functions)
- ✅ Your own database (Supabase)
- ✅ Your own RNG (custom algorithm)
- ✅ No external game provider needed!

**You ARE the API!** 🎮✅

