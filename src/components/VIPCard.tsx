import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { VIPBadge } from "./VIPBadge";
import { Crown, Gift, Percent, Zap, Star, TrendingUp, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface VIPTier {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  minWager: number;
  cashback: number;
  bonusMultiplier: number;
  perks: string[];
}

const vipTiers: VIPTier[] = [
  { tier: 'bronze', minWager: 0, cashback: 0.5, bonusMultiplier: 1.0, perks: ['Basic Support', 'Weekly Bonus'] },
  { tier: 'silver', minWager: 5000, cashback: 1.0, bonusMultiplier: 1.5, perks: ['Priority Support', 'Birthday Bonus', '10 Free Spins Weekly'] },
  { tier: 'gold', minWager: 25000, cashback: 1.5, bonusMultiplier: 2.0, perks: ['VIP Manager', 'Exclusive Promotions', '25 Free Spins Weekly'] },
  { tier: 'platinum', minWager: 100000, cashback: 2.0, bonusMultiplier: 2.5, perks: ['Dedicated Manager', 'Luxury Gifts', '50 Free Spins Weekly', 'Faster Withdrawals'] },
  { tier: 'diamond', minWager: 500000, cashback: 2.5, bonusMultiplier: 3.0, perks: ['Elite Concierge', 'VIP Events', '100 Free Spins Weekly', 'Instant Withdrawals', 'Personalized Bonuses'] },
];

interface VIPCardProps {
  currentTier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  totalWagered?: number;
  points?: number;
}

export const VIPCard = ({ currentTier = 'bronze', totalWagered = 0, points = 0 }: VIPCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const currentTierIndex = vipTiers.findIndex(t => t.tier === currentTier);
  const currentTierData = vipTiers[currentTierIndex];
  const nextTierData = vipTiers[currentTierIndex + 1];
  
  const progressToNext = nextTierData 
    ? Math.min(100, ((totalWagered - currentTierData.minWager) / (nextTierData.minWager - currentTierData.minWager)) * 100)
    : 100;
  
  const amountToNext = nextTierData ? nextTierData.minWager - totalWagered : 0;

  if (!user) {
    return (
      <Card className="bg-gradient-to-br from-premium-gold/10 via-gaming-card to-mystic-purple/10 border-premium-gold/30 tarot-card overflow-hidden">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-premium-gold/20 glow-gold">
              <Crown className="w-10 h-10 text-premium-gold" />
            </div>
          </div>
          <CardTitle className="text-2xl font-cinzel text-premium-gold">VIP Royalty Program</CardTitle>
          <p className="text-muted-foreground font-crimson">Join now and claim your $111 sacred bonus!</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-lg bg-background/50 border border-border/50">
              <Percent className="w-5 h-5 text-emerald mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Up to</p>
              <p className="text-lg font-cinzel font-bold text-emerald">2.5% Cashback</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-border/50">
              <Gift className="w-5 h-5 text-premium-gold mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Up to</p>
              <p className="text-lg font-cinzel font-bold text-premium-gold">3x Bonus</p>
            </div>
          </div>
          
          <Button 
            onClick={() => navigate('/auth')}
            className="w-full bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-cinzel font-bold py-6 glow-gold"
          >
            <Crown className="w-5 h-5 mr-2" />
            Join VIP & Claim $111 Bonus
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-premium-gold/10 via-gaming-card to-mystic-purple/10 border-premium-gold/30 tarot-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-premium-gold font-cinzel flex items-center gap-2">
            <Eye className="w-5 h-5 animate-eye-pulse" />
            Your VIP Status
          </CardTitle>
          <VIPBadge tier={currentTier} size="lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Points */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-premium-gold" />
            <span className="text-muted-foreground">VIP Points</span>
          </div>
          <span className="text-xl font-cinzel font-bold text-premium-gold">{points.toLocaleString()}</span>
        </div>

        {/* Progress to next tier */}
        {nextTierData && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to {nextTierData.tier}</span>
              <span className="text-premium-gold font-bold">{progressToNext.toFixed(1)}%</span>
            </div>
            <Progress value={progressToNext} className="h-3 bg-gaming-dark" />
            <p className="text-xs text-muted-foreground text-center">
              Wager ${amountToNext.toLocaleString()} more to reach <VIPBadge tier={nextTierData.tier} size="sm" />
            </p>
          </div>
        )}

        {/* Current Benefits */}
        <div className="space-y-3">
          <h4 className="font-cinzel font-bold text-foreground flex items-center gap-2">
            <Gift className="w-4 h-4 text-premium-gold" />
            Your Benefits
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-emerald/10 border border-emerald/30 text-center">
              <p className="text-xs text-muted-foreground">Cashback</p>
              <p className="font-cinzel font-bold text-emerald">{currentTierData.cashback}%</p>
            </div>
            <div className="p-2 rounded-lg bg-premium-gold/10 border border-premium-gold/30 text-center">
              <p className="text-xs text-muted-foreground">Bonus Multi</p>
              <p className="font-cinzel font-bold text-premium-gold">{currentTierData.bonusMultiplier}x</p>
            </div>
          </div>
          <div className="space-y-1">
            {currentTierData.perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <Zap className="w-3 h-3 text-turquoise" />
                <span className="text-muted-foreground">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
