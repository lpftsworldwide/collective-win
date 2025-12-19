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

