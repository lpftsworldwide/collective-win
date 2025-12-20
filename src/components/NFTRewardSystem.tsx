import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Gift, Trophy, Star, Zap, Image as ImageIcon, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface NFTReward {
  id: string;
  name: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  imageUrl: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
}

interface UserTier {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  points: number;
  nextTierPoints: number;
}

export const NFTRewardSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userTier, setUserTier] = useState<UserTier | null>(null);
  const [nftRewards, setNftRewards] = useState<NFTReward[]>([]);
  const [loading, setLoading] = useState(true);

  // NFT Rewards by Tier (Perks for tier upgrades)
  const tierRewards: Record<string, NFTReward[]> = {
    bronze: [
      {
        id: 'bronze-badge',
        name: 'Bronze Badge NFT',
        description: 'Exclusive Bronze tier badge - Your first step to greatness',
        tier: 'bronze',
        imageUrl: '/nft-rewards/bronze-badge.png',
        rarity: 'common',
        unlocked: false,
      },
    ],
    silver: [
      {
        id: 'silver-badge',
        name: 'Silver Badge NFT',
        description: 'Rare Silver tier badge - Rising through the ranks',
        tier: 'silver',
        imageUrl: '/nft-rewards/silver-badge.png',
        rarity: 'rare',
        unlocked: false,
      },
      {
        id: 'silver-frame',
        name: 'Silver Profile Frame',
        description: 'Decorative frame for your profile',
        tier: 'silver',
        imageUrl: '/nft-rewards/silver-frame.png',
        rarity: 'common',
        unlocked: false,
      },
    ],
    gold: [
      {
        id: 'gold-badge',
        name: 'Gold Badge NFT',
        description: 'Epic Gold tier badge - You\'re a champion!',
        tier: 'gold',
        imageUrl: '/nft-rewards/gold-badge.png',
        rarity: 'epic',
        unlocked: false,
      },
      {
        id: 'gold-avatar',
        name: 'Golden Avatar',
        description: 'Premium golden avatar customization',
        tier: 'gold',
        imageUrl: '/nft-rewards/gold-avatar.png',
        rarity: 'rare',
        unlocked: false,
      },
      {
        id: 'gold-title',
        name: 'Gold Title',
        description: 'Exclusive "Gold Member" title',
        tier: 'gold',
        imageUrl: '/nft-rewards/gold-title.png',
        rarity: 'common',
        unlocked: false,
      },
    ],
    platinum: [
      {
        id: 'platinum-badge',
        name: 'Platinum Badge NFT',
        description: 'Legendary Platinum tier badge - Elite status achieved',
        tier: 'platinum',
        imageUrl: '/nft-rewards/platinum-badge.png',
        rarity: 'legendary',
        unlocked: false,
      },
      {
        id: 'platinum-crown',
        name: 'Platinum Crown',
        description: 'Royal crown for your profile',
        tier: 'platinum',
        imageUrl: '/nft-rewards/platinum-crown.png',
        rarity: 'epic',
        unlocked: false,
      },
      {
        id: 'platinum-banner',
        name: 'Platinum Banner',
        description: 'Exclusive profile banner',
        tier: 'platinum',
        imageUrl: '/nft-rewards/platinum-banner.png',
        rarity: 'rare',
        unlocked: false,
      },
    ],
    diamond: [
      {
        id: 'diamond-badge',
        name: 'Diamond Badge NFT',
        description: 'Ultimate Diamond tier badge - The pinnacle of achievement',
        tier: 'diamond',
        imageUrl: '/nft-rewards/diamond-badge.png',
        rarity: 'legendary',
        unlocked: false,
      },
      {
        id: 'diamond-crown',
        name: 'Diamond Crown',
        description: 'Ultimate royal crown',
        tier: 'diamond',
        imageUrl: '/nft-rewards/diamond-crown.png',
        rarity: 'legendary',
        unlocked: false,
      },
      {
        id: 'diamond-aura',
        name: 'Diamond Aura',
        description: 'Mystical aura effect for your profile',
        tier: 'diamond',
        imageUrl: '/nft-rewards/diamond-aura.png',
        rarity: 'epic',
        unlocked: false,
      },
      {
        id: 'diamond-title',
        name: 'Diamond Title',
        description: 'Ultimate "Diamond Elite" title',
        tier: 'diamond',
        imageUrl: '/nft-rewards/diamond-title.png',
        rarity: 'legendary',
        unlocked: false,
      },
    ],
  };

  // Fetch user tier and unlocked NFTs
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchTierAndRewards = async () => {
      try {
        // Get user tier from database
        const { data: userData, error } = await supabase
          .from('users')
          .select('tier, loyalty_points')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user tier:', error);
          setUserTier({ tier: 'bronze', points: 0, nextTierPoints: 100 });
        } else {
          const tier = (userData?.tier || 'bronze') as UserTier['tier'];
          const points = userData?.loyalty_points || 0;
          
          // Tier thresholds
          const tierThresholds = {
            bronze: { next: 100 },
            silver: { next: 500 },
            gold: { next: 2000 },
            platinum: { next: 10000 },
            diamond: { next: Infinity },
          };

          setUserTier({
            tier,
            points,
            nextTierPoints: tierThresholds[tier]?.next || Infinity,
          });
        }

        // Get unlocked NFTs (from user_nft_rewards table if it exists)
        // For now, we'll determine unlocked based on tier
        const currentTier = (userData?.tier || 'bronze') as UserTier['tier'];
        const allRewards: NFTReward[] = [];
        
        // Add all rewards up to current tier
        const tierOrder: UserTier['tier'][] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
        const currentTierIndex = tierOrder.indexOf(currentTier);
        
        for (let i = 0; i <= currentTierIndex; i++) {
          const tierKey = tierOrder[i];
          const rewards = tierRewards[tierKey] || [];
          allRewards.push(...rewards.map(r => ({ ...r, unlocked: true })));
        }

        // Add locked rewards from next tiers
        for (let i = currentTierIndex + 1; i < tierOrder.length; i++) {
          const tierKey = tierOrder[i];
          const rewards = tierRewards[tierKey] || [];
          allRewards.push(...rewards);
        }

        setNftRewards(allRewards);
      } catch (error) {
        console.error('Error fetching NFT rewards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTierAndRewards();
  }, [user]);

  const getRarityColor = (rarity: NFTReward['rarity']) => {
    const colors = {
      common: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      rare: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      epic: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      legendary: 'bg-premium-gold/20 text-premium-gold border-premium-gold/30',
    };
    return colors[rarity];
  };

  const getRarityBadge = (rarity: NFTReward['rarity']) => {
    const badges = {
      common: 'Common',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary',
    };
    return badges[rarity];
  };

  if (!user) {
    return (
      <Card className="bg-gaming-card border-premium-gold/30">
        <CardHeader>
          <CardTitle className="text-premium-gold flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            NFT Rewards
          </CardTitle>
          <CardDescription>
            Sign up to start earning exclusive NFT rewards as you level up!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Unlock exclusive NFT badges, frames, and titles as you progress through tiers.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="bg-gaming-card border-premium-gold/30">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading NFT rewards...</div>
        </CardContent>
      </Card>
    );
  }

  const unlockedCount = nftRewards.filter(r => r.unlocked).length;
  const totalCount = nftRewards.length;
  const progress = userTier ? ((userTier.points / userTier.nextTierPoints) * 100) : 0;

  return (
    <Card className="bg-gaming-card border-premium-gold/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-premium-gold flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              NFT Rewards Collection
            </CardTitle>
            <CardDescription className="mt-1">
              Exclusive perks unlocked through tier progression
            </CardDescription>
          </div>
          <Badge className="bg-premium-gold/20 text-premium-gold border-premium-gold/30">
            {unlockedCount}/{totalCount} Unlocked
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tier Progress */}
        {userTier && (
          <div className="p-4 rounded-lg bg-background/50 border border-premium-gold/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown className={`w-5 h-5 ${
                  userTier.tier === 'diamond' ? 'text-premium-gold' :
                  userTier.tier === 'platinum' ? 'text-purple-400' :
                  userTier.tier === 'gold' ? 'text-yellow-400' :
                  userTier.tier === 'silver' ? 'text-gray-300' :
                  'text-orange-400'
                }`} />
                <span className="font-bold capitalize text-premium-gold">
                  {userTier.tier} Tier
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {userTier.points} / {userTier.nextTierPoints === Infinity ? '∞' : userTier.nextTierPoints} points
              </span>
            </div>
            <div className="w-full bg-gaming-dark rounded-full h-2">
              <div
                className="bg-gradient-to-r from-premium-gold to-amber-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {userTier.nextTierPoints === Infinity 
                ? 'You\'ve reached the highest tier!'
                : `Earn ${userTier.nextTierPoints - userTier.points} more points to unlock next tier rewards`
              }
            </p>
          </div>
        )}

        {/* NFT Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {nftRewards.map((nft) => (
            <Card
              key={nft.id}
              className={`relative overflow-hidden border-2 transition-all ${
                nft.unlocked
                  ? 'border-premium-gold/50 bg-premium-gold/5 hover:border-premium-gold'
                  : 'border-border/30 bg-gaming-dark/50 opacity-60'
              }`}
            >
              {/* NFT Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-mystic-purple/20 to-premium-gold/20 flex items-center justify-center relative">
                {nft.unlocked ? (
                  <>
                    <ImageIcon className="w-12 h-12 text-premium-gold/50" />
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getRarityColor(nft.rarity)} text-xs`}>
                        {getRarityBadge(nft.rarity)}
                      </Badge>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  </>
                )}
              </div>
              
              <CardContent className="p-3">
                <h4 className={`font-bold text-sm mb-1 ${nft.unlocked ? 'text-premium-gold' : 'text-muted-foreground'}`}>
                  {nft.name}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {nft.description}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <Badge variant="outline" className="text-[10px] capitalize border-premium-gold/30 text-premium-gold">
                    {nft.tier}
                  </Badge>
                  {nft.unlocked && (
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                      ✓ Unlocked
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info */}
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-start gap-3">
            <Gift className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold text-emerald-300 mb-1">NFT Rewards System</p>
              <p>
                Earn exclusive NFT badges, frames, and titles as you progress through VIP tiers. 
                These are digital collectibles that showcase your achievements - no blockchain required!
                Play games, earn loyalty points, and unlock rewards automatically when you reach new tiers.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

