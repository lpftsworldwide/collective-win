/**
 * User Profile Component
 * Displays user tier, XP, and account information
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Crown, Shield, Star, Trophy } from 'lucide-react';

interface UserTier {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  lifetime_deposits: number;
  lifetime_wagered: number;
  can_withdraw: boolean;
}

const TIER_INFO = {
  bronze: {
    name: 'Bronze',
    icon: Shield,
    color: 'text-amber-600',
    bgColor: 'bg-amber-500/20',
    borderColor: 'border-amber-500/30',
    minDeposits: 0,
    nextTier: 'Silver',
    nextTierDeposits: 30,
  },
  silver: {
    name: 'Silver',
    icon: Star,
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/30',
    minDeposits: 30,
    nextTier: 'Gold',
    nextTierDeposits: 500,
  },
  gold: {
    name: 'Gold',
    icon: Trophy,
    color: 'text-premium-gold',
    bgColor: 'bg-premium-gold/20',
    borderColor: 'border-premium-gold/30',
    minDeposits: 500,
    nextTier: 'Platinum',
    nextTierDeposits: 5000,
  },
  platinum: {
    name: 'Platinum',
    icon: Crown,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    minDeposits: 5000,
    nextTier: null,
    nextTierDeposits: null,
  },
};

export const UserProfile = () => {
  const { user } = useAuth();
  const [tier, setTier] = useState<UserTier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTier = async () => {
      try {
        const { data, error } = await supabase
          .from('user_tiers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching tier:', error);
        } else if (data) {
          setTier(data);
        } else {
          // Create default bronze tier
          const { data: newTier } = await supabase
            .from('user_tiers')
            .insert({
              user_id: user.id,
              tier: 'bronze',
              can_withdraw: false,
            })
            .select()
            .single();
          
          if (newTier) {
            setTier(newTier);
          }
        }
      } catch (error) {
        console.error('Error fetching tier:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTier();
  }, [user]);

  if (loading || !tier) {
    return (
      <Card className="bg-gaming-card/90 border-border p-4">
        <div className="animate-pulse">Loading profile...</div>
      </Card>
    );
  }

  const tierInfo = TIER_INFO[tier.tier];
  const Icon = tierInfo.icon;
  const progress = tierInfo.nextTierDeposits
    ? ((tier.lifetime_deposits - tierInfo.minDeposits) / (tierInfo.nextTierDeposits - tierInfo.minDeposits)) * 100
    : 100;

  return (
    <Card className="bg-gaming-card/90 border-border p-6">
      <div className="space-y-4">
        {/* Tier Display */}
        <div className="flex items-center gap-4">
          <div className={`${tierInfo.bgColor} ${tierInfo.borderColor} border-2 rounded-full p-4`}>
            <Icon className={`w-8 h-8 ${tierInfo.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold">{tierInfo.name} Tier</h3>
              <Badge variant={tier.can_withdraw ? 'default' : 'secondary'}>
                {tier.can_withdraw ? 'Can Withdraw' : 'No Withdrawal'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Lifetime Deposits: ${tier.lifetime_deposits.toFixed(2)}
            </p>
            {tierInfo.nextTier && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    Progress to {tierInfo.nextTier}
                  </span>
                  <span className="text-muted-foreground">
                    ${tier.lifetime_deposits.toFixed(2)} / ${tierInfo.nextTierDeposits}
                  </span>
                </div>
                <Progress value={Math.min(progress, 100)} className="h-2" />
              </div>
            )}
          </div>
        </div>

        {/* Tier Benefits */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-semibold mb-2">Tier Benefits:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {tier.tier === 'bronze' && (
              <>
                <li>• Access to all premium games</li>
                <li>• $111 welcome bonus</li>
                <li>• Cannot withdraw (minimum $30 deposit for Silver)</li>
              </>
            )}
            {tier.tier === 'silver' && (
              <>
                <li>• All Bronze benefits</li>
                <li>• Can withdraw winnings</li>
                <li>• Higher RTP (96.5%)</li>
                <li>• Priority customer support</li>
              </>
            )}
            {tier.tier === 'gold' && (
              <>
                <li>• All Silver benefits</li>
                <li>• Higher RTP (97.0%)</li>
                <li>• Exclusive promotions</li>
                <li>• Personal account manager</li>
              </>
            )}
            {tier.tier === 'platinum' && (
              <>
                <li>• All Gold benefits</li>
                <li>• Highest RTP (97.5%)</li>
                <li>• VIP events and rewards</li>
                <li>• Custom withdrawal limits</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </Card>
  );
};

