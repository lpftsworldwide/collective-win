-- Add admin SELECT policy for deposit_tracking (compliance monitoring)
CREATE POLICY "Admins can view all deposits" 
ON public.deposit_tracking 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update game_providers policy to only allow authenticated users to view active providers
-- First drop the existing overly permissive policy
DROP POLICY IF EXISTS "Anyone can view active providers" ON public.game_providers;

-- Create new policy restricting to authenticated users only
CREATE POLICY "Authenticated users can view active providers" 
ON public.game_providers 
FOR SELECT 
TO authenticated
USING (status = 'active'::provider_status);