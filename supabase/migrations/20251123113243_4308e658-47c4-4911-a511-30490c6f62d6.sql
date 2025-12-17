-- Fix recursive RLS policy on user_roles table
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policies for cross-user data access
CREATE POLICY "Admins can view all sessions" ON public.game_sessions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Enable realtime for game_sessions (for admin dashboard live updates)
ALTER TABLE public.game_sessions REPLICA IDENTITY FULL;