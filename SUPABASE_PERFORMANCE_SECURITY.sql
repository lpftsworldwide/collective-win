-- =====================================================
-- SUPABASE PERFORMANCE & SECURITY OPTIMIZATION
-- For Massive User Onboarding & High Traffic
-- =====================================================

-- =====================================================
-- PART 1: PERFORMANCE INDEXES
-- =====================================================

-- Users table indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email_lookup ON public.users(id) WHERE id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code) WHERE referral_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_kyc_status ON public.users(is_kyc_verified) WHERE is_kyc_verified = false;
CREATE INDEX IF NOT EXISTS idx_users_balance ON public.users(total_balance_aud DESC) WHERE total_balance_aud > 0;

-- Licensed games - optimize catalog queries
CREATE INDEX IF NOT EXISTS idx_licensed_games_status_category ON public.licensed_games(status, category) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_licensed_games_thumbnail ON public.licensed_games(thumbnail_url) WHERE thumbnail_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_licensed_games_provider_status ON public.licensed_games(provider_id, status);

-- Game spins - optimize history and analytics
CREATE INDEX IF NOT EXISTS idx_game_spins_user_created ON public.game_spins(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_spins_game_created ON public.game_spins(game_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_spins_win_amount ON public.game_spins(win_amount DESC) WHERE win_amount > 0;
CREATE INDEX IF NOT EXISTS idx_game_spins_status ON public.game_spins(status) WHERE status = 'completed';
CREATE INDEX IF NOT EXISTS idx_game_spins_created_at_range ON public.game_spins(created_at) WHERE created_at > NOW() - INTERVAL '30 days';

-- User bonuses - optimize bonus queries
CREATE INDEX IF NOT EXISTS idx_user_bonuses_user_status ON public.user_bonuses(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_bonuses_expires_active ON public.user_bonuses(expires_at) WHERE status = 'active' AND expires_at > NOW();
CREATE INDEX IF NOT EXISTS idx_user_bonuses_type_status ON public.user_bonuses(bonus_type, status);

-- Rate limiting - optimize abuse detection
CREATE INDEX IF NOT EXISTS idx_rate_limit_user_time ON public.rate_limit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_time ON public.rate_limit_logs(ip_address, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_action_time ON public.rate_limit_logs(action_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_recent ON public.rate_limit_logs(created_at DESC) WHERE created_at > NOW() - INTERVAL '1 hour';

-- User tiers - optimize tier lookups
CREATE INDEX IF NOT EXISTS idx_user_tiers_user_tier ON public.user_tiers(user_id, tier);
CREATE INDEX IF NOT EXISTS idx_user_tiers_tier_xp ON public.user_tiers(tier, xp_earned DESC);

-- =====================================================
-- PART 2: CONNECTION POOLING & QUERY OPTIMIZATION
-- =====================================================

-- Analyze tables for query planner optimization
ANALYZE public.users;
ANALYZE public.licensed_games;
ANALYZE public.game_spins;
ANALYZE public.user_bonuses;
ANALYZE public.rate_limit_logs;
ANALYZE public.user_tiers;

-- =====================================================
-- PART 3: SECURITY HARDENING
-- =====================================================

-- Additional RLS policies for security

-- Prevent users from modifying critical fields directly
CREATE OR REPLACE FUNCTION public.prevent_balance_modification()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow balance changes through edge functions (service role)
  IF OLD.total_balance_aud != NEW.total_balance_aud AND auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Balance can only be modified through authorized functions';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS prevent_balance_modification_trigger ON public.users;
CREATE TRIGGER prevent_balance_modification_trigger
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_balance_modification();

-- Prevent bonus manipulation
CREATE OR REPLACE FUNCTION public.prevent_bonus_modification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.bonus_amount != NEW.bonus_amount AND auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Bonus amounts can only be modified through authorized functions';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS prevent_bonus_modification_trigger ON public.user_bonuses;
CREATE TRIGGER prevent_bonus_modification_trigger
  BEFORE UPDATE ON public.user_bonuses
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_bonus_modification();

-- =====================================================
-- PART 4: RATE LIMITING FUNCTIONS (OPTIMIZED)
-- =====================================================

-- Optimized rate limit check function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_user_id UUID,
  p_action_type TEXT,
  p_max_requests INTEGER DEFAULT 60,
  p_window_seconds INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_count INTEGER;
BEGIN
  -- Count requests in the time window
  SELECT COUNT(*) INTO request_count
  FROM public.rate_limit_logs
  WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND created_at > NOW() - (p_window_seconds || ' seconds')::INTERVAL;
  
  -- Return true if under limit
  RETURN request_count < p_max_requests;
END;
$$;

-- Optimized rate limit logging (with cleanup)
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
  log_id UUID;
BEGIN
  -- Insert log entry
  INSERT INTO public.rate_limit_logs (user_id, action_type, ip_address)
  VALUES (p_user_id, p_action_type, p_ip_address)
  RETURNING id INTO log_id;
  
  -- Cleanup old logs (older than 24 hours) - run periodically
  DELETE FROM public.rate_limit_logs
  WHERE created_at < NOW() - INTERVAL '24 hours';
  
  RETURN log_id;
END;
$$;

-- =====================================================
-- PART 5: ONBOARDING QUEUE SYSTEM
-- =====================================================

-- Create onboarding queue table for high-volume signups
CREATE TABLE IF NOT EXISTS public.onboarding_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  priority INTEGER DEFAULT 0, -- Higher = more urgent
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.onboarding_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "System can manage onboarding queue"
  ON public.onboarding_queue
  FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Users can view their own queue status"
  ON public.onboarding_queue
  FOR SELECT
  USING (auth.uid() = user_id);

-- Indexes for queue processing
CREATE INDEX IF NOT EXISTS idx_onboarding_queue_status_priority ON public.onboarding_queue(status, priority DESC, created_at ASC) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_onboarding_queue_user_id ON public.onboarding_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_queue_created_at ON public.onboarding_queue(created_at);

-- Function to process onboarding queue
CREATE OR REPLACE FUNCTION public.process_onboarding_queue(
  p_batch_size INTEGER DEFAULT 10
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  processed_count INTEGER := 0;
  queue_item RECORD;
BEGIN
  -- Get pending items ordered by priority and creation time
  FOR queue_item IN
    SELECT * FROM public.onboarding_queue
    WHERE status = 'pending'
      AND retry_count < max_retries
    ORDER BY priority DESC, created_at ASC
    LIMIT p_batch_size
    FOR UPDATE SKIP LOCKED
  LOOP
    BEGIN
      -- Update status to processing
      UPDATE public.onboarding_queue
      SET status = 'processing', updated_at = NOW()
      WHERE id = queue_item.id;
      
      -- Here you would call your onboarding logic
      -- For now, we'll just mark as completed
      -- In production, this would:
      -- 1. Send welcome email
      -- 2. Claim bonus
      -- 3. Set up user preferences
      -- 4. Trigger analytics events
      
      UPDATE public.onboarding_queue
      SET status = 'completed', processed_at = NOW(), updated_at = NOW()
      WHERE id = queue_item.id;
      
      processed_count := processed_count + 1;
      
    EXCEPTION WHEN OTHERS THEN
      -- Mark as failed and increment retry count
      UPDATE public.onboarding_queue
      SET status = 'failed',
          retry_count = retry_count + 1,
          error_message = SQLERRM,
          updated_at = NOW()
      WHERE id = queue_item.id;
    END;
  END LOOP;
  
  RETURN processed_count;
END;
$$;

-- =====================================================
-- PART 6: CACHING & MATERIALIZED VIEWS
-- =====================================================

-- Materialized view for game catalog (refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_active_games AS
SELECT 
  lg.id,
  lg.game_code,
  lg.name,
  lg.category,
  lg.thumbnail_url,
  lg.rtp_certified,
  lg.volatility,
  lg.min_bet_aud,
  lg.max_bet_aud,
  gp.name as provider_name,
  gp.code as provider_code
FROM public.licensed_games lg
JOIN public.game_providers gp ON lg.provider_id = gp.id
WHERE lg.status = 'active'
ORDER BY lg.name;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_active_games_id ON public.mv_active_games(id);
CREATE INDEX IF NOT EXISTS idx_mv_active_games_category ON public.mv_active_games(category);
CREATE INDEX IF NOT EXISTS idx_mv_active_games_provider ON public.mv_active_games(provider_code);

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION public.refresh_game_catalog_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_active_games;
END;
$$;

-- =====================================================
-- PART 7: MONITORING & ANALYTICS
-- =====================================================

-- Create system health monitoring table
CREATE TABLE IF NOT EXISTS public.system_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC,
  metadata JSONB DEFAULT '{}'::jsonb,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_system_health_metric_time ON public.system_health(metric_name, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_health_recent ON public.system_health(recorded_at DESC) WHERE recorded_at > NOW() - INTERVAL '24 hours';

-- Function to record system metrics
CREATE OR REPLACE FUNCTION public.record_system_metric(
  p_metric_name TEXT,
  p_metric_value NUMERIC,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  metric_id UUID;
BEGIN
  INSERT INTO public.system_health (metric_name, metric_value, metadata)
  VALUES (p_metric_name, p_metric_value, p_metadata)
  RETURNING id INTO metric_id;
  
  -- Cleanup old metrics (older than 7 days)
  DELETE FROM public.system_health
  WHERE recorded_at < NOW() - INTERVAL '7 days';
  
  RETURN metric_id;
END;
$$;

-- =====================================================
-- PART 8: FRAUD PREVENTION
-- =====================================================

-- Create fraud detection table
CREATE TABLE IF NOT EXISTS public.fraud_detection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  action_type TEXT NOT NULL,
  risk_score NUMERIC(5,2) DEFAULT 0.00,
  flags JSONB DEFAULT '{}'::jsonb,
  is_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fraud_user_ip ON public.fraud_detection_logs(user_id, ip_address);
CREATE INDEX IF NOT EXISTS idx_fraud_risk_score ON public.fraud_detection_logs(risk_score DESC) WHERE risk_score > 50;
CREATE INDEX IF NOT EXISTS idx_fraud_blocked ON public.fraud_detection_logs(is_blocked) WHERE is_blocked = true;
CREATE INDEX IF NOT EXISTS idx_fraud_created_at ON public.fraud_detection_logs(created_at DESC);

ALTER TABLE public.fraud_detection_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can manage fraud logs"
  ON public.fraud_detection_logs
  FOR ALL
  USING (auth.role() = 'service_role');

-- Function to check fraud risk
CREATE OR REPLACE FUNCTION public.check_fraud_risk(
  p_user_id UUID,
  p_ip_address INET,
  p_action_type TEXT
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  risk_score NUMERIC := 0;
  recent_actions INTEGER;
  ip_actions INTEGER;
  blocked_count INTEGER;
BEGIN
  -- Check recent actions from same user
  SELECT COUNT(*) INTO recent_actions
  FROM public.fraud_detection_logs
  WHERE user_id = p_user_id
    AND created_at > NOW() - INTERVAL '5 minutes';
  
  -- Check actions from same IP
  SELECT COUNT(*) INTO ip_actions
  FROM public.fraud_detection_logs
  WHERE ip_address = p_ip_address
    AND created_at > NOW() - INTERVAL '5 minutes';
  
  -- Check if IP is blocked
  SELECT COUNT(*) INTO blocked_count
  FROM public.fraud_detection_logs
  WHERE ip_address = p_ip_address
    AND is_blocked = true;
  
  -- Calculate risk score
  risk_score := (recent_actions * 10) + (ip_actions * 5) + (blocked_count * 50);
  
  -- Log the check
  INSERT INTO public.fraud_detection_logs (user_id, ip_address, action_type, risk_score)
  VALUES (p_user_id, p_ip_address, p_action_type, risk_score);
  
  RETURN risk_score;
END;
$$;

-- =====================================================
-- PART 9: SESSION MANAGEMENT
-- =====================================================

-- Create session tracking table
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON public.user_sessions(expires_at) WHERE is_active = true;

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON public.user_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage sessions"
  ON public.user_sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- Function to cleanup expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  UPDATE public.user_sessions
  SET is_active = false
  WHERE expires_at < NOW() AND is_active = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Delete very old sessions (older than 30 days)
  DELETE FROM public.user_sessions
  WHERE expires_at < NOW() - INTERVAL '30 days';
  
  RETURN deleted_count;
END;
$$;

-- =====================================================
-- PART 10: AUTO-SCALING HELPERS
-- =====================================================

-- Function to get system load metrics
CREATE OR REPLACE FUNCTION public.get_system_load()
RETURNS TABLE (
  active_users INTEGER,
  pending_onboarding INTEGER,
  recent_spins INTEGER,
  avg_response_time NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM public.users WHERE updated_at > NOW() - INTERVAL '5 minutes')::INTEGER as active_users,
    (SELECT COUNT(*) FROM public.onboarding_queue WHERE status = 'pending')::INTEGER as pending_onboarding,
    (SELECT COUNT(*) FROM public.game_spins WHERE created_at > NOW() - INTERVAL '1 minute')::INTEGER as recent_spins,
    (SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) FROM public.game_spins WHERE created_at > NOW() - INTERVAL '5 minutes')::NUMERIC as avg_response_time;
END;
$$;

-- =====================================================
-- PART 11: GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION public.check_rate_limit(UUID, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_rate_limit_action(UUID, TEXT, INET) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_onboarding_queue(INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_game_catalog_cache() TO service_role;
GRANT EXECUTE ON FUNCTION public.record_system_metric(TEXT, NUMERIC, JSONB) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_fraud_risk(UUID, INET, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_sessions() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_system_load() TO service_role;

-- =====================================================
-- PART 12: SCHEDULED TASKS (via pg_cron if available)
-- =====================================================

-- Note: These require pg_cron extension
-- Uncomment if pg_cron is enabled in your Supabase project

/*
-- Refresh game catalog every 5 minutes
SELECT cron.schedule(
  'refresh-game-catalog',
  '*/5 * * * *',
  'SELECT public.refresh_game_catalog_cache();'
);

-- Cleanup expired sessions every hour
SELECT cron.schedule(
  'cleanup-sessions',
  '0 * * * *',
  'SELECT public.cleanup_expired_sessions();'
);

-- Process onboarding queue every minute
SELECT cron.schedule(
  'process-onboarding',
  '* * * * *',
  'SELECT public.process_onboarding_queue(10);'
);
*/

-- =====================================================
-- COMPLETE
-- =====================================================

COMMENT ON TABLE public.onboarding_queue IS 'Queue system for high-volume user onboarding';
COMMENT ON TABLE public.system_health IS 'System monitoring and health metrics';
COMMENT ON TABLE public.fraud_detection_logs IS 'Fraud detection and risk scoring';
COMMENT ON TABLE public.user_sessions IS 'User session tracking and management';
COMMENT ON MATERIALIZED VIEW public.mv_active_games IS 'Cached active games catalog for performance';

