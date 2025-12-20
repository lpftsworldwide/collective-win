# 📋 COPY & PASTE SQL - READY TO RUN

## 🔴 CRITICAL: Fix 401 Errors (Run This First!)

**Go to:** https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/sql/new

**Copy and paste this entire SQL block:**

```sql
-- =====================================================
-- FIX RLS POLICIES FOR PUBLIC GAME ACCESS
-- =====================================================
-- This allows anonymous users to view games on the landing page
-- =====================================================

-- Enable RLS on licensed_games if not already enabled
ALTER TABLE public.licensed_games ENABLE ROW LEVEL SECURITY;

-- Enable RLS on game_providers if not already enabled
ALTER TABLE public.game_providers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view available games" ON public.licensed_games;
DROP POLICY IF EXISTS "Public can view active games" ON public.licensed_games;
DROP POLICY IF EXISTS "Anonymous users can view games" ON public.licensed_games;

DROP POLICY IF EXISTS "Anyone can view active providers" ON public.game_providers;
DROP POLICY IF EXISTS "Public can view active providers" ON public.game_providers;
DROP POLICY IF EXISTS "Anonymous users can view providers" ON public.game_providers;

-- Create policy for public read access to licensed_games
-- This allows anyone (including anonymous users) to view active games
CREATE POLICY "Anyone can view available games"
  ON public.licensed_games FOR SELECT
  USING (status IN ('active', 'demo_only', 'coming_soon'));

-- Create policy for public read access to game_providers
-- This allows anyone to view active providers
CREATE POLICY "Anyone can view active providers"
  ON public.game_providers FOR SELECT
  USING (status = 'active');

-- Verify policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('licensed_games', 'game_providers')
ORDER BY tablename, policyname;
```

**Click "Run" button** (green button at bottom right)

---

## 👤 Create Admin Account (Run This Second)

**After creating user in Dashboard, run this SQL:**

```sql
-- =====================================================
-- CREATE ADMIN ACCOUNT
-- =====================================================
-- Email: advsions@proton.me
-- Password: Fuckingdogs2025
-- =====================================================

-- Step 1: Create user in Supabase Dashboard first!
-- Go to: https://supabase.com/dashboard/project/yiorietrtfosjnpzznnr/auth/users
-- Click "Add User" → "Create new user"
-- Email: advsions@proton.me
-- Password: Fuckingdogs2025
-- Auto Confirm: Yes

-- Step 2: After user is created, add to admin_users table
INSERT INTO public.admin_users (user_id, is_master)
SELECT id, true
FROM auth.users
WHERE email = 'advsions@proton.me'
ON CONFLICT (user_id) DO UPDATE
SET is_master = true,
    updated_at = now();

-- Step 3: Verify admin user was created
SELECT 
  au.id,
  au.user_id,
  au.is_master,
  u.email,
  u.created_at
FROM public.admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE u.email = 'advsions@proton.me';
```

---

## 📁 File Locations (For Reference)

The SQL files are in your project:
- `/var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS/FIX_RLS_PUBLIC_ACCESS.sql`
- `/var/home/master/LPFTS_Dev/Projects/COLLECTIVE-WINS/CREATE_ADMIN_ACCOUNT.sql`

But you can just copy/paste from above! ✅

---

**Copy the SQL blocks above and paste into Supabase SQL Editor!** 🚀

