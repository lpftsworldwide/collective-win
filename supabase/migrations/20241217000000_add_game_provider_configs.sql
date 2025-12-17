-- =====================================================
-- GAME PROVIDER CONFIGURATIONS TABLE
-- Stores API credentials for aggregators (SoftGamings, etc.)
-- =====================================================

-- Create game_provider_configs table
CREATE TABLE IF NOT EXISTS public.game_provider_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.game_providers(id) ON DELETE CASCADE,
  
  -- Aggregator information
  aggregator_name TEXT, -- 'softgamings', 'betconstruct', etc.
  aggregator_api_endpoint TEXT, -- API base URL
  aggregator_api_key TEXT NOT NULL, -- API key from aggregator
  aggregator_secret_key TEXT NOT NULL, -- Secret key from aggregator
  merchant_id TEXT, -- Merchant/account ID if required
  
  -- Provider-specific license key (if direct integration)
  provider_license_key TEXT,
  
  -- Game launch configuration
  iframe_base_url TEXT, -- Base URL for game iframes
  launch_url_template TEXT, -- URL template for game launches
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'testing')),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one active config per provider
  CONSTRAINT unique_active_provider_config UNIQUE (provider_id, status) 
    DEFERRABLE INITIALLY DEFERRED
);

-- Enable RLS
ALTER TABLE public.game_provider_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage provider configs"
  ON public.game_provider_configs FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- No public read access (sensitive API keys)
CREATE POLICY "No public access to provider configs"
  ON public.game_provider_configs FOR SELECT
  USING (false); -- Only admins can view (via admin policy above)

-- Update trigger
CREATE TRIGGER update_game_provider_configs_updated_at
  BEFORE UPDATE ON public.game_provider_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add SoftGamings provider if not exists
INSERT INTO public.game_providers (name, code, status, license_jurisdiction, rng_certification, integration_type, api_endpoint)
VALUES 
  ('SoftGamings', 'softgamings', 'pending_integration', 'MGA, Curacao', 'GLI, eCOGRA', 'aggregator', 'https://api.softgamings.com/v1')
ON CONFLICT (code) DO UPDATE
SET 
  integration_type = 'aggregator',
  api_endpoint = 'https://api.softgamings.com/v1';

-- Add JILI provider (via SoftGamings)
INSERT INTO public.game_providers (name, code, status, license_jurisdiction, rng_certification, integration_type)
VALUES 
  ('JILI', 'jili', 'pending_integration', 'Curacao', 'GLI', 'aggregator')
ON CONFLICT (code) DO NOTHING;

-- Add Boomberg provider (via SoftGamings)
INSERT INTO public.game_providers (name, code, status, license_jurisdiction, rng_certification, integration_type)
VALUES 
  ('Boomberg', 'boomberg', 'pending_integration', 'Curacao', 'GLI', 'aggregator')
ON CONFLICT (code) DO NOTHING;

-- Create game_sessions table if not exists (for tracking game plays)
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL, -- Game code
  provider_session_id TEXT, -- Session ID from aggregator
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  total_wagered NUMERIC(12,2) DEFAULT 0,
  total_won NUMERIC(12,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on game_sessions
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_sessions
CREATE POLICY "Users can view their own game sessions"
  ON public.game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own game sessions"
  ON public.game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all game sessions"
  ON public.game_sessions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create game_transactions table if not exists
CREATE TABLE IF NOT EXISTS public.game_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  session_id UUID REFERENCES public.game_sessions(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('bet', 'win', 'refund')),
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'AUD',
  provider_transaction_id TEXT, -- Transaction ID from aggregator
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on game_transactions
ALTER TABLE public.game_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_transactions
CREATE POLICY "Users can view their own game transactions"
  ON public.game_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all game transactions"
  ON public.game_transactions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger for game_sessions
CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON public.game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

