# 🚀 COPY & PASTE SQL DEPLOYMENT GUIDE

## 📋 Step-by-Step Instructions

### STEP 1: Main Database Migration

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Click **SQL Editor** in the left sidebar

2. **Copy the entire file below** (`REAL_MONEY_COMPLETE_MIGRATION.sql`)
   - Click "New Query"
   - Paste the entire SQL content
   - Click **Run** (or press `Ctrl+Enter`)
   - Wait for "Success" message

---

## 📄 FILE 1: REAL_MONEY_COMPLETE_MIGRATION.sql

**Copy everything below this line:**

```sql
-- =====================================================
-- COLLECTIVE-WINS REAL MONEY COMPLETE MIGRATION
-- Run this entire file in Supabase SQL Editor
-- REAL MONEY CASINO - NO DEMO MODE
-- All games configured for real money transactions (AUD)
-- $111 Welcome Bonus is the psychological hook for new players
-- =====================================================

-- =====================================================
-- MIGRATION 0: CREATE CORE TABLES FIRST
-- =====================================================

-- Create public.users table if it doesn't exist (extends auth.users)
-- This matches the existing migration structure
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  referral_code TEXT UNIQUE,
  total_balance_aud NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
  bonus_balance NUMERIC(12,2) DEFAULT 0.00 NOT NULL,
  is_kyc_verified BOOLEAN DEFAULT false NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create trigger function to auto-create public.users when auth.users is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  generated_referral_code TEXT;
BEGIN
  -- Generate a unique 8-character referral code
  generated_referral_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
  
  -- Insert into users table
  INSERT INTO public.users (id, display_name, referral_code, total_balance_aud, bonus_balance)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email, 'User'),
    generated_referral_code,
    0.00,
    0.00
  );
  RETURN NEW;
END;
$$;

-- Create trigger to execute function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create game_providers table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.game_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  license_jurisdiction TEXT,
  rng_certification TEXT,
  integration_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create licensed_games table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.licensed_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.game_providers(id) ON DELETE CASCADE,
  game_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  rtp_certified NUMERIC(5,2),
  volatility TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  min_bet_aud NUMERIC(12,2) NOT NULL DEFAULT 0.20,
  max_bet_aud NUMERIC(12,2) NOT NULL DEFAULT 1000.00,
  is_demo_available BOOLEAN DEFAULT false, -- Legacy field, always false for real money
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_game_providers_code ON public.game_providers(code);
CREATE INDEX IF NOT EXISTS idx_licensed_games_game_code ON public.licensed_games(game_code);
CREATE INDEX IF NOT EXISTS idx_licensed_games_provider_id ON public.licensed_games(provider_id);

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create has_role function if it doesn't exist (for RLS policies)
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Simple implementation - can be enhanced later
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = has_role.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MIGRATION 1: POPULATE CUSTOM GAMES (REAL MONEY)
-- =====================================================

-- 1. Add "Collective Wins" as a provider for our custom games
INSERT INTO public.game_providers (name, code, status, license_jurisdiction, rng_certification, integration_type)
VALUES 
  ('Collective Wins', 'collective-wins', 'active', 'Internal RNG', 'Provably Fair System', 'direct')
ON CONFLICT (code) DO UPDATE
SET 
  status = 'active',
  updated_at = now();

-- Insert games using subquery for provider_id
-- Note: thumbnail_url will be set via UPDATE after INSERT
INSERT INTO public.licensed_games (
  provider_id, game_code, name, category, rtp_certified, volatility, status,
  min_bet_aud, max_bet_aud, is_demo_available, thumbnail_url
) VALUES
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'big-bass-splash', 'Big Bass Splash', 'slots', 96.71, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'gates-of-olympus', 'Gates of Olympus', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'sweet-bonanza', 'Sweet Bonanza', 'slots', 96.48, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'starlight-princess', 'Starlight Princess 1000', 'slots', 96.55, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'legend-of-cleopatra', 'Legend of Cleopatra', 'slots', 95.05, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'egypt-fire', 'Egypt Fire (Hold and Win)', 'slots', 96.25, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'golden-pharaoh-megaways', 'Golden Pharaoh Megaways', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'crystal-fortune-deluxe', 'Crystal Fortune Deluxe', 'slots', 96.50, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'oceans-treasure-quest', 'Ocean''s Treasure Quest', 'slots', 97.10, 'low', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'blackjack-royal-vip', 'Blackjack Royal VIP', 'table', 99.50, 'low', 'active', 1.00, 5000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'dragons-fire-prosperity', 'Dragon''s Fire Prosperity', 'slots', 96.90, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'lightning-strike-roulette', 'Lightning Strike Roulette', 'live', 97.30, 'medium', 'active', 0.50, 5000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'wild-west-bounty-hunter', 'Wild West Bounty Hunter', 'slots', 96.60, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'cosmic-gems-cluster', 'Cosmic Gems Cluster', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'mega-fortune-jackpot-king', 'Mega Fortune Jackpot King', 'slots', 95.80, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'ancient-aztec-gold', 'Ancient Aztec Gold', 'slots', 96.40, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'baccarat-royale-supreme', 'Baccarat Royale Supreme', 'live', 98.90, 'low', 'active', 1.00, 10000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'neon-city-nights', 'Neon City Nights', 'slots', 96.80, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'viking-conquest-saga', 'Viking Conquest Saga', 'slots', 97.00, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'crash-rocket-multiplier', 'Crash Rocket Multiplier', 'crash', 97.50, 'high', 'active', 0.10, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'diamond-dynasty-deluxe', 'Diamond Dynasty Deluxe', 'slots', 96.50, 'low', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'egyptian-mysteries-unlimited', 'Egyptian Mysteries Unlimited', 'slots', 96.90, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'fruit-blitz-super-spin', 'Fruit Blitz Super Spin', 'slots', 97.20, 'low', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'pirates-plunder-megaways', 'Pirate''s Plunder Megaways', 'slots', 96.60, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'starburst-crystal-classic', 'Starburst Crystal Classic', 'slots', 96.30, 'low', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'buffalo-thunder-lightning', 'Buffalo Thunder Lightning', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'zeus-power-reels', 'Zeus Power Reels', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'sugar-rush-candy-blitz', 'Sugar Rush Candy Blitz', 'slots', 96.40, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'moon-princess-trinity', 'Moon Princess Trinity', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'roulette-pro-european', 'Roulette Pro European', 'table', 97.30, 'low', 'active', 0.50, 5000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'aztec-bonanza-infinity', 'Aztec Bonanza Infinity', 'slots', 96.60, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'mega-moolah-fortune', 'Mega Moolah Fortune', 'slots', 95.90, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'dead-or-alive-outlaw', 'Dead or Alive Outlaw', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'jammin-jars-cluster-party', 'Jammin'' Jars Cluster Party', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'book-of-secrets-deluxe', 'Book of Secrets Deluxe', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'gonzos-quest-megaways', 'Gonzo''s Quest Megaways', 'slots', 96.00, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'bonanza-goldmine-megaways', 'Bonanza Goldmine Megaways', 'slots', 96.40, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'legacy-of-egypt-power', 'Legacy of Egypt Power', 'slots', 96.50, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'immortal-romance-remastered', 'Immortal Romance Remastered', 'slots', 96.90, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'fire-joker-respin', 'Fire Joker Respin', 'slots', 96.20, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'reactoonz-quantum-leap', 'Reactoonz Quantum Leap', 'slots', 96.50, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'street-racer-nitro', 'Street Racer Nitro', 'slots', 96.60, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'tiki-fortune-totem', 'Tiki Fortune Totem', 'slots', 96.30, 'low', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'tomb-raider-expedition', 'Tomb Raider Expedition', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'space-invaders-arcade', 'Space Invaders Arcade', 'slots', 96.10, 'low', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'rainbow-riches-megaways', 'Rainbow Riches Megaways', 'slots', 96.50, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'wolf-gold-moon-spin', 'Wolf Gold Moon Spin', 'slots', 96.00, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'poker-face-texas-holdem', 'Poker Face Texas Hold''em', 'table', 99.00, 'medium', 'active', 1.00, 5000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'jungle-adventure-expedition', 'Jungle Adventure Expedition', 'slots', 96.40, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'mega-ball-live', 'Mega Ball Live', 'live', 95.40, 'medium', 'active', 0.10, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'gladiator-arena-champion', 'Gladiator Arena Champion', 'slots', 96.80, 'high', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'fortune-tiger-prosperity', 'Fortune Tiger Prosperity', 'slots', 96.70, 'medium', 'active', 0.20, 1000.00, false, NULL),
  ((SELECT id FROM public.game_providers WHERE code = 'collective-wins'), 'fishing-frenzy-megaways', 'Fishing Frenzy Megaways', 'slots', 96.10, 'high', 'active', 0.20, 1000.00, false, NULL)
ON CONFLICT (game_code) DO UPDATE
  SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    rtp_certified = EXCLUDED.rtp_certified,
    volatility = EXCLUDED.volatility,
    status = EXCLUDED.status,
    min_bet_aud = EXCLUDED.min_bet_aud,
    max_bet_aud = EXCLUDED.max_bet_aud,
    is_demo_available = false; -- Real money only - no demo mode

-- =====================================================
-- MIGRATION 2: ADMIN USERS TABLE FOR MASTER MODE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  is_master BOOLEAN NOT NULL DEFAULT false,
  hardware_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
CREATE POLICY "Admins can view admin users"
  ON public.admin_users FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage admin users" ON public.admin_users;
CREATE POLICY "Admins can manage admin users"
  ON public.admin_users FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_master ON public.admin_users(is_master) WHERE is_master = true;

-- =====================================================
-- MIGRATION 2.5: CREATE GAME SPINS TABLE (REAL MONEY)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.game_spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  spin_index INTEGER NOT NULL,
  wager NUMERIC(12,2) NOT NULL,
  outcome_json JSONB NOT NULL,
  win_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  rng_seed TEXT NOT NULL,
  balance_before NUMERIC(12,2) NOT NULL,
  balance_after NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.game_spins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own spins" ON public.game_spins;
CREATE POLICY "Users can view their own spins"
  ON public.game_spins FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create spins" ON public.game_spins;
CREATE POLICY "System can create spins"
  ON public.game_spins FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_game_spins_user_id ON public.game_spins(user_id);
CREATE INDEX IF NOT EXISTS idx_game_spins_game_id ON public.game_spins(game_id);
CREATE INDEX IF NOT EXISTS idx_game_spins_created_at ON public.game_spins(created_at);

-- =====================================================
-- MIGRATION 3: BONUS SYSTEM FOR $111 SIGN-UP BONUS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_bonuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bonus_type TEXT NOT NULL DEFAULT 'sign_up',
  bonus_amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'AUD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'claimed', 'expired', 'cancelled')),
  wagering_requirement NUMERIC(12,2) DEFAULT 0,
  wagered_amount NUMERIC(12,2) DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_bonuses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own bonuses" ON public.user_bonuses;
CREATE POLICY "Users can view their own bonuses"
  ON public.user_bonuses FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can claim their own bonuses" ON public.user_bonuses;
CREATE POLICY "Users can claim their own bonuses"
  ON public.user_bonuses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create bonuses for users" ON public.user_bonuses;
CREATE POLICY "System can create bonuses for users"
  ON public.user_bonuses FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage all bonuses" ON public.user_bonuses;
CREATE POLICY "Admins can manage all bonuses"
  ON public.user_bonuses FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_user_bonuses_updated_at ON public.user_bonuses;
CREATE TRIGGER update_user_bonuses_updated_at
  BEFORE UPDATE ON public.user_bonuses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_user_bonuses_user_id ON public.user_bonuses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bonuses_status ON public.user_bonuses(status);
CREATE INDEX IF NOT EXISTS idx_user_bonuses_expires_at ON public.user_bonuses(expires_at) WHERE expires_at IS NOT NULL;

DROP FUNCTION IF EXISTS public.award_signup_bonus(UUID);
CREATE OR REPLACE FUNCTION public.award_signup_bonus(new_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  bonus_id UUID;
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.user_bonuses 
    WHERE user_id = new_user_id AND bonus_type = 'sign_up'
  ) THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.user_bonuses (
    user_id, bonus_type, bonus_amount, currency, status,
    wagering_requirement, expires_at
  ) VALUES (
    new_user_id, 'sign_up', 111.00, 'AUD', 'active',
    3885.00, now() + INTERVAL '30 days' -- 35x wagering requirement
  )
  RETURNING id INTO bonus_id;

  RETURN bonus_id;
END;
$$;

-- =====================================================
-- MIGRATION 4: PROVABLY FAIR VERIFICATION SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS public.provably_fair_verification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  spin_id UUID REFERENCES public.game_spins(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  server_seed TEXT NOT NULL,
  client_seed TEXT,
  nonce INTEGER NOT NULL,
  outcome_hash TEXT NOT NULL,
  outcome_json JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.provably_fair_verification ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own verification records" ON public.provably_fair_verification;
CREATE POLICY "Users can view their own verification records"
  ON public.provably_fair_verification FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create verification records" ON public.provably_fair_verification;
CREATE POLICY "System can create verification records"
  ON public.provably_fair_verification FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all verification records" ON public.provably_fair_verification;
CREATE POLICY "Admins can view all verification records"
  ON public.provably_fair_verification FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_provably_fair_user_id ON public.provably_fair_verification(user_id);
CREATE INDEX IF NOT EXISTS idx_provably_fair_spin_id_ref ON public.provably_fair_verification(spin_id);
CREATE INDEX IF NOT EXISTS idx_provably_fair_spin_id ON public.provably_fair_verification(spin_id) WHERE spin_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_provably_fair_created_at ON public.provably_fair_verification(created_at);

-- =====================================================
-- MIGRATION 5: USER TIERS SYSTEM
-- =====================================================

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

ALTER TABLE public.user_tiers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own tier" ON public.user_tiers;
CREATE POLICY "Users can view their own tier"
  ON public.user_tiers FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can update user tiers" ON public.user_tiers;
CREATE POLICY "System can update user tiers"
  ON public.user_tiers FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "System can create user tiers" ON public.user_tiers;
CREATE POLICY "System can create user tiers"
  ON public.user_tiers FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage all tiers" ON public.user_tiers;
CREATE POLICY "Admins can manage all tiers"
  ON public.user_tiers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS update_user_tiers_updated_at ON public.user_tiers;
CREATE TRIGGER update_user_tiers_updated_at
  BEFORE UPDATE ON public.user_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_user_tiers_user_id ON public.user_tiers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tiers_tier ON public.user_tiers(tier);

DROP FUNCTION IF EXISTS public.update_user_tier(UUID);
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
  SELECT COALESCE(lifetime_deposits, 0) INTO v_deposits
  FROM public.user_tiers
  WHERE user_id = p_user_id;

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
-- MIGRATION 6: RATE LIMITING SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System can create rate limit logs" ON public.rate_limit_logs;
CREATE POLICY "System can create rate limit logs"
  ON public.rate_limit_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view rate limit logs" ON public.rate_limit_logs;
CREATE POLICY "Admins can view rate limit logs"
  ON public.rate_limit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_rate_limit_user_action ON public.rate_limit_logs(user_id, action_type, created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_action ON public.rate_limit_logs(ip_address, action_type, created_at);
CREATE INDEX IF NOT EXISTS idx_rate_limit_created_at ON public.rate_limit_logs(created_at);

DROP FUNCTION IF EXISTS public.check_rate_limit(UUID, TEXT, INTEGER, INTEGER);
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
  SELECT COUNT(*) INTO v_count
  FROM public.rate_limit_logs
  WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND created_at > now() - (p_window_seconds || ' seconds')::INTERVAL;

  RETURN v_count < p_max_actions;
END;
$$;

DROP FUNCTION IF EXISTS public.log_rate_limit_action(UUID, TEXT, INET);
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

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
```

**✅ After running, you should see "Success" message**

---

### STEP 2: Update Game Images

1. **In Supabase SQL Editor**, click **New Query**
2. **Copy the entire file below** (`UPDATE_GAME_THUMBNAILS.sql`)
3. **Paste and Run**

---

## 📄 FILE 2: UPDATE_GAME_THUMBNAILS.sql

**Copy everything below this line:**

```sql
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
```

**✅ After running, you should see 10 games with thumbnail URLs**

---

## ✅ Verification

After running both SQL files, verify everything worked:

```sql
-- Check games are loaded
SELECT COUNT(*) as total_games FROM public.licensed_games;
-- Should return: 50

-- Check games have images
SELECT COUNT(*) as games_with_images 
FROM public.licensed_games 
WHERE thumbnail_url IS NOT NULL;
-- Should return: 50

-- Check provider exists
SELECT * FROM public.game_providers WHERE code = 'collective-wins';
-- Should return: 1 row
```

---

## 🎯 Next Steps After SQL

1. ✅ SQL migrations complete
2. ⏭️ Deploy Edge Functions (`spin` and `claim-bonus`)
3. ⏭️ Trigger Vercel rebuild
4. ⏭️ Test live site

---

**Ready to deploy!** 🚀

