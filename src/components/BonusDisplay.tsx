/**
 * Bonus Display Component
 * Shows $111 sign-up bonus status and T&C
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gift, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserBonus {
  id: string;
  bonus_type: string;
  bonus_amount: number;
  status: 'pending' | 'active' | 'claimed' | 'expired' | 'cancelled';
  expires_at: string | null;
  wagering_requirement: number;
  wagered_amount: number;
}

export const BonusDisplay = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bonus, setBonus] = useState<UserBonus | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchBonus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_bonuses')
          .select('*')
          .eq('user_id', user.id)
          .eq('bonus_type', 'sign_up')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching bonus:', error);
        } else if (data) {
          setBonus(data);
        }
      } catch (error) {
        console.error('Error fetching bonus:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBonus();
  }, [user]);

  const handleClaimBonus = async () => {
    if (!user) return;

    setClaiming(true);
    try {
      const { data, error } = await supabase.functions.invoke('claim-bonus', {
        body: {},
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: 'Bonus Claimed! 🎉',
          description: `$${data.bonus_amount} welcome bonus credited to your account!`,
        });
        // Refresh bonus data
        const { data: newBonus } = await supabase
          .from('user_bonuses')
          .select('*')
          .eq('user_id', user.id)
          .eq('bonus_type', 'sign_up')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (newBonus) {
          setBonus(newBonus);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to claim bonus',
        variant: 'destructive',
      });
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gaming-card/90 border-premium-gold/30 p-4">
        <div className="animate-pulse">Loading bonus...</div>
      </Card>
    );
  }

  if (!bonus) {
    return (
      <Card className="bg-gradient-to-r from-premium-gold/20 to-turquoise/20 border-premium-gold/30 p-6">
        <div className="flex items-center gap-4">
          <div className="bg-premium-gold/20 rounded-full p-4">
            <Gift className="w-8 h-8 text-premium-gold" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-premium-gold mb-1">
              Claim Your $111 Welcome Bonus!
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              New players get $111 demo credits to start playing. Minimum $30 buy-in required after bonus.
            </p>
            <Button
              onClick={handleClaimBonus}
              disabled={claiming}
              className="bg-premium-gold hover:bg-premium-gold/80 text-gaming-dark"
            >
              {claiming ? 'Claiming...' : 'Claim $111 Bonus'}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const isExpired = bonus.expires_at && new Date(bonus.expires_at) < new Date();
  const isActive = bonus.status === 'active' && !isExpired;

  return (
    <Card className="bg-gaming-card/90 border-premium-gold/30 p-4">
      <div className="flex items-start gap-3">
        <div className={`rounded-full p-2 ${
          isActive ? 'bg-emerald/20' : 'bg-muted'
        }`}>
          {isActive ? (
            <CheckCircle2 className="w-5 h-5 text-emerald" />
          ) : isExpired ? (
            <Clock className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Gift className="w-5 h-5 text-premium-gold" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-premium-gold">
              ${bonus.bonus_amount} Welcome Bonus
            </h3>
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {bonus.status === 'active' && !isExpired ? 'Active' : 'Expired'}
            </Badge>
          </div>
          
          {isActive && (
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Bonus credits available for demo play
              </p>
              {bonus.expires_at && (
                <p className="text-xs text-muted-foreground">
                  Expires: {new Date(bonus.expires_at).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* T&C Notice */}
          <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold text-amber-300 mb-1">Terms & Conditions:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Minimum $30 buy-in required after bonus</li>
                  <li>Cannot withdraw until Silver tier</li>
                  <li>Demo credits only - no real money involved</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

