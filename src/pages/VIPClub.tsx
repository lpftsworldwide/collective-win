import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Crown, 
  Sparkles, 
  Gift,
  Star,
  Trophy,
  Zap,
  Gem,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Percent,
  Award
} from "lucide-react";
import { Footer } from "@/components/Footer";

const VIPClub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch VIP profile
  const { data: vipData } = useQuery({
    queryKey: ['vip-profile-full', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('vip_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const tiers = [
    {
      name: "Bronze",
      icon: "🥉",
      color: "from-amber-600 to-amber-800",
      requirement: "$0 - $5,000 wagered",
      cashback: "0.5%",
      bonusMultiplier: "1x",
      perks: ["Daily free spins (5)", "Email support", "Standard withdrawals"],
      points: 0
    },
    {
      name: "Silver",
      icon: "🥈",
      color: "from-gray-300 to-gray-500",
      requirement: "$5,000 - $25,000 wagered",
      cashback: "1%",
      bonusMultiplier: "1.5x",
      perks: ["Daily free spins (15)", "Priority email support", "Faster withdrawals", "Monthly bonus"],
      points: 5000
    },
    {
      name: "Gold",
      icon: "🥇",
      color: "from-premium-gold to-ancient-bronze",
      requirement: "$25,000 - $100,000 wagered",
      cashback: "1.5%",
      bonusMultiplier: "2x",
      perks: ["Daily free spins (25)", "24/7 live chat support", "Express withdrawals", "Weekly bonus", "Exclusive tournaments"],
      points: 25000
    },
    {
      name: "Platinum",
      icon: "💎",
      color: "from-slate-300 to-slate-500",
      requirement: "$100,000 - $500,000 wagered",
      cashback: "2%",
      bonusMultiplier: "2.5x",
      perks: ["Daily free spins (50)", "Personal account manager", "Instant withdrawals", "Custom bonuses", "VIP events access", "Birthday bonus"],
      points: 100000
    },
    {
      name: "Diamond",
      icon: "👑",
      color: "from-cyan-400 to-blue-500",
      requirement: "$500,000+ wagered",
      cashback: "2.5%",
      bonusMultiplier: "3x",
      perks: ["Unlimited free spins", "Dedicated VIP host", "Priority payouts", "Bespoke bonuses", "Luxury gifts", "Exclusive trips", "No limits"],
      points: 500000
    }
  ];

  const currentTier = vipData?.tier || 'bronze';
  const currentTierIndex = tiers.findIndex(t => t.name.toLowerCase() === currentTier);
  const nextTier = tiers[currentTierIndex + 1];
  const totalWagered = vipData?.total_wagered || 0;
  const progressToNext = nextTier 
    ? Math.min(100, (totalWagered / nextTier.points) * 100)
    : 100;

  const exclusiveRewards = [
    { name: "Weekly Cashback", description: "Get back a percentage of your net losses every Monday", icon: Percent, value: `${vipData?.cashback_rate || 0.5}%` },
    { name: "Bonus Multiplier", description: "All deposit bonuses are multiplied by your tier level", icon: TrendingUp, value: `${vipData?.weekly_bonus_multiplier || 1}x` },
    { name: "Free Spins Bank", description: "Accumulated free spins ready to use", icon: Zap, value: `${vipData?.free_spins_balance || 0}` },
    { name: "VIP Points", description: "Earn points on every wager to unlock exclusive rewards", icon: Star, value: `${(vipData?.points || 0).toLocaleString()}` },
  ];

  const recentRewards = [
    { type: "Cashback", amount: "$125.50", date: "2 days ago", status: "Credited" },
    { type: "Free Spins", amount: "50 Spins", date: "5 days ago", status: "Claimed" },
    { type: "Bonus", amount: "$500.00", date: "1 week ago", status: "Wagered" },
    { type: "Birthday Gift", amount: "$200.00", date: "2 weeks ago", status: "Credited" },
  ];

  return (
    <div className="min-h-screen bg-background hieroglyph-bg">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(45_85%_20%/0.4),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(270_50%_15%/0.3),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="border-b border-premium-gold/20 bg-gaming-dark/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-premium-gold via-ancient-bronze to-premium-gold" />
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-premium-gold hover:bg-premium-gold/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="font-cinzel text-xl text-premium-gold font-bold flex items-center gap-2">
              <Crown className="w-5 h-5" />
              VIP Club
            </h1>
            <Badge className={`bg-gradient-to-r ${tiers[currentTierIndex]?.color} text-white capitalize`}>
              {currentTier}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-premium-gold/10 border border-premium-gold/30 mb-4">
            <Crown className="w-4 h-4 text-premium-gold" />
            <span className="text-sm text-premium-gold font-medium">Exclusive Membership</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-premium-gold mb-2">
            VIP Rewards Program
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Elevate your gaming experience with exclusive perks, personalized bonuses, and VIP treatment
          </p>
        </div>

        {/* Current Status Card */}
        {user && (
          <Card className="bg-gradient-to-br from-gaming-card via-premium-gold/5 to-gaming-card border-premium-gold/30 mb-8 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Tier */}
                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground mb-2">Current Tier</p>
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${tiers[currentTierIndex]?.color} flex items-center justify-center text-3xl shadow-lg`}>
                      {tiers[currentTierIndex]?.icon}
                    </div>
                    <div>
                      <p className="text-2xl font-cinzel font-bold text-premium-gold capitalize">{currentTier}</p>
                      <p className="text-sm text-muted-foreground">Member</p>
                    </div>
                  </div>
                </div>

                {/* Progress to Next */}
                <div className="md:col-span-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress to {nextTier?.name || 'Max Level'}</span>
                    <span className="text-premium-gold font-bold">{progressToNext.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressToNext} className="h-4 mb-3" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Wagered: ${totalWagered.toLocaleString()}</span>
                    {nextTier && <span>Next tier: ${nextTier.points.toLocaleString()}</span>}
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
                {exclusiveRewards.map((reward, index) => {
                  const Icon = reward.icon;
                  return (
                    <div key={index} className="text-center p-3 rounded-lg bg-gaming-dark/50">
                      <Icon className="w-5 h-5 text-premium-gold mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">{reward.name}</p>
                      <p className="text-lg font-bold text-foreground">{reward.value}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="tiers" className="space-y-6">
          <TabsList className="bg-gaming-dark/50 w-full justify-start overflow-x-auto">
            <TabsTrigger value="tiers" className="data-[state=active]:bg-premium-gold/20 data-[state=active]:text-premium-gold">
              <Award className="w-4 h-4 mr-2" />
              Tier Benefits
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-turquoise/20 data-[state=active]:text-turquoise">
              <Gift className="w-4 h-4 mr-2" />
              My Rewards
            </TabsTrigger>
            <TabsTrigger value="perks" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
              <Sparkles className="w-4 h-4 mr-2" />
              Exclusive Perks
            </TabsTrigger>
          </TabsList>

          {/* Tier Benefits Tab */}
          <TabsContent value="tiers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {tiers.map((tier, index) => {
                const isCurrentTier = tier.name.toLowerCase() === currentTier;
                const isLocked = index > currentTierIndex;
                
                return (
                  <Card 
                    key={tier.name}
                    className={`relative overflow-hidden transition-all ${
                      isCurrentTier 
                        ? 'border-premium-gold ring-2 ring-premium-gold/50' 
                        : isLocked 
                          ? 'opacity-60 border-border/30' 
                          : 'border-border/50 hover:border-premium-gold/30'
                    }`}
                  >
                    {isCurrentTier && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-premium-gold text-gaming-dark text-xs">Current</Badge>
                      </div>
                    )}
                    <div className={`h-2 bg-gradient-to-r ${tier.color}`} />
                    <CardContent className="p-4">
                      <div className="text-center mb-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center text-2xl mx-auto mb-2`}>
                          {tier.icon}
                        </div>
                        <h3 className="font-cinzel font-bold text-lg text-foreground">{tier.name}</h3>
                        <p className="text-xs text-muted-foreground">{tier.requirement}</p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cashback</span>
                          <span className="text-premium-gold font-bold">{tier.cashback}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Bonus</span>
                          <span className="text-turquoise font-bold">{tier.bonusMultiplier}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {tier.perks.slice(0, 3).map((perk, perkIndex) => (
                          <div key={perkIndex} className="flex items-center gap-2 text-xs">
                            <Star className="w-3 h-3 text-premium-gold flex-shrink-0" />
                            <span className="text-muted-foreground">{perk}</span>
                          </div>
                        ))}
                        {tier.perks.length > 3 && (
                          <p className="text-xs text-premium-gold">+{tier.perks.length - 3} more perks</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* My Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            {user ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Rewards */}
                <Card className="bg-gaming-card border-premium-gold/30">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-premium-gold flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      Available Rewards
                    </CardTitle>
                    <CardDescription>Claim your exclusive VIP rewards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-turquoise/10 border border-turquoise/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-turquoise">Weekly Cashback</span>
                        <Badge className="bg-turquoise/20 text-turquoise">Ready</Badge>
                      </div>
                      <p className="text-2xl font-bold text-foreground mb-2">$0.00</p>
                      <Button size="sm" className="w-full bg-turquoise hover:bg-turquoise/90 text-white">
                        Claim Cashback
                      </Button>
                    </div>

                    <div className="p-4 rounded-lg bg-premium-gold/10 border border-premium-gold/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-premium-gold">Free Spins</span>
                        <Badge className="bg-premium-gold/20 text-premium-gold">{vipData?.free_spins_balance || 0} Available</Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full border-premium-gold/50 text-premium-gold">
                        Use Free Spins
                      </Button>
                    </div>

                    <div className="p-4 rounded-lg bg-mystic-red/10 border border-mystic-red/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-mystic-red">VIP Points Shop</span>
                        <Badge className="bg-mystic-red/20 text-mystic-red">{(vipData?.points || 0).toLocaleString()} pts</Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full border-mystic-red/50 text-mystic-red">
                        Browse Shop
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Rewards */}
                <Card className="bg-gaming-card border-border/50">
                  <CardHeader>
                    <CardTitle className="font-cinzel text-foreground flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Reward History
                    </CardTitle>
                    <CardDescription>Your recent VIP rewards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentRewards.map((reward, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gaming-dark/50">
                          <div>
                            <p className="font-medium text-foreground">{reward.type}</p>
                            <p className="text-xs text-muted-foreground">{reward.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-premium-gold">{reward.amount}</p>
                            <Badge variant="outline" className="text-xs">{reward.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-gaming-card border-premium-gold/30">
                <CardContent className="p-8 text-center">
                  <Crown className="w-16 h-16 text-premium-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-cinzel font-bold text-premium-gold mb-2">Join the VIP Club</h3>
                  <p className="text-muted-foreground mb-6">Sign up to start earning VIP rewards and exclusive perks</p>
                  <Button 
                    className="bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-bold"
                    onClick={() => navigate('/auth')}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Sign Up Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Exclusive Perks Tab */}
          <TabsContent value="perks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Personal Account Manager", description: "Dedicated support for Gold+ members", icon: Users, tier: "Gold+" },
                { title: "Exclusive Tournaments", description: "VIP-only competitions with massive prize pools", icon: Trophy, tier: "Silver+" },
                { title: "Custom Bonuses", description: "Tailored offers based on your play style", icon: Gift, tier: "Platinum+" },
                { title: "Priority Withdrawals", description: "Express processing for faster payouts", icon: Zap, tier: "Gold+" },
                { title: "Birthday Rewards", description: "Special bonus on your birthday", icon: Sparkles, tier: "Silver+" },
                { title: "Luxury Experiences", description: "Trips, gadgets, and exclusive gifts", icon: Gem, tier: "Diamond" },
                { title: "Higher Limits", description: "Increased bet and withdrawal limits", icon: TrendingUp, tier: "Platinum+" },
                { title: "Referral Bonuses", description: "Extra rewards when friends join", icon: Users, tier: "All Tiers" },
                { title: "Loyalty Protection", description: "Never lose your VIP status once earned", icon: Shield, tier: "Gold+" },
              ].map((perk, index) => (
                <Card key={index} className="bg-gaming-card border-border/50 hover:border-premium-gold/30 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-premium-gold/10">
                        <perk.icon className="w-5 h-5 text-premium-gold" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-foreground">{perk.title}</h3>
                          <Badge variant="outline" className="text-xs border-turquoise/50 text-turquoise">
                            {perk.tier}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{perk.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-8 bg-gradient-to-r from-premium-gold/20 via-ancient-bronze/20 to-premium-gold/20 border-premium-gold/50">
          <CardContent className="p-8 text-center">
            <Crown className="w-12 h-12 text-premium-gold mx-auto mb-4" />
            <h2 className="text-2xl font-cinzel font-bold text-premium-gold mb-2">
              Start Your VIP Journey Today
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Every wager earns you points toward VIP status. The more you play, the more you're rewarded.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-bold"
                onClick={() => navigate('/deposit')}
              >
                <Zap className="w-5 h-5 mr-2" />
                Deposit & Earn Points
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-premium-gold/50 text-premium-gold hover:bg-premium-gold/10"
                onClick={() => navigate('/#games')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Play Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default VIPClub;
