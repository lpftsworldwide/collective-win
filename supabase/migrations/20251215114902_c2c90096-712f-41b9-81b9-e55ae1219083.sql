-- Create responsible gambling settings table
CREATE TABLE public.responsible_gambling_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Deposit limits
  daily_deposit_limit NUMERIC(12,2) DEFAULT NULL,
  weekly_deposit_limit NUMERIC(12,2) DEFAULT NULL,
  monthly_deposit_limit NUMERIC(12,2) DEFAULT NULL,
  
  -- Session time limits (in minutes)
  session_time_limit INTEGER DEFAULT NULL,
  session_reminder_interval INTEGER DEFAULT 60, -- remind every 60 minutes
  
  -- Self-exclusion
  self_exclusion_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  self_exclusion_permanent BOOLEAN DEFAULT FALSE,
  
  -- Cool-off periods
  cool_off_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  
  -- Reality check settings
  reality_check_enabled BOOLEAN DEFAULT TRUE,
  loss_limit_per_session NUMERIC(12,2) DEFAULT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.responsible_gambling_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own settings"
ON public.responsible_gambling_settings
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
ON public.responsible_gambling_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
ON public.responsible_gambling_settings
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all settings for support
CREATE POLICY "Admins can view all settings"
ON public.responsible_gambling_settings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_responsible_gambling_settings_updated_at
BEFORE UPDATE ON public.responsible_gambling_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create deposit tracking table for limit enforcement
CREATE TABLE public.deposit_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  deposit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.deposit_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deposit tracking
CREATE POLICY "Users can view their own deposits"
ON public.deposit_tracking
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert deposits"
ON public.deposit_tracking
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for efficient limit checking
CREATE INDEX idx_deposit_tracking_user_date ON public.deposit_tracking(user_id, deposit_date);

-- Function to check deposit limits
CREATE OR REPLACE FUNCTION public.check_deposit_limit(
  p_user_id UUID,
  p_amount NUMERIC
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings responsible_gambling_settings;
  v_daily_total NUMERIC;
  v_weekly_total NUMERIC;
  v_monthly_total NUMERIC;
  v_is_excluded BOOLEAN;
BEGIN
  -- Get user settings
  SELECT * INTO v_settings
  FROM responsible_gambling_settings
  WHERE user_id = p_user_id;
  
  -- Check self-exclusion
  IF v_settings.self_exclusion_permanent = TRUE THEN
    RETURN json_build_object('allowed', false, 'reason', 'Account is permanently self-excluded');
  END IF;
  
  IF v_settings.self_exclusion_until IS NOT NULL AND v_settings.self_exclusion_until > now() THEN
    RETURN json_build_object('allowed', false, 'reason', 'Account is self-excluded until ' || v_settings.self_exclusion_until::text);
  END IF;
  
  IF v_settings.cool_off_until IS NOT NULL AND v_settings.cool_off_until > now() THEN
    RETURN json_build_object('allowed', false, 'reason', 'Account is in cool-off period until ' || v_settings.cool_off_until::text);
  END IF;
  
  -- Check daily limit
  IF v_settings.daily_deposit_limit IS NOT NULL THEN
    SELECT COALESCE(SUM(amount), 0) INTO v_daily_total
    FROM deposit_tracking
    WHERE user_id = p_user_id AND deposit_date = CURRENT_DATE;
    
    IF (v_daily_total + p_amount) > v_settings.daily_deposit_limit THEN
      RETURN json_build_object(
        'allowed', false, 
        'reason', 'Daily deposit limit exceeded',
        'limit', v_settings.daily_deposit_limit,
        'used', v_daily_total,
        'remaining', GREATEST(0, v_settings.daily_deposit_limit - v_daily_total)
      );
    END IF;
  END IF;
  
  -- Check weekly limit
  IF v_settings.weekly_deposit_limit IS NOT NULL THEN
    SELECT COALESCE(SUM(amount), 0) INTO v_weekly_total
    FROM deposit_tracking
    WHERE user_id = p_user_id AND deposit_date >= CURRENT_DATE - INTERVAL '7 days';
    
    IF (v_weekly_total + p_amount) > v_settings.weekly_deposit_limit THEN
      RETURN json_build_object(
        'allowed', false, 
        'reason', 'Weekly deposit limit exceeded',
        'limit', v_settings.weekly_deposit_limit,
        'used', v_weekly_total,
        'remaining', GREATEST(0, v_settings.weekly_deposit_limit - v_weekly_total)
      );
    END IF;
  END IF;
  
  -- Check monthly limit
  IF v_settings.monthly_deposit_limit IS NOT NULL THEN
    SELECT COALESCE(SUM(amount), 0) INTO v_monthly_total
    FROM deposit_tracking
    WHERE user_id = p_user_id AND deposit_date >= CURRENT_DATE - INTERVAL '30 days';
    
    IF (v_monthly_total + p_amount) > v_settings.monthly_deposit_limit THEN
      RETURN json_build_object(
        'allowed', false, 
        'reason', 'Monthly deposit limit exceeded',
        'limit', v_settings.monthly_deposit_limit,
        'used', v_monthly_total,
        'remaining', GREATEST(0, v_settings.monthly_deposit_limit - v_monthly_total)
      );
    END IF;
  END IF;
  
  RETURN json_build_object('allowed', true);
END;
$$;

-- Function to check if user can play (not excluded)
CREATE OR REPLACE FUNCTION public.can_user_play(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_settings responsible_gambling_settings;
BEGIN
  SELECT * INTO v_settings
  FROM responsible_gambling_settings
  WHERE user_id = p_user_id;
  
  -- If no settings, user can play
  IF v_settings IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check permanent exclusion
  IF v_settings.self_exclusion_permanent = TRUE THEN
    RETURN FALSE;
  END IF;
  
  -- Check temporary exclusion
  IF v_settings.self_exclusion_until IS NOT NULL AND v_settings.self_exclusion_until > now() THEN
    RETURN FALSE;
  END IF;
  
  -- Check cool-off
  IF v_settings.cool_off_until IS NOT NULL AND v_settings.cool_off_until > now() THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$;