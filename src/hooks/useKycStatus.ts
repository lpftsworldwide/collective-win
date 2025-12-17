import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type KycStatus = 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'expired';

interface KycStatusResult {
  status: KycStatus | null;
  isVerified: boolean;
  isLoading: boolean;
  refresh: () => void;
}

export const useKycStatus = (): KycStatusResult => {
  const { user } = useAuth();
  const [status, setStatus] = useState<KycStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    if (!user) {
      setStatus(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('kyc_verifications')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      
      // Cast the status string to KycStatus type
      setStatus(data?.status as KycStatus || null);
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    isVerified: status === 'approved',
    isLoading,
    refresh: fetchStatus,
  };
};