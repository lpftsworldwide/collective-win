-- Enable realtime for game_sessions table
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_sessions;

-- Enable realtime for users table  
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;