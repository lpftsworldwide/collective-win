-- Verification Query for Game Images
-- Run this in Supabase SQL Editor after running all_migrations_combined.sql

-- 1. Check total games
SELECT 
  COUNT(*) as total_games,
  COUNT(thumbnail_url) as games_with_images,
  COUNT(*) - COUNT(thumbnail_url) as games_missing_images
FROM public.licensed_games
WHERE provider_id IN (
  SELECT id FROM public.game_providers WHERE code = 'collective-wins'
);

-- 2. List all games with their thumbnail URLs
SELECT 
  game_code,
  name,
  category,
  thumbnail_url,
  CASE 
    WHEN thumbnail_url IS NULL THEN '❌ Missing'
    WHEN thumbnail_url NOT LIKE '/game-tiles/%' THEN '⚠️ Wrong format'
    ELSE '✅ OK'
  END as status
FROM public.licensed_games
WHERE provider_id IN (
  SELECT id FROM public.game_providers WHERE code = 'collective-wins'
)
ORDER BY game_code;

-- 3. Find games with NULL or empty thumbnail_url
SELECT 
  game_code,
  name,
  category
FROM public.licensed_games
WHERE provider_id IN (
  SELECT id FROM public.game_providers WHERE code = 'collective-wins'
)
AND (thumbnail_url IS NULL OR thumbnail_url = '')
ORDER BY game_code;

-- 4. Find games with incorrect thumbnail_url format
SELECT 
  game_code,
  name,
  thumbnail_url
FROM public.licensed_games
WHERE provider_id IN (
  SELECT id FROM public.game_providers WHERE code = 'collective-wins'
)
AND thumbnail_url IS NOT NULL
AND thumbnail_url NOT LIKE '/game-tiles/%'
ORDER BY game_code;

