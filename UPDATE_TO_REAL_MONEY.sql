-- =====================================================
-- UPDATE TO REAL MONEY - REMOVE ALL DEMO REFERENCES
-- Run this AFTER the main migration to convert to real money
-- =====================================================

-- Update all games to real money (remove demo_only status)
UPDATE public.licensed_games
SET 
  status = 'active',
  is_demo_available = false
WHERE status = 'demo_only';

-- Remove demo_only from status constraint (if possible)
-- Note: This requires dropping and recreating the constraint
ALTER TABLE public.licensed_games
DROP CONSTRAINT IF EXISTS licensed_games_status_check;

ALTER TABLE public.licensed_games
ADD CONSTRAINT licensed_games_status_check 
CHECK (status IN ('active', 'coming_soon', 'disabled'));

-- Update any games with demo status to active
UPDATE public.licensed_games
SET status = 'active'
WHERE status NOT IN ('active', 'coming_soon', 'disabled');

-- Verify all games are real money
SELECT 
  game_code,
  name,
  status,
  is_demo_available,
  CASE 
    WHEN status = 'demo_only' THEN '❌ NEEDS FIX'
    WHEN is_demo_available = true THEN '⚠️ HAS DEMO FLAG'
    ELSE '✅ REAL MONEY'
  END as status_check
FROM public.licensed_games
ORDER BY status_check, name;

-- Set all games to real money only
UPDATE public.licensed_games
SET is_demo_available = false;

-- Final verification
SELECT 
  COUNT(*) as total_games,
  COUNT(*) FILTER (WHERE status = 'active') as active_games,
  COUNT(*) FILTER (WHERE is_demo_available = false) as real_money_games,
  COUNT(*) FILTER (WHERE status = 'demo_only') as demo_only_games
FROM public.licensed_games;

