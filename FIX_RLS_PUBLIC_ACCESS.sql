-- =====================================================
-- FIX RLS POLICIES FOR PUBLIC GAME ACCESS
-- =====================================================
-- This allows anonymous users to view games on the landing page
-- Run this in Supabase SQL Editor
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

-- Test query (should work without authentication)
-- SELECT COUNT(*) FROM public.licensed_games WHERE status = 'active';
-- SELECT COUNT(*) FROM public.game_providers WHERE status = 'active';

