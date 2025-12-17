import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ResponsibleGamblingSettings {
  id: string;
  user_id: string;
  daily_deposit_limit: number | null;
  weekly_deposit_limit: number | null;
  monthly_deposit_limit: number | null;
  session_time_limit: number | null;
  session_reminder_interval: number;
  self_exclusion_until: string | null;
  self_exclusion_permanent: boolean;
  cool_off_until: string | null;
  reality_check_enabled: boolean;
  loss_limit_per_session: number | null;
  created_at: string;
  updated_at: string;
}

export function useResponsibleGambling() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['responsible-gambling', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('responsible_gambling_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as ResponsibleGamblingSettings | null;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<ResponsibleGamblingSettings>) => {
      if (!user) throw new Error('Not authenticated');

      // Check if settings exist
      const { data: existing } = await supabase
        .from('responsible_gambling_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('responsible_gambling_settings')
          .update(newSettings)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('responsible_gambling_settings')
          .insert({ ...newSettings, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsible-gambling', user?.id] });
    },
  });

  const setSelfExclusion = useMutation({
    mutationFn: async ({ days, permanent }: { days?: number; permanent?: boolean }) => {
      if (!user) throw new Error('Not authenticated');

      const updateData: Partial<ResponsibleGamblingSettings> = {};
      
      if (permanent) {
        updateData.self_exclusion_permanent = true;
        updateData.self_exclusion_until = null;
      } else if (days) {
        const until = new Date();
        until.setDate(until.getDate() + days);
        updateData.self_exclusion_until = until.toISOString();
        updateData.self_exclusion_permanent = false;
      }

      // Check if settings exist
      const { data: existing } = await supabase
        .from('responsible_gambling_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('responsible_gambling_settings')
          .update(updateData)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('responsible_gambling_settings')
          .insert({ ...updateData, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsible-gambling', user?.id] });
    },
  });

  const setCoolOff = useMutation({
    mutationFn: async (hours: number) => {
      if (!user) throw new Error('Not authenticated');

      const until = new Date();
      until.setHours(until.getHours() + hours);

      // Check if settings exist
      const { data: existing } = await supabase
        .from('responsible_gambling_settings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('responsible_gambling_settings')
          .update({ cool_off_until: until.toISOString() })
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('responsible_gambling_settings')
          .insert({ user_id: user.id, cool_off_until: until.toISOString() });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsible-gambling', user?.id] });
    },
  });

  // Check if user is currently excluded or in cool-off
  const isExcluded = settings?.self_exclusion_permanent || 
    (settings?.self_exclusion_until && new Date(settings.self_exclusion_until) > new Date());
  
  const isInCoolOff = settings?.cool_off_until && new Date(settings.cool_off_until) > new Date();

  const canPlay = !isExcluded && !isInCoolOff;

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    setSelfExclusion,
    setCoolOff,
    isExcluded,
    isInCoolOff,
    canPlay,
  };
}
