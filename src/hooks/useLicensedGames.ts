import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { gameLibrary, type Game } from "@/data/gameLibrary";

export interface LicensedGame {
  id: string;
  game_code: string;
  name: string;
  category: string;
  rtp_certified: number | null;
  volatility: string | null;
  status: 'active' | 'demo_only' | 'coming_soon' | 'disabled';
  thumbnail_url: string | null;
  min_bet_aud: number | null;
  max_bet_aud: number | null;
  is_demo_available: boolean | null;
  provider: {
    id: string;
    name: string;
    code: string;
    status: string;
    rng_certification: string | null;
    license_info: string | null;
  } | null;
}

export interface GameProvider {
  id: string;
  name: string;
  code: string;
  status: string;
  rng_certification: string | null;
  license_info: string | null;
  license_jurisdiction: string | null;
}

export function useLicensedGames(filters?: {
  category?: string;
  provider?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['licensed-games', filters],
    queryFn: async () => {
      // Query games with provider info - using left join syntax for anon access
      let query = supabase
        .from('licensed_games')
        .select(`
          id,
          game_code,
          name,
          category,
          rtp_certified,
          volatility,
          status,
          thumbnail_url,
          min_bet_aud,
          max_bet_aud,
          is_demo_available,
          provider_id,
          game_providers (
            id,
            name,
            code,
            status,
            rng_certification,
            license_info
          )
        `)
        .in('status', ['active', 'demo_only'])
        .order('name', { ascending: true });

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;

      // If database query fails or returns empty, fallback to gameLibrary
      if (error || !data || data.length === 0) {
        console.warn('Database query failed or empty, falling back to gameLibrary:', error);
        
        // Convert gameLibrary to LicensedGame format
        const fallbackGames: LicensedGame[] = gameLibrary.map((game: Game) => {
          // Map GameType to category
          const categoryMap: Record<string, string> = {
            'Slot': 'slots',
            'Live': 'live',
            'Table': 'table',
            'Crash': 'crash'
          };
          
          return {
            id: game.GameID,
            game_code: game.GameID,
            name: game.GameTitle,
            category: categoryMap[game.GameType] || 'slots',
            rtp_certified: parseFloat(game.RTP.replace('%', '')),
            volatility: game.Volatility.toLowerCase(),
            status: 'active' as const,
            thumbnail_url: null,
            min_bet_aud: 0.20,
            max_bet_aud: 1000.00,
            is_demo_available: true,
            provider: {
              id: 'collective-wins',
              name: game.Provider,
              code: game.Provider.toLowerCase().replace(/\s+/g, '-'),
              status: 'active',
              rng_certification: 'Provably Fair System',
              license_info: 'Collective Wins Custom Game'
            }
          };
        });
        
        // Apply filters to fallback games
        let filtered = fallbackGames;
        if (filters?.category && filters.category !== 'all') {
          filtered = filtered.filter(g => g.category === filters.category);
        }
        if (filters?.provider && filters.provider !== 'all') {
          filtered = filtered.filter(g => g.provider?.name === filters.provider);
        }
        if (filters?.search) {
          const searchLower = filters.search.toLowerCase();
          filtered = filtered.filter(g => g.name.toLowerCase().includes(searchLower));
        }
        
        return filtered;
      }

      // Transform the data to match the expected structure
      const games = (data || []).map((game: any) => ({
        ...game,
        provider: game.game_providers || null,
      })) as LicensedGame[];
      
      // Filter by provider name if specified
      if (filters?.provider && filters.provider !== 'all') {
        return games.filter(g => g.provider?.name === filters.provider);
      }

      return games;
    },
    staleTime: 60000,
  });
}

export function useGameProviders() {
  return useQuery({
    queryKey: ['game-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_providers')
        .select('*')
        .eq('status', 'active')
        .order('name', { ascending: true });

      if (error) {
        console.warn('Error fetching game providers, using fallback:', error);
        // Fallback: return unique providers from gameLibrary
        const providers = new Map<string, GameProvider>();
        gameLibrary.forEach(game => {
          if (!providers.has(game.Provider)) {
            providers.set(game.Provider, {
              id: game.Provider.toLowerCase().replace(/\s+/g, '-'),
              name: game.Provider,
              code: game.Provider.toLowerCase().replace(/\s+/g, '-'),
              status: 'active',
              rng_certification: 'Provably Fair System',
              license_info: 'Collective Wins Custom Game',
              license_jurisdiction: 'Internal RNG'
            });
          }
        });
        return Array.from(providers.values());
      }

      // If data is empty, use fallback
      if (!data || data.length === 0) {
        const providers = new Map<string, GameProvider>();
        gameLibrary.forEach(game => {
          if (!providers.has(game.Provider)) {
            providers.set(game.Provider, {
              id: game.Provider.toLowerCase().replace(/\s+/g, '-'),
              name: game.Provider,
              code: game.Provider.toLowerCase().replace(/\s+/g, '-'),
              status: 'active',
              rng_certification: 'Provably Fair System',
              license_info: 'Collective Wins Custom Game',
              license_jurisdiction: 'Internal RNG'
            });
          }
        });
        return Array.from(providers.values());
      }

      return data as GameProvider[];
    },
    staleTime: 300000, // Cache for 5 minutes
  });
}

export function useGameCategories() {
  return useQuery({
    queryKey: ['game-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('licensed_games')
        .select('category')
        .neq('status', 'disabled');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      // Get unique categories with counts
      const categoryMap = new Map<string, number>();
      data?.forEach(game => {
        const count = categoryMap.get(game.category) || 0;
        categoryMap.set(game.category, count + 1);
      });

      return Array.from(categoryMap.entries()).map(([name, count]) => ({
        name,
        count,
        label: name.charAt(0).toUpperCase() + name.slice(1),
      }));
    },
    staleTime: 300000,
  });
}
