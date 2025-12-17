-- =====================================================
-- COMPLIANT iGAMING PLATFORM - KYC & PROVIDER TABLES
-- =====================================================

-- 1. KYC VERIFICATION STATUS ENUM
CREATE TYPE public.kyc_status AS ENUM ('pending', 'submitted', 'under_review', 'approved', 'rejected', 'expired');

-- 2. DOCUMENT TYPE ENUM
CREATE TYPE public.kyc_document_type AS ENUM ('passport', 'drivers_license', 'national_id', 'proof_of_address', 'bank_statement', 'selfie');

-- 3. PROVIDER STATUS ENUM
CREATE TYPE public.provider_status AS ENUM ('active', 'inactive', 'pending_integration', 'suspended');

-- 4. GAME STATUS ENUM  
CREATE TYPE public.game_status AS ENUM ('active', 'demo_only', 'coming_soon', 'disabled');

-- 5. KYC VERIFICATION RECORDS TABLE
CREATE TABLE public.kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status kyc_status NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  rejection_reason TEXT,
  verification_provider TEXT, -- e.g., 'onfido', 'jumio', 'manual'
  provider_reference TEXT, -- External verification ID
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_kyc UNIQUE (user_id)
);

-- 6. KYC DOCUMENTS TABLE
CREATE TABLE public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID NOT NULL REFERENCES public.kyc_verifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_type kyc_document_type NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size_bytes INTEGER,
  mime_type TEXT,
  status kyc_status NOT NULL DEFAULT 'submitted',
  rejection_reason TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- 7. GAME PROVIDERS TABLE (For licensed provider integration)
CREATE TABLE public.game_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE, -- e.g., 'pragmatic', 'evolution', 'netent'
  status provider_status NOT NULL DEFAULT 'pending_integration',
  license_info TEXT,
  license_jurisdiction TEXT, -- e.g., 'MGA', 'UKGC', 'Curacao'
  api_endpoint TEXT,
  integration_type TEXT, -- 'aggregator' or 'direct'
  rng_certification TEXT, -- e.g., 'GLI', 'eCOGRA', 'iTech Labs'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. LICENSED GAMES CATALOG TABLE
CREATE TABLE public.licensed_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.game_providers(id),
  game_code TEXT NOT NULL UNIQUE, -- Provider's game identifier
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'slot', 'live', 'table', 'crash'
  rtp_certified NUMERIC(5,2), -- Certified RTP percentage
  volatility TEXT,
  status game_status NOT NULL DEFAULT 'coming_soon',
  thumbnail_url TEXT,
  launch_url_template TEXT, -- URL template for game launch
  min_bet_aud NUMERIC(10,2) DEFAULT 0.20,
  max_bet_aud NUMERIC(10,2) DEFAULT 1000.00,
  is_demo_available BOOLEAN DEFAULT true,
  release_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. FAIR PLAY AUDIT LOG
CREATE TABLE public.fairplay_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  game_id TEXT NOT NULL,
  session_id UUID,
  action TEXT NOT NULL, -- 'spin', 'bet', 'win', 'cashout'
  wager_amount NUMERIC(12,2),
  payout_amount NUMERIC(12,2),
  rng_seed_hash TEXT, -- For provable fairness
  outcome_hash TEXT,
  client_ip INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licensed_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fairplay_audit_log ENABLE ROW LEVEL SECURITY;

-- 11. RLS POLICIES FOR KYC VERIFICATIONS
CREATE POLICY "Users can view their own KYC verification"
  ON public.kyc_verifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own KYC verification"
  ON public.kyc_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending KYC"
  ON public.kyc_verifications FOR UPDATE
  USING (auth.uid() = user_id AND status IN ('pending', 'rejected'));

CREATE POLICY "Admins can manage all KYC verifications"
  ON public.kyc_verifications FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 12. RLS POLICIES FOR KYC DOCUMENTS
CREATE POLICY "Users can view their own KYC documents"
  ON public.kyc_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own KYC documents"
  ON public.kyc_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all KYC documents"
  ON public.kyc_documents FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 13. RLS POLICIES FOR GAME PROVIDERS (Public read, admin write)
CREATE POLICY "Anyone can view active providers"
  ON public.game_providers FOR SELECT
  USING (status = 'active');

CREATE POLICY "Admins can manage providers"
  ON public.game_providers FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 14. RLS POLICIES FOR LICENSED GAMES (Public read, admin write)
CREATE POLICY "Anyone can view available games"
  ON public.licensed_games FOR SELECT
  USING (status IN ('active', 'demo_only', 'coming_soon'));

CREATE POLICY "Admins can manage games catalog"
  ON public.licensed_games FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 15. RLS POLICIES FOR FAIRPLAY AUDIT LOG
CREATE POLICY "Users can view their own audit logs"
  ON public.fairplay_audit_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs"
  ON public.fairplay_audit_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- System inserts only (no user insert policy - done via security definer function)

-- 16. UPDATE TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 17. CREATE TRIGGERS FOR UPDATED_AT
CREATE TRIGGER update_kyc_verifications_updated_at
  BEFORE UPDATE ON public.kyc_verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_game_providers_updated_at
  BEFORE UPDATE ON public.game_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_licensed_games_updated_at
  BEFORE UPDATE ON public.licensed_games
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 18. CREATE KYC STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents', 
  'kyc-documents', 
  false, -- Private bucket
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- 19. STORAGE POLICIES FOR KYC DOCUMENTS
CREATE POLICY "Users can upload their own KYC docs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'kyc-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own KYC docs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'kyc-documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all KYC docs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'kyc-documents' AND 
    public.has_role(auth.uid(), 'admin')
  );

-- 20. SEED DEMO PROVIDERS
INSERT INTO public.game_providers (name, code, status, license_jurisdiction, rng_certification, integration_type)
VALUES 
  ('Pragmatic Play', 'pragmatic', 'active', 'MGA, UKGC', 'GLI, eCOGRA', 'aggregator'),
  ('Evolution Gaming', 'evolution', 'active', 'MGA, UKGC', 'GLI', 'aggregator'),
  ('NetEnt', 'netent', 'active', 'MGA, UKGC', 'eCOGRA', 'aggregator'),
  ('Playson', 'playson', 'active', 'MGA', 'GLI', 'aggregator'),
  ('Demo Provider', 'demo', 'active', 'Demo Only', 'Internal RNG', 'direct')
ON CONFLICT (code) DO NOTHING;