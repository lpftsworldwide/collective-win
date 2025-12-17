-- Create demo_sessions table for tracking demo play sessions
CREATE TABLE public.demo_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  demo_balance NUMERIC NOT NULL DEFAULT 10000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Create demo_spins table for logging all demo spins
CREATE TABLE public.demo_spins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.demo_sessions(id) ON DELETE CASCADE NOT NULL,
  spin_index INTEGER NOT NULL,
  wager NUMERIC NOT NULL,
  outcome_json JSONB NOT NULL,
  win_amount NUMERIC NOT NULL DEFAULT 0,
  rng_seed TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, spin_index)
);

-- Enable RLS
ALTER TABLE public.demo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_spins ENABLE ROW LEVEL SECURITY;

-- RLS policies for demo_sessions
CREATE POLICY "Users can view their own demo sessions"
ON public.demo_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own demo sessions"
ON public.demo_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own demo sessions"
ON public.demo_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all demo sessions"
ON public.demo_sessions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for demo_spins
CREATE POLICY "Users can view their own demo spins"
ON public.demo_spins FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.demo_sessions ds 
  WHERE ds.id = demo_spins.session_id AND ds.user_id = auth.uid()
));

CREATE POLICY "Users can create demo spins for their sessions"
ON public.demo_spins FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.demo_sessions ds 
  WHERE ds.id = demo_spins.session_id AND ds.user_id = auth.uid()
));

CREATE POLICY "Admins can view all demo spins"
ON public.demo_spins FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_demo_sessions_user_id ON public.demo_sessions(user_id);
CREATE INDEX idx_demo_sessions_game_id ON public.demo_sessions(game_id);
CREATE INDEX idx_demo_spins_session_id ON public.demo_spins(session_id);
CREATE INDEX idx_demo_spins_created_at ON public.demo_spins(created_at);