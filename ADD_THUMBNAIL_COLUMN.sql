-- =====================================================
-- ADD THUMBNAIL_URL COLUMN TO LICENSED_GAMES
-- Run this FIRST if thumbnail_url column doesn't exist
-- =====================================================

-- Add thumbnail_url column if it doesn't exist
ALTER TABLE public.licensed_games 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Verify column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'licensed_games' 
  AND column_name = 'thumbnail_url';

