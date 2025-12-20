-- SUPABASE PERFORMANCE & SECURITY AUDIT
-- Run this in Supabase SQL Editor to check and fix issues

-- ============================================
-- 1. PERFORMANCE AUDITS
-- ============================================

-- Check for missing indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('licensed_games', 'game_spins', 'users', 'user_bonuses', 'game_providers')
ORDER BY tablename, indexname;

-- Check table sizes and row counts
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    (SELECT COUNT(*) FROM information_schema.tables t WHERE t.table_schema = schemaname AND t.table_name = tablename) as row_count
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('licensed_games', 'game_spins', 'users', 'user_bonuses')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check for slow queries (if pg_stat_statements is enabled)
-- SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;

-- ============================================
-- 2. SECURITY AUDITS
-- ============================================

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check for tables without RLS enabled
SELECT 
    schemaname,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN (
    SELECT tablename FROM pg_policies WHERE schemaname = 'public'
  )
  AND tablename NOT IN ('_prisma_migrations', 'schema_migrations');

-- Check for exposed service role keys in functions
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_definition LIKE '%service_role%'
  AND routine_definition LIKE '%eyJ%';

-- ============================================
-- 3. DATA INTEGRITY CHECKS
-- ============================================

-- Check for games without thumbnails
SELECT 
    game_code,
    name,
    thumbnail_url
FROM public.licensed_games
WHERE thumbnail_url IS NULL 
   OR thumbnail_url = ''
   OR thumbnail_url NOT LIKE '/game-tiles/%';

-- Check for orphaned game_spins (no user)
SELECT COUNT(*) as orphaned_spins
FROM public.game_spins gs
LEFT JOIN public.users u ON gs.user_id = u.id
WHERE u.id IS NULL;

-- Check for negative balances
SELECT 
    id,
    email,
    total_balance_aud,
    bonus_balance
FROM public.users
WHERE total_balance_aud < 0 
   OR bonus_balance < 0;

-- ============================================
-- 4. PERFORMANCE INDEXES (Add if missing)
-- ============================================

-- Indexes for licensed_games
CREATE INDEX IF NOT EXISTS idx_licensed_games_status ON public.licensed_games(status);
CREATE INDEX IF NOT EXISTS idx_licensed_games_category ON public.licensed_games(category);
CREATE INDEX IF NOT EXISTS idx_licensed_games_provider_id ON public.licensed_games(provider_id);
CREATE INDEX IF NOT EXISTS idx_licensed_games_game_code ON public.licensed_games(game_code);

-- Indexes for game_spins
CREATE INDEX IF NOT EXISTS idx_game_spins_user_id ON public.game_spins(user_id);
CREATE INDEX IF NOT EXISTS idx_game_spins_game_id ON public.game_spins(game_id);
CREATE INDEX IF NOT EXISTS idx_game_spins_created_at ON public.game_spins(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_spins_user_game ON public.game_spins(user_id, game_id);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_tier ON public.users(tier);

-- Indexes for user_bonuses
CREATE INDEX IF NOT EXISTS idx_user_bonuses_user_id ON public.user_bonuses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bonuses_status ON public.user_bonuses(status);

-- ============================================
-- 5. SECURITY HARDENING
-- ============================================

-- Ensure RLS is enabled on all tables
ALTER TABLE public.licensed_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_spins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bonuses ENABLE ROW LEVEL SECURITY;

-- Verify no service role keys in edge functions (manual check required)
-- Check supabase/functions/*/index.ts files for hardcoded keys

-- ============================================
-- 6. PERFORMANCE OPTIMIZATIONS
-- ============================================

-- Analyze tables for query planner
ANALYZE public.licensed_games;
ANALYZE public.game_spins;
ANALYZE public.users;
ANALYZE public.user_bonuses;
ANALYZE public.game_providers;

-- Vacuum to reclaim space (run during low traffic)
-- VACUUM ANALYZE public.game_spins;

-- ============================================
-- 7. REPORT SUMMARY
-- ============================================

SELECT 
    'Performance & Security Audit Complete' as status,
    (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND tablename IN ('licensed_games', 'game_spins', 'users')) as total_indexes,
    (SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public') as total_rls_policies,
    (SELECT COUNT(*) FROM public.licensed_games WHERE thumbnail_url IS NULL OR thumbnail_url = '') as games_missing_images;

