-- =====================================================
-- CREATE ADMIN ACCOUNT
-- =====================================================
-- Email: advsions@proton.me
-- Password: Fuckingdogs2025
-- =====================================================
-- 
-- IMPORTANT: User must be created in Supabase Dashboard first!
-- Then run this SQL to add to admin_users table
-- =====================================================

-- Step 1: Create user in Supabase Dashboard
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

-- Expected result: 1 row with is_master = true

