-- =====================================================
-- POPULATE CUSTOM GAMES FROM GAME LIBRARY
-- =====================================================

-- 1. Add "Collective Wins" as a provider for our custom games
INSERT INTO public.game_providers (name, code, status, license_jurisdiction, rng_certification, integration_type)
VALUES 
  ('Collective Wins', 'collective-wins', 'active', 'Internal RNG', 'Provably Fair System', 'direct')
ON CONFLICT (code) DO UPDATE
SET 
  status = 'active',
  updated_at = now();

-- Get the Collective Wins provider ID
DO $$
DECLARE
  collective_wins_provider_id UUID;
BEGIN
  SELECT id INTO collective_wins_provider_id 
  FROM public.game_providers 
  WHERE code = 'collective-wins';

  -- 2. Insert all games from gameLibrary.ts
  -- Map GameType to category: 'Slot' -> 'slots', 'Live' -> 'live', 'Table' -> 'table', 'Crash' -> 'crash'
  -- Map Volatility: 'Low' -> 'low', 'Medium' -> 'medium', 'High' -> 'high'
  -- Map RTP: Remove '%' and convert to numeric

  INSERT INTO public.licensed_games (
    provider_id,
    game_code,
    name,
    category,
    rtp_certified,
    volatility,
    status,
    min_bet_aud,
    max_bet_aud,
    is_demo_available
  ) VALUES
    -- Big Bass Splash
    (collective_wins_provider_id, 'big-bass-splash', 'Big Bass Splash', 'slots', 96.71, 'high', 'active', 0.20, 1000.00, true),
    -- Gates of Olympus
    (collective_wins_provider_id, 'gates-of-olympus', 'Gates of Olympus', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, true),
    -- Sweet Bonanza
    (collective_wins_provider_id, 'sweet-bonanza', 'Sweet Bonanza', 'slots', 96.48, 'medium', 'active', 0.20, 1000.00, true),
    -- Starlight Princess 1000
    (collective_wins_provider_id, 'starlight-princess', 'Starlight Princess 1000', 'slots', 96.55, 'high', 'active', 0.20, 1000.00, true),
    -- Legend of Cleopatra
    (collective_wins_provider_id, 'legend-of-cleopatra', 'Legend of Cleopatra', 'slots', 95.05, 'medium', 'active', 0.20, 1000.00, true),
    -- Egypt Fire (Hold and Win)
    (collective_wins_provider_id, 'egypt-fire', 'Egypt Fire (Hold and Win)', 'slots', 96.25, 'high', 'active', 0.20, 1000.00, true),
    -- Golden Pharaoh Megaways
    (collective_wins_provider_id, 'golden-pharaoh-megaways', 'Golden Pharaoh Megaways', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, true),
    -- Crystal Fortune Deluxe
    (collective_wins_provider_id, 'crystal-fortune-deluxe', 'Crystal Fortune Deluxe', 'slots', 96.50, 'medium', 'active', 0.20, 1000.00, true),
    -- Ocean's Treasure Quest
    (collective_wins_provider_id, 'oceans-treasure-quest', 'Ocean''s Treasure Quest', 'slots', 97.10, 'low', 'active', 0.20, 1000.00, true),
    -- Blackjack Royal VIP
    (collective_wins_provider_id, 'blackjack-royal-vip', 'Blackjack Royal VIP', 'table', 99.50, 'low', 'active', 1.00, 5000.00, true),
    -- Dragon's Fire Prosperity
    (collective_wins_provider_id, 'dragons-fire-prosperity', 'Dragon''s Fire Prosperity', 'slots', 96.90, 'high', 'active', 0.20, 1000.00, true),
    -- Lightning Strike Roulette
    (collective_wins_provider_id, 'lightning-strike-roulette', 'Lightning Strike Roulette', 'live', 97.30, 'medium', 'active', 0.50, 5000.00, true),
    -- Wild West Bounty Hunter
    (collective_wins_provider_id, 'wild-west-bounty-hunter', 'Wild West Bounty Hunter', 'slots', 96.60, 'high', 'active', 0.20, 1000.00, true),
    -- Cosmic Gems Cluster
    (collective_wins_provider_id, 'cosmic-gems-cluster', 'Cosmic Gems Cluster', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, true),
    -- Mega Fortune Jackpot King
    (collective_wins_provider_id, 'mega-fortune-jackpot-king', 'Mega Fortune Jackpot King', 'slots', 95.80, 'medium', 'active', 0.20, 1000.00, true),
    -- Ancient Aztec Gold
    (collective_wins_provider_id, 'ancient-aztec-gold', 'Ancient Aztec Gold', 'slots', 96.40, 'high', 'active', 0.20, 1000.00, true),
    -- Baccarat Royale Supreme
    (collective_wins_provider_id, 'baccarat-royale-supreme', 'Baccarat Royale Supreme', 'live', 98.90, 'low', 'active', 1.00, 10000.00, true),
    -- Neon City Nights
    (collective_wins_provider_id, 'neon-city-nights', 'Neon City Nights', 'slots', 96.80, 'medium', 'active', 0.20, 1000.00, true),
    -- Viking Conquest Saga
    (collective_wins_provider_id, 'viking-conquest-saga', 'Viking Conquest Saga', 'slots', 97.00, 'high', 'active', 0.20, 1000.00, true),
    -- Crash Rocket Multiplier
    (collective_wins_provider_id, 'crash-rocket-multiplier', 'Crash Rocket Multiplier', 'crash', 97.50, 'high', 'active', 0.10, 1000.00, true),
    -- Diamond Dynasty Deluxe
    (collective_wins_provider_id, 'diamond-dynasty-deluxe', 'Diamond Dynasty Deluxe', 'slots', 96.50, 'low', 'active', 0.20, 1000.00, true),
    -- Egyptian Mysteries Unlimited
    (collective_wins_provider_id, 'egyptian-mysteries-unlimited', 'Egyptian Mysteries Unlimited', 'slots', 96.90, 'medium', 'active', 0.20, 1000.00, true),
    -- Fruit Blitz Super Spin
    (collective_wins_provider_id, 'fruit-blitz-super-spin', 'Fruit Blitz Super Spin', 'slots', 97.20, 'low', 'active', 0.20, 1000.00, true),
    -- Pirate's Plunder Megaways
    (collective_wins_provider_id, 'pirates-plunder-megaways', 'Pirate''s Plunder Megaways', 'slots', 96.60, 'high', 'active', 0.20, 1000.00, true),
    -- Starburst Crystal Classic
    (collective_wins_provider_id, 'starburst-crystal-classic', 'Starburst Crystal Classic', 'slots', 96.30, 'low', 'active', 0.20, 1000.00, true),
    -- Buffalo Thunder Lightning
    (collective_wins_provider_id, 'buffalo-thunder-lightning', 'Buffalo Thunder Lightning', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, true),
    -- Zeus Power Reels
    (collective_wins_provider_id, 'zeus-power-reels', 'Zeus Power Reels', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, true),
    -- Sugar Rush Candy Blitz
    (collective_wins_provider_id, 'sugar-rush-candy-blitz', 'Sugar Rush Candy Blitz', 'slots', 96.40, 'medium', 'active', 0.20, 1000.00, true),
    -- Moon Princess Trinity
    (collective_wins_provider_id, 'moon-princess-trinity', 'Moon Princess Trinity', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, true),
    -- Roulette Pro European
    (collective_wins_provider_id, 'roulette-pro-european', 'Roulette Pro European', 'table', 97.30, 'low', 'active', 0.50, 5000.00, true),
    -- Aztec Bonanza Infinity
    (collective_wins_provider_id, 'aztec-bonanza-infinity', 'Aztec Bonanza Infinity', 'slots', 96.60, 'high', 'active', 0.20, 1000.00, true),
    -- Mega Moolah Fortune
    (collective_wins_provider_id, 'mega-moolah-fortune', 'Mega Moolah Fortune', 'slots', 95.90, 'medium', 'active', 0.20, 1000.00, true),
    -- Dead or Alive Outlaw
    (collective_wins_provider_id, 'dead-or-alive-outlaw', 'Dead or Alive Outlaw', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, true),
    -- Jammin' Jars Cluster Party
    (collective_wins_provider_id, 'jammin-jars-cluster-party', 'Jammin'' Jars Cluster Party', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, true),
    -- Book of Secrets Deluxe
    (collective_wins_provider_id, 'book-of-secrets-deluxe', 'Book of Secrets Deluxe', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, true),
    -- Gonzo's Quest Megaways
    (collective_wins_provider_id, 'gonzos-quest-megaways', 'Gonzo''s Quest Megaways', 'slots', 96.00, 'medium', 'active', 0.20, 1000.00, true),
    -- Bonanza Goldmine Megaways
    (collective_wins_provider_id, 'bonanza-goldmine-megaways', 'Bonanza Goldmine Megaways', 'slots', 96.40, 'high', 'active', 0.20, 1000.00, true),
    -- Legacy of Egypt Power
    (collective_wins_provider_id, 'legacy-of-egypt-power', 'Legacy of Egypt Power', 'slots', 96.50, 'medium', 'active', 0.20, 1000.00, true),
    -- Immortal Romance Remastered
    (collective_wins_provider_id, 'immortal-romance-remastered', 'Immortal Romance Remastered', 'slots', 96.90, 'medium', 'active', 0.20, 1000.00, true),
    -- Fire Joker Respin
    (collective_wins_provider_id, 'fire-joker-respin', 'Fire Joker Respin', 'slots', 96.20, 'medium', 'active', 0.20, 1000.00, true),
    -- Reactoonz Quantum Leap
    (collective_wins_provider_id, 'reactoonz-quantum-leap', 'Reactoonz Quantum Leap', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, true),
    -- Street Racer Nitro
    (collective_wins_provider_id, 'street-racer-nitro', 'Street Racer Nitro', 'slots', 96.60, 'medium', 'active', 0.20, 1000.00, true),
    -- Tiki Fortune Totem
    (collective_wins_provider_id, 'tiki-fortune-totem', 'Tiki Fortune Totem', 'slots', 96.30, 'low', 'active', 0.20, 1000.00, true),
    -- Tomb Raider Expedition
    (collective_wins_provider_id, 'tomb-raider-expedition', 'Tomb Raider Expedition', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, true),
    -- Space Invaders Arcade
    (collective_wins_provider_id, 'space-invaders-arcade', 'Space Invaders Arcade', 'slots', 96.10, 'low', 'active', 0.20, 1000.00, true),
    -- Rainbow Riches Megaways
    (collective_wins_provider_id, 'rainbow-riches-megaways', 'Rainbow Riches Megaways', 'slots', 96.50, 'medium', 'active', 0.20, 1000.00, true),
    -- Wolf Gold Moon Spin
    (collective_wins_provider_id, 'wolf-gold-moon-spin', 'Wolf Gold Moon Spin', 'slots', 96.00, 'medium', 'active', 0.20, 1000.00, true),
    -- Poker Face Texas Hold'em
    (collective_wins_provider_id, 'poker-face-texas-holdem', 'Poker Face Texas Hold''em', 'table', 99.00, 'medium', 'active', 1.00, 5000.00, true),
    -- Jungle Adventure Expedition
    (collective_wins_provider_id, 'jungle-adventure-expedition', 'Jungle Adventure Expedition', 'slots', 96.40, 'high', 'active', 0.20, 1000.00, true),
    -- Mega Ball Live
    (collective_wins_provider_id, 'mega-ball-live', 'Mega Ball Live', 'live', 95.40, 'medium', 'active', 0.10, 1000.00, true),
    -- Gladiator Arena Champion
    (collective_wins_provider_id, 'gladiator-arena-champion', 'Gladiator Arena Champion', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, true),
    -- Fortune Tiger Prosperity
    (collective_wins_provider_id, 'fortune-tiger-prosperity', 'Fortune Tiger Prosperity', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, true),
    -- Fishing Frenzy Megaways
    (collective_wins_provider_id, 'fishing-frenzy-megaways', 'Fishing Frenzy Megaways', 'slots', 96.10, 'high', 'active', 0.20, 1000.00, true)
  ON CONFLICT (game_code) DO UPDATE
  SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    rtp_certified = EXCLUDED.rtp_certified,
    volatility = EXCLUDED.volatility,
    status = EXCLUDED.status,
    min_bet_aud = EXCLUDED.min_bet_aud,
    max_bet_aud = EXCLUDED.max_bet_aud,
    is_demo_available = EXCLUDED.is_demo_available,
    updated_at = now();
END $$;

