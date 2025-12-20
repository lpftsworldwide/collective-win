-- ADD ALL ROYAL REELS GAMES TO DATABASE
-- This adds all the popular games from Royal Reels Casino

-- First, ensure we have the providers
INSERT INTO public.game_providers (name, code, status, license_jurisdiction, rng_certification, integration_type)
VALUES
  ('Booming', 'booming', 'active', 'Curacao', 'Provably Fair System', 'api'),
  ('Booongo', 'booongo', 'active', 'Curacao', 'Provably Fair System', 'api')
ON CONFLICT (code) DO UPDATE
SET status = 'active',
    updated_at = now();

-- Get provider IDs
DO $$
DECLARE
  pragmatic_id UUID;
  booongo_id UUID;
  booming_id UUID;
  playson_id UUID;
BEGIN
  SELECT id INTO pragmatic_id FROM public.game_providers WHERE code = 'pragmatic-play';
  SELECT id INTO booongo_id FROM public.game_providers WHERE code = 'booongo';
  SELECT id INTO booming_id FROM public.game_providers WHERE code = 'booming';
  SELECT id INTO playson_id FROM public.game_providers WHERE code = 'playson';
  
  -- If providers don't exist, create them
  IF pragmatic_id IS NULL THEN
    INSERT INTO public.game_providers (name, code, status, license_jurisdiction, rng_certification, integration_type)
    VALUES ('Pragmatic Play', 'pragmatic-play', 'active', 'Curacao', 'Provably Fair System', 'api')
    RETURNING id INTO pragmatic_id;
  END IF;
  
  IF booongo_id IS NULL THEN
    INSERT INTO public.game_providers (name, code, status, license_jurisdiction, rng_certification, integration_type)
    VALUES ('Booongo', 'booongo', 'active', 'Curacao', 'Provably Fair System', 'api')
    RETURNING id INTO booongo_id;
  END IF;
  
  IF booming_id IS NULL THEN
    INSERT INTO public.game_providers (name, code, status, license_jurisdiction, rng_certification, integration_type)
    VALUES ('Booming', 'booming', 'active', 'Curacao', 'Provably Fair System', 'api')
    RETURNING id INTO booming_id;
  END IF;
  
  IF playson_id IS NULL THEN
    INSERT INTO public.game_providers (name, code, status, license_jurisdiction, rng_certification, integration_type)
    VALUES ('Playson', 'playson', 'active', 'Curacao', 'Provably Fair System', 'api')
    RETURNING id INTO playson_id;
  END IF;

  -- Insert all Royal Reels games
  INSERT INTO public.licensed_games (
    provider_id, game_code, name, category, rtp_certified, volatility, status,
    min_bet_aud, max_bet_aud, is_demo_available, thumbnail_url
  ) VALUES
    -- Pragmatic Play Games
    (pragmatic_id, 'gates-of-olympus-super-scatter', 'Gates of Olympus Super Scatter', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/gates-of-olympus-super-scatter.jpg'),
    (pragmatic_id, 'brick-house-bonanza', 'Brick House Bonanza', 'slots', 96.48, 'medium', 'active', 0.20, 1000.00, false, '/game-tiles/brick-house-bonanza.jpg'),
    (pragmatic_id, 'sweet-bonanza-1000', 'Sweet Bonanza 1000', 'slots', 96.48, 'medium', 'active', 0.20, 1000.00, false, '/game-tiles/sweet-bonanza-1000.jpg'),
    (pragmatic_id, 'sleeping-dragon', 'Sleeping Dragon', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/sleeping-dragon.jpg'),
    (pragmatic_id, 'chests-of-cai-shen', 'Chests of Cai Shen', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/chests-of-cai-shen.jpg'),
    (pragmatic_id, 'sweet-bonanza-super-scatter', 'Sweet Bonanza Super Scatter', 'slots', 96.48, 'medium', 'active', 0.20, 1000.00, false, '/game-tiles/sweet-bonanza-super-scatter.jpg'),
    (pragmatic_id, 'sweet-rush-bonanza', 'Sweet Rush Bonanza', 'slots', 96.48, 'medium', 'active', 0.20, 1000.00, false, '/game-tiles/sweet-rush-bonanza.jpg'),
    (pragmatic_id, 'big-bass-amazon-xtreme', 'Big Bass Amazon Xtreme', 'slots', 96.71, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/big-bass-amazon-xtreme.jpg'),
    (pragmatic_id, 'big-bass-halloween-3', 'Big Bass Halloween 3', 'slots', 96.71, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/big-bass-halloween-3.jpg'),
    (pragmatic_id, 'big-bass-reel-repeat', 'Big Bass Reel Repeat', 'slots', 96.71, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/big-bass-reel-repeat.jpg'),
    (pragmatic_id, 'big-bass-bonanza-1000', 'Big Bass Bonanza 1000', 'slots', 96.71, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/big-bass-bonanza-1000.jpg'),
    
    -- Booongo Games
    (booongo_id, 'more-magic-apple', 'More Magic Apple', 'slots', 96.00, 'medium', 'active', 0.20, 1000.00, false, '/game-tiles/more-magic-apple.jpg'),
    (booongo_id, '3-coin-volcanoes', '3 Coin Volcanoes', 'slots', 96.00, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/3-coin-volcanoes.jpg'),
    (booongo_id, '3-super-hot-chillies', '3 Super Hot Chillies', 'slots', 96.00, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/3-super-hot-chillies.jpg'),
    
    -- Booming Games
    (booming_id, 'bonza-bucks-hold-and-win-extreme-10000', 'Bonza Bucks Hold and Win Extreme 10000', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/bonza-bucks-hold-and-win-extreme-10000.jpg'),
    
    -- Playson Games
    (playson_id, 'buffalo-power-2-hold-and-win', 'Buffalo Power 2: Hold and Win', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/buffalo-power-2-hold-and-win.jpg'),
    (playson_id, 'thunder-coins-hold-and-win', 'Thunder Coins: Hold and Win', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, false, '/game-tiles/thunder-coins-hold-and-win.jpg')
    
  ON CONFLICT (game_code) DO UPDATE
  SET 
    name = EXCLUDED.name,
    provider_id = EXCLUDED.provider_id,
    category = EXCLUDED.category,
    rtp_certified = EXCLUDED.rtp_certified,
    volatility = EXCLUDED.volatility,
    status = EXCLUDED.status,
    thumbnail_url = EXCLUDED.thumbnail_url,
    updated_at = now();

END $$;

-- Verify games were added
SELECT 
  lg.game_code,
  lg.name,
  gp.name as provider,
  lg.status
FROM public.licensed_games lg
JOIN public.game_providers gp ON lg.provider_id = gp.id
WHERE lg.game_code IN (
  'gates-of-olympus-super-scatter',
  'brick-house-bonanza',
  'more-magic-apple',
  'sweet-bonanza-1000',
  'sleeping-dragon',
  'chests-of-cai-shen',
  'buffalo-power-2-hold-and-win',
  'sweet-bonanza-super-scatter',
  'sweet-rush-bonanza',
  'big-bass-amazon-xtreme',
  'big-bass-halloween-3',
  'big-bass-reel-repeat',
  'bonza-bucks-hold-and-win-extreme-10000',
  'big-bass-bonanza-1000',
  'thunder-coins-hold-and-win',
  '3-coin-volcanoes',
  '3-super-hot-chillies'
)
ORDER BY lg.name;

