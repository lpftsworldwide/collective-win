-- =====================================================
-- QUICK FIX: Update All Game Thumbnail URLs
-- =====================================================
-- Run this in Supabase SQL Editor to fix missing images
-- =====================================================

-- Update ALL games with thumbnail URLs (if they have images)
UPDATE public.licensed_games
SET thumbnail_url = '/game-tiles/' || game_code || '.jpg'
WHERE thumbnail_url IS NULL 
   OR thumbnail_url = ''
   OR thumbnail_url NOT LIKE '/game-tiles/%';

-- Verify the update
SELECT 
  game_code, 
  name, 
  thumbnail_url,
  CASE 
    WHEN thumbnail_url IS NOT NULL THEN '✅ Has URL'
    ELSE '❌ Missing URL'
  END as status
FROM public.licensed_games 
ORDER BY game_code
LIMIT 20;

-- Count how many have thumbnails
SELECT 
  COUNT(*) FILTER (WHERE thumbnail_url IS NOT NULL) as with_thumbnails,
  COUNT(*) FILTER (WHERE thumbnail_url IS NULL) as without_thumbnails,
  COUNT(*) as total_games
FROM public.licensed_games;

