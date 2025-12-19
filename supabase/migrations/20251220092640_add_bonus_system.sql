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

