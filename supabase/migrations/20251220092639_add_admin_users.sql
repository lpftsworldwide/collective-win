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

