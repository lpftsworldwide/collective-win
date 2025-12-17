-- Create VIP tier enum
CREATE TYPE public.vip_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum', 'diamond');

-- Create VIP profiles table
CREATE TABLE public.vip_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  tier vip_tier NOT NULL DEFAULT 'bronze',
  total_wagered NUMERIC NOT NULL DEFAULT 0,
  total_deposited NUMERIC NOT NULL DEFAULT 0,
  points NUMERIC NOT NULL DEFAULT 0,
  cashback_rate NUMERIC NOT NULL DEFAULT 0.5,
  weekly_bonus_multiplier NUMERIC NOT NULL DEFAULT 1.0,
  free_spins_balance INTEGER NOT NULL DEFAULT 0,
  tier_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vip_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own VIP profile"
ON public.vip_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own VIP profile"
ON public.vip_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all VIP profiles"
ON public.vip_profiles
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create function to update VIP tier based on total wagered
CREATE OR REPLACE FUNCTION public.update_vip_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Update tier based on total wagered
  IF NEW.total_wagered >= 500000 THEN
    NEW.tier := 'diamond';
    NEW.cashback_rate := 2.5;
    NEW.weekly_bonus_multiplier := 3.0;
  ELSIF NEW.total_wagered >= 100000 THEN
    NEW.tier := 'platinum';
    NEW.cashback_rate := 2.0;
    NEW.weekly_bonus_multiplier := 2.5;
  ELSIF NEW.total_wagered >= 25000 THEN
    NEW.tier := 'gold';
    NEW.cashback_rate := 1.5;
    NEW.weekly_bonus_multiplier := 2.0;
  ELSIF NEW.total_wagered >= 5000 THEN
    NEW.tier := 'silver';
    NEW.cashback_rate := 1.0;
    NEW.weekly_bonus_multiplier := 1.5;
  ELSE
    NEW.tier := 'bronze';
    NEW.cashback_rate := 0.5;
    NEW.weekly_bonus_multiplier := 1.0;
  END IF;
  
  NEW.tier_updated_at := now();
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
CREATE TRIGGER update_vip_tier_trigger
BEFORE UPDATE ON public.vip_profiles
FOR EACH ROW
WHEN (OLD.total_wagered IS DISTINCT FROM NEW.total_wagered)
EXECUTE FUNCTION public.update_vip_tier();

-- Create trigger for updated_at
CREATE TRIGGER update_vip_profiles_updated_at
BEFORE UPDATE ON public.vip_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();