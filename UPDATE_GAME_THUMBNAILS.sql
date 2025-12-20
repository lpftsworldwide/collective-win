-- =====================================================
-- UPDATE GAME THUMBNAIL URLs
-- Run this AFTER the main migration to set image URLs
-- =====================================================

-- Update thumbnail URLs for all games that have images in /public/game-tiles/
UPDATE public.licensed_games
SET thumbnail_url = '/game-tiles/' || game_code || '.jpg'
WHERE game_code IN (
  'big-bass-splash', 'gates-of-olympus', 'sweet-bonanza', 'starlight-princess',
  'legend-of-cleopatra', 'egypt-fire', 'golden-pharaoh-megaways', 'crystal-fortune-deluxe',
  'oceans-treasure-quest', 'blackjack-royal-vip', 'dragons-fire-prosperity', 'lightning-strike-roulette',
  'wild-west-bounty-hunter', 'cosmic-gems-cluster', 'mega-fortune-jackpot-king', 'ancient-aztec-gold',
  'baccarat-royale-supreme', 'neon-city-nights', 'viking-conquest-saga', 'crash-rocket-multiplier',
  'diamond-dynasty-deluxe', 'egyptian-mysteries-unlimited', 'fruit-blitz-super-spin', 'pirates-plunder-megaways',
  'starburst-crystal-classic', 'buffalo-thunder-lightning', 'zeus-power-reels', 'sugar-rush-candy-blitz',
  'moon-princess-trinity', 'roulette-pro-european', 'aztec-bonanza-infinity', 'mega-moolah-fortune',
  'dead-or-alive-outlaw', 'jammin-jars-cluster-party', 'book-of-secrets-deluxe', 'gonzos-quest-megaways',
  'bonanza-goldmine-megaways', 'legacy-of-egypt-power', 'immortal-romance-remastered', 'fire-joker-respin',
  'reactoonz-quantum-leap', 'street-racer-nitro', 'tiki-fortune-totem', 'tomb-raider-expedition',
  'space-invaders-arcade', 'rainbow-riches-megaways', 'wolf-gold-moon-spin', 'poker-face-texas-holdem',
  'jungle-adventure-expedition', 'mega-ball-live', 'gladiator-arena-champion', 'fortune-tiger-prosperity',
  'fishing-frenzy-megaways'
);

-- Verify updates
SELECT game_code, name, thumbnail_url 
FROM public.licensed_games 
WHERE thumbnail_url IS NOT NULL 
LIMIT 10;

