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

