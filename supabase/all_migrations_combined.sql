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
    is_demo_available,
    thumbnail_url
  ) VALUES
    -- Big Bass Splash
    (collective_wins_provider_id, 'big-bass-splash', 'Big Bass Splash', 'slots', 96.71, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/big-bass-splash.jpg'),
    -- Gates of Olympus
    (collective_wins_provider_id, 'gates-of-olympus', 'Gates of Olympus', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/gates-of-olympus.jpg'),
    -- Sweet Bonanza
    (collective_wins_provider_id, 'sweet-bonanza', 'Sweet Bonanza', 'slots', 96.48, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/sweet-bonanza.jpg'),
    -- Starlight Princess 1000
    (collective_wins_provider_id, 'starlight-princess', 'Starlight Princess 1000', 'slots', 96.55, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/starlight-princess.jpg'),
    -- Legend of Cleopatra
    (collective_wins_provider_id, 'legend-of-cleopatra', 'Legend of Cleopatra', 'slots', 95.05, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/legend-of-cleopatra.jpg'),
    -- Egypt Fire (Hold and Win)
    (collective_wins_provider_id, 'egypt-fire', 'Egypt Fire (Hold and Win)', 'slots', 96.25, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/egypt-fire.jpg'),
    -- Golden Pharaoh Megaways
    (collective_wins_provider_id, 'golden-pharaoh-megaways', 'Golden Pharaoh Megaways', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/golden-pharaoh-megaways.jpg'),
    -- Crystal Fortune Deluxe
    (collective_wins_provider_id, 'crystal-fortune-deluxe', 'Crystal Fortune Deluxe', 'slots', 96.50, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/crystal-fortune-deluxe.jpg'),
    -- Ocean's Treasure Quest
    (collective_wins_provider_id, 'oceans-treasure-quest', 'Ocean''s Treasure Quest', 'slots', 97.10, 'low', 'active', 0.20, 1000.00, true, '/game-tiles/oceans-treasure-quest.jpg'),
    -- Blackjack Royal VIP
    (collective_wins_provider_id, 'blackjack-royal-vip', 'Blackjack Royal VIP', 'table', 99.50, 'low', 'active', 1.00, 5000.00, true, '/game-tiles/blackjack-royal-vip.jpg'),
    -- Dragon's Fire Prosperity
    (collective_wins_provider_id, 'dragons-fire-prosperity', 'Dragon''s Fire Prosperity', 'slots', 96.90, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/dragons-fire-prosperity.jpg'),
    -- Lightning Strike Roulette
    (collective_wins_provider_id, 'lightning-strike-roulette', 'Lightning Strike Roulette', 'live', 97.30, 'medium', 'active', 0.50, 5000.00, true, '/game-tiles/lightning-strike-roulette.jpg'),
    -- Wild West Bounty Hunter
    (collective_wins_provider_id, 'wild-west-bounty-hunter', 'Wild West Bounty Hunter', 'slots', 96.60, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/wild-west-bounty-hunter.jpg'),
    -- Cosmic Gems Cluster
    (collective_wins_provider_id, 'cosmic-gems-cluster', 'Cosmic Gems Cluster', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/cosmic-gems-cluster.jpg'),
    -- Mega Fortune Jackpot King
    (collective_wins_provider_id, 'mega-fortune-jackpot-king', 'Mega Fortune Jackpot King', 'slots', 95.80, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/mega-fortune-jackpot-king.jpg'),
    -- Ancient Aztec Gold
    (collective_wins_provider_id, 'ancient-aztec-gold', 'Ancient Aztec Gold', 'slots', 96.40, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/ancient-aztec-gold.jpg'),
    -- Baccarat Royale Supreme
    (collective_wins_provider_id, 'baccarat-royale-supreme', 'Baccarat Royale Supreme', 'live', 98.90, 'low', 'active', 1.00, 10000.00, true, '/game-tiles/baccarat-royale-supreme.jpg'),
    -- Neon City Nights
    (collective_wins_provider_id, 'neon-city-nights', 'Neon City Nights', 'slots', 96.80, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/neon-city-nights.jpg'),
    -- Viking Conquest Saga
    (collective_wins_provider_id, 'viking-conquest-saga', 'Viking Conquest Saga', 'slots', 97.00, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/viking-conquest-saga.jpg'),
    -- Crash Rocket Multiplier
    (collective_wins_provider_id, 'crash-rocket-multiplier', 'Crash Rocket Multiplier', 'crash', 97.50, 'high', 'active', 0.10, 1000.00, true, '/game-tiles/crash-rocket-multiplier.jpg'),
    -- Diamond Dynasty Deluxe
    (collective_wins_provider_id, 'diamond-dynasty-deluxe', 'Diamond Dynasty Deluxe', 'slots', 96.50, 'low', 'active', 0.20, 1000.00, true, '/game-tiles/diamond-dynasty-deluxe.jpg'),
    -- Egyptian Mysteries Unlimited
    (collective_wins_provider_id, 'egyptian-mysteries-unlimited', 'Egyptian Mysteries Unlimited', 'slots', 96.90, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/egyptian-mysteries-unlimited.jpg'),
    -- Fruit Blitz Super Spin
    (collective_wins_provider_id, 'fruit-blitz-super-spin', 'Fruit Blitz Super Spin', 'slots', 97.20, 'low', 'active', 0.20, 1000.00, true, '/game-tiles/fruit-blitz-super-spin.jpg'),
    -- Pirate's Plunder Megaways
    (collective_wins_provider_id, 'pirates-plunder-megaways', 'Pirate''s Plunder Megaways', 'slots', 96.60, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/pirates-plunder-megaways.jpg'),
    -- Starburst Crystal Classic
    (collective_wins_provider_id, 'starburst-crystal-classic', 'Starburst Crystal Classic', 'slots', 96.30, 'low', 'active', 0.20, 1000.00, true, '/game-tiles/starburst-crystal-classic.jpg'),
    -- Buffalo Thunder Lightning
    (collective_wins_provider_id, 'buffalo-thunder-lightning', 'Buffalo Thunder Lightning', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/buffalo-thunder-lightning.jpg'),
    -- Zeus Power Reels
    (collective_wins_provider_id, 'zeus-power-reels', 'Zeus Power Reels', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/zeus-power-reels.jpg'),
    -- Sugar Rush Candy Blitz
    (collective_wins_provider_id, 'sugar-rush-candy-blitz', 'Sugar Rush Candy Blitz', 'slots', 96.40, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/sugar-rush-candy-blitz.jpg'),
    -- Moon Princess Trinity
    (collective_wins_provider_id, 'moon-princess-trinity', 'Moon Princess Trinity', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/moon-princess-trinity.jpg'),
    -- Roulette Pro European
    (collective_wins_provider_id, 'roulette-pro-european', 'Roulette Pro European', 'table', 97.30, 'low', 'active', 0.50, 5000.00, true, '/game-tiles/roulette-pro-european.jpg'),
    -- Aztec Bonanza Infinity
    (collective_wins_provider_id, 'aztec-bonanza-infinity', 'Aztec Bonanza Infinity', 'slots', 96.60, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/aztec-bonanza-infinity.jpg'),
    -- Mega Moolah Fortune
    (collective_wins_provider_id, 'mega-moolah-fortune', 'Mega Moolah Fortune', 'slots', 95.90, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/mega-moolah-fortune.jpg'),
    -- Dead or Alive Outlaw
    (collective_wins_provider_id, 'dead-or-alive-outlaw', 'Dead or Alive Outlaw', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/dead-or-alive-outlaw.jpg'),
    -- Jammin' Jars Cluster Party
    (collective_wins_provider_id, 'jammin-jars-cluster-party', 'Jammin'' Jars Cluster Party', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/jammin-jars-cluster-party.jpg'),
    -- Book of Secrets Deluxe
    (collective_wins_provider_id, 'book-of-secrets-deluxe', 'Book of Secrets Deluxe', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/book-of-secrets-deluxe.jpg'),
    -- Gonzo's Quest Megaways
    (collective_wins_provider_id, 'gonzos-quest-megaways', 'Gonzo''s Quest Megaways', 'slots', 96.00, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/gonzos-quest-megaways.jpg'),
    -- Bonanza Goldmine Megaways
    (collective_wins_provider_id, 'bonanza-goldmine-megaways', 'Bonanza Goldmine Megaways', 'slots', 96.40, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/bonanza-goldmine-megaways.jpg'),
    -- Legacy of Egypt Power
    (collective_wins_provider_id, 'legacy-of-egypt-power', 'Legacy of Egypt Power', 'slots', 96.50, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/legacy-of-egypt-power.jpg'),
    -- Immortal Romance Remastered
    (collective_wins_provider_id, 'immortal-romance-remastered', 'Immortal Romance Remastered', 'slots', 96.90, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/immortal-romance-remastered.jpg'),
    -- Fire Joker Respin
    (collective_wins_provider_id, 'fire-joker-respin', 'Fire Joker Respin', 'slots', 96.20, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/fire-joker-respin.jpg'),
    -- Reactoonz Quantum Leap
    (collective_wins_provider_id, 'reactoonz-quantum-leap', 'Reactoonz Quantum Leap', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/reactoonz-quantum-leap.jpg'),
    -- Street Racer Nitro
    (collective_wins_provider_id, 'street-racer-nitro', 'Street Racer Nitro', 'slots', 96.60, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/street-racer-nitro.jpg'),
    -- Tiki Fortune Totem
    (collective_wins_provider_id, 'tiki-fortune-totem', 'Tiki Fortune Totem', 'slots', 96.30, 'low', 'active', 0.20, 1000.00, true, '/game-tiles/tiki-fortune-totem.jpg'),
    -- Tomb Raider Expedition
    (collective_wins_provider_id, 'tomb-raider-expedition', 'Tomb Raider Expedition', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/tomb-raider-expedition.jpg'),
    -- Space Invaders Arcade
    (collective_wins_provider_id, 'space-invaders-arcade', 'Space Invaders Arcade', 'slots', 96.10, 'low', 'active', 0.20, 1000.00, true, '/game-tiles/space-invaders-arcade.jpg'),
    -- Rainbow Riches Megaways
    (collective_wins_provider_id, 'rainbow-riches-megaways', 'Rainbow Riches Megaways', 'slots', 96.50, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/rainbow-riches-megaways.jpg'),
    -- Wolf Gold Moon Spin
    (collective_wins_provider_id, 'wolf-gold-moon-spin', 'Wolf Gold Moon Spin', 'slots', 96.00, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/wolf-gold-moon-spin.jpg'),
    -- Poker Face Texas Hold'em
    (collective_wins_provider_id, 'poker-face-texas-holdem', 'Poker Face Texas Hold''em', 'table', 99.00, 'medium', 'active', 1.00, 5000.00, true, '/game-tiles/poker-face-texas-holdem.jpg'),
    -- Jungle Adventure Expedition
    (collective_wins_provider_id, 'jungle-adventure-expedition', 'Jungle Adventure Expedition', 'slots', 96.40, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/jungle-adventure-expedition.jpg'),
    -- Mega Ball Live
    (collective_wins_provider_id, 'mega-ball-live', 'Mega Ball Live', 'live', 95.40, 'medium', 'active', 0.10, 1000.00, true, '/game-tiles/mega-ball-live.jpg'),
    -- Gladiator Arena Champion
    (collective_wins_provider_id, 'gladiator-arena-champion', 'Gladiator Arena Champion', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/gladiator-arena-champion.jpg'),
    -- Fortune Tiger Prosperity
    (collective_wins_provider_id, 'fortune-tiger-prosperity', 'Fortune Tiger Prosperity', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, true, '/game-tiles/fortune-tiger-prosperity.jpg'),
    -- Fishing Frenzy Megaways
    (collective_wins_provider_id, 'fishing-frenzy-megaways', 'Fishing Frenzy Megaways', 'slots', 96.10, 'high', 'active', 0.20, 1000.00, true, '/game-tiles/fishing-frenzy-megaways.jpg')
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
    thumbnail_url = EXCLUDED.thumbnail_url,
    updated_at = now();
END $$;

-- =====================================================
-- ADMIN USERS TABLE FOR MASTER MODE
-- =====================================================

-- Create admin_users table to track owner/admin accounts
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  is_master BOOLEAN NOT NULL DEFAULT false,
  hardware_id TEXT, -- Optional hardware ID for master identification
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Only admins can view admin_users
CREATE POLICY "Admins can view admin users"
  ON public.admin_users FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can manage admin users
CREATE POLICY "Admins can manage admin users"
  ON public.admin_users FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_master ON public.admin_users(is_master) WHERE is_master = true;

-- =====================================================
-- BONUS SYSTEM FOR $111 SIGN-UP BONUS
-- =====================================================

-- Create user_bonuses table to track bonuses
CREATE TABLE IF NOT EXISTS public.user_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bonus_type TEXT NOT NULL DEFAULT 'sign_up', -- 'sign_up', 'deposit', 'loyalty', etc.
  bonus_amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'AUD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'claimed', 'expired', 'cancelled')),
  wagering_requirement NUMERIC(12,2) DEFAULT 0, -- Amount that must be wagered before withdrawal
  wagered_amount NUMERIC(12,2) DEFAULT 0, -- Amount already wagered
  expires_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_bonuses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own bonuses"
  ON public.user_bonuses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim their own bonuses"
  ON public.user_bonuses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can create bonuses for users"
  ON public.user_bonuses FOR INSERT
  WITH CHECK (true); -- Edge functions can create bonuses

CREATE POLICY "Admins can manage all bonuses"
  ON public.user_bonuses FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger
CREATE TRIGGER update_user_bonuses_updated_at
  BEFORE UPDATE ON public.user_bonuses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_bonuses_user_id ON public.user_bonuses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bonuses_status ON public.user_bonuses(status);
CREATE INDEX IF NOT EXISTS idx_user_bonuses_expires_at ON public.user_bonuses(expires_at) WHERE expires_at IS NOT NULL;

-- Create function to auto-award $111 sign-up bonus
CREATE OR REPLACE FUNCTION public.award_signup_bonus(new_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  bonus_id UUID;
BEGIN
  -- Check if user already has a sign-up bonus
  IF EXISTS (
    SELECT 1 FROM public.user_bonuses 
    WHERE user_id = new_user_id AND bonus_type = 'sign_up'
  ) THEN
    RETURN NULL;
  END IF;

  -- Insert $111 sign-up bonus
  INSERT INTO public.user_bonuses (
    user_id,
    bonus_type,
    bonus_amount,
    currency,
    status,
    wagering_requirement,
    expires_at
  ) VALUES (
    new_user_id,
    'sign_up',
    111.00,
    'AUD',
    'active',
    0.00, -- No wagering requirement for demo credits
    now() + INTERVAL '30 days' -- Expires in 30 days
  )
  RETURNING id INTO bonus_id;

  RETURN bonus_id;
END;
$$;

-- Create trigger to auto-award bonus on user creation
-- Note: This requires a users table trigger, which may already exist
-- If not, we'll handle it in the edge function instead

-- =====================================================
-- PROVABLY FAIR VERIFICATION SYSTEM
-- =====================================================

-- Create provably_fair_verification table to store seeds and outcomes
CREATE TABLE IF NOT EXISTS public.provably_fair_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.demo_sessions(id) ON DELETE CASCADE,
  spin_id TEXT NOT NULL,
  game_id TEXT NOT NULL,
  server_seed TEXT NOT NULL, -- Private server seed (hashed)
  client_seed TEXT, -- Public client seed (optional, from user)
  nonce INTEGER NOT NULL, -- Spin index/nonce
  outcome_hash TEXT NOT NULL, -- HMAC-SHA256 hash of outcome
  outcome_json JSONB NOT NULL, -- Full outcome for verification
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.provably_fair_verification ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own verification records"
  ON public.provably_fair_verification FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create verification records"
  ON public.provably_fair_verification FOR INSERT
  WITH CHECK (true); -- Edge functions can create records

CREATE POLICY "Admins can view all verification records"
  ON public.provably_fair_verification FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_provably_fair_user_id ON public.provably_fair_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_provably_fair_session_id ON public.provably_fair_verification(session_id);
CREATE INDEX IF NOT EXISTS idx_provably_fair_spin_id ON public.provably_fair_verification(spin_id);
CREATE INDEX IF NOT EXISTS idx_provably_fair_created_at ON public.provably_fair_verification(created_at);

-- =====================================================
-- USER TIERS SYSTEM FOR WITHDRAWAL REQUIREMENTS
-- =====================================================

-- Create user_tiers table
CREATE TABLE IF NOT EXISTS public.user_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  lifetime_deposits NUMERIC(12,2) DEFAULT 0,
  lifetime_wagered NUMERIC(12,2) DEFAULT 0,
  can_withdraw BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_tiers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own tier"
  ON public.user_tiers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can update user tiers"
  ON public.user_tiers FOR UPDATE
  USING (true); -- Edge functions can update

CREATE POLICY "System can create user tiers"
  ON public.user_tiers FOR INSERT
  WITH CHECK (true); -- Edge functions can create

CREATE POLICY "Admins can manage all tiers"
  ON public.user_tiers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger
CREATE TRIGGER update_user_tiers_updated_at
  BEFORE UPDATE ON public.user_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_tiers_user_id ON public.user_tiers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tiers_tier ON public.user_tiers(tier);

-- Create function to update tier based on deposits
CREATE OR REPLACE FUNCTION public.update_user_tier(p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deposits NUMERIC(12,2);
  v_tier TEXT;
  v_can_withdraw BOOLEAN;
BEGIN
  -- Get lifetime deposits (would need to be calculated from transactions)
  -- For now, we'll use a placeholder
  SELECT COALESCE(lifetime_deposits, 0) INTO v_deposits
  FROM public.user_tiers
  WHERE user_id = p_user_id;

  -- Determine tier based on deposits
  IF v_deposits >= 5000 THEN
    v_tier := 'platinum';
    v_can_withdraw := true;
  ELSIF v_deposits >= 500 THEN
    v_tier := 'gold';
    v_can_withdraw := true;
  ELSIF v_deposits >= 30 THEN
    v_tier := 'silver';
    v_can_withdraw := true;
  ELSE
    v_tier := 'bronze';
    v_can_withdraw := false;
  END IF;

  -- Insert or update tier
  INSERT INTO public.user_tiers (user_id, tier, lifetime_deposits, can_withdraw)
  VALUES (p_user_id, v_tier, v_deposits, v_can_withdraw)
  ON CONFLICT (user_id) DO UPDATE
  SET
    tier = v_tier,
    lifetime_deposits = v_deposits,
    can_withdraw = v_can_withdraw,
    updated_at = now();

  RETURN v_tier;
END;
$$;

-- =====================================================
-- RATE LIMITING SYSTEM
-- =====================================================

-- Create rate_limit_logs table
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'spin', 'deposit', 'withdrawal', etc.
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "System can create rate limit logs"
  ON public.rate_limit_logs FOR INSERT
  WITH CHECK (true); -- Edge functions can create

CREATE POLICY "Admins can view rate limit logs"
  ON public.rate_limit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limit_user_action ON public.rate_limit_logs(user_id, action_type, created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_action ON public.rate_limit_logs(ip_address, action_type, created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_created_at ON public.rate_limit_logs(created_at);

-- Create function to check rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_action_type TEXT,
  p_max_actions INTEGER DEFAULT 60,
  p_window_seconds INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Count actions in the time window
  SELECT COUNT(*) INTO v_count
  FROM public.rate_limit_logs
  WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND created_at > now() - (p_window_seconds || ' seconds')::INTERVAL;

  -- Return true if under limit, false if over limit
  RETURN v_count < p_max_actions;
END;
$$;

-- Create function to log rate limit action
CREATE OR REPLACE FUNCTION public.log_rate_limit_action(
  p_user_id UUID,
  p_action_type TEXT,
  p_ip_address INET DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.rate_limit_logs (user_id, action_type, ip_address)
  VALUES (p_user_id, p_action_type, p_ip_address)
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$;

