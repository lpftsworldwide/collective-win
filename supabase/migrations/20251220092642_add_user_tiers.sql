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

