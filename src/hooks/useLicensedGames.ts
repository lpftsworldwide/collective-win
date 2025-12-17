import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
        .in('status', ['active', 'demo_only', 'coming_soon'])
        .order('name', { ascending: true });

      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching licensed games:', error);
        throw error;
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
        console.error('Error fetching game providers:', error);
        throw error;
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
