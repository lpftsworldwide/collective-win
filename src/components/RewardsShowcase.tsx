import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Trophy, Crown, Sparkles, Star, Zap } from "lucide-react";

export const RewardsShowcase = () => {
  const rewards = [
    {
      icon: <Gift className="w-6 h-6" />,
      title: "$111 Welcome Bonus",
      description: "Instant credit on signup",
      color: "from-premium-gold to-ancient-bronze",
      badge: "NEW PLAYER",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "VIP Rewards Program",
      description: "Exclusive perks & cashback",
      color: "from-mystic-purple to-mystic-red",
      badge: "VIP",
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Daily Challenges",
      description: "Complete tasks, earn rewards",
      color: "from-turquoise to-emerald",
      badge: "DAILY",
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Loyalty Points",
      description: "Earn points with every spin",
      color: "from-premium-gold to-turquoise",
      badge: "LOYALTY",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Flash Bonuses",
      description: "Surprise rewards throughout the day",
      color: "from-mystic-red to-premium-gold",
      badge: "FLASH",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Jackpot Pool",
      description: "Join the progressive jackpot",
      color: "from-premium-gold via-ancient-bronze to-premium-gold",
      badge: "JACKPOT",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-premium-gold/10 border border-premium-gold/30 mb-4">
          <Crown className="w-5 h-5 text-premium-gold" />
          <span className="text-sm text-premium-gold font-medium font-cinzel">Royal Rewards</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-premium-gold mb-2">
          The Collective's Bounty
        </h2>
        <p className="text-muted-foreground font-crimson max-w-2xl mx-auto">
          Ancient treasures await those who join the Collective. Claim your rewards and ascend to greatness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward, i) => (
          <Card
            key={i}
            className="bg-gradient-to-br from-gaming-card to-gaming-dark border-premium-gold/30 tarot-card hover:border-premium-gold/50 transition-all hover:scale-105"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${reward.color} text-gaming-dark`}>
                  {reward.icon}
                </div>
                <Badge className="bg-premium-gold/20 text-premium-gold border-premium-gold/40 text-xs">
                  {reward.badge}
                </Badge>
              </div>
              <CardTitle className="text-premium-gold font-cinzel mt-4">
                {reward.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground font-crimson text-sm">
                {reward.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

