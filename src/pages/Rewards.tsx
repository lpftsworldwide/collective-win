import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Gift, 
  Crown, 
  Sparkles, 
  Zap,
  Star,
  Trophy,
  Calendar,
  Clock,
  Check,
  Lock
} from "lucide-react";
import { Footer } from "@/components/Footer";

const Rewards = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const dailyRewards = [
    { day: 1, reward: "$5 Bonus", claimed: true, icon: Gift },
    { day: 2, reward: "10 Free Spins", claimed: true, icon: Zap },
    { day: 3, reward: "$10 Bonus", claimed: false, isToday: true, icon: Gift },
    { day: 4, reward: "25 Free Spins", claimed: false, icon: Zap },
    { day: 5, reward: "$25 Bonus", claimed: false, icon: Gift },
    { day: 6, reward: "50 Free Spins", claimed: false, icon: Zap },
    { day: 7, reward: "$100 + 100 Spins", claimed: false, icon: Crown },
  ];

  const bonusOffers = [
    {
      id: 1,
      title: "First Deposit Bonus",
      description: "200% match up to $500 + 100 Free Spins",
      code: "WINNER200",
      expires: "Limited Time",
      available: !user,
    },
    {
      id: 2,
      title: "Reload Weekend",
      description: "50% reload bonus every Saturday & Sunday",
      code: "WEEKEND50",
      expires: "Every Weekend",
      available: true,
    },
    {
      id: 3,
      title: "High Roller Bonus",
      description: "Get 100% up to $2,000 on deposits over $500",
      code: "HIGHROLLER",
      expires: "Ongoing",
      available: true,
    },
    {
      id: 4,
      title: "Free Spins Tuesday",
      description: "50 Free Spins on selected slots every Tuesday",
      code: "SPINDAY",
      expires: "Every Tuesday",
      available: true,
    },
  ];

  const achievements = [
    { name: "First Win", description: "Win your first game", progress: 100, reward: "$5", unlocked: true },
    { name: "Hot Streak", description: "Win 5 games in a row", progress: 60, reward: "$20", unlocked: false },
    { name: "High Roller", description: "Wager $1,000 total", progress: 35, reward: "$50", unlocked: false },
    { name: "Lucky 7", description: "Hit 7s on any slot", progress: 0, reward: "100 Spins", unlocked: false },
    { name: "VIP Ascension", description: "Reach Gold VIP tier", progress: 25, reward: "$100", unlocked: false },
    { name: "Community Star", description: "Leave 10 reviews", progress: 40, reward: "$25", unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-background hieroglyph-bg">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(270_50%_15%/0.4),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(45_85%_20%/0.3),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="border-b border-premium-gold/20 bg-gaming-dark/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-premium-gold to-transparent" />
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
            <h1 className="font-cinzel text-xl text-premium-gold font-bold">Rewards & Bonuses</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-premium-gold/10 border border-premium-gold/30 mb-4">
            <Gift className="w-4 h-4 text-premium-gold" />
            <span className="text-sm text-premium-gold font-medium">Daily Rewards</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-premium-gold mb-2">
            Claim Your Treasures
          </h1>
          <p className="text-muted-foreground">Login daily to unlock exclusive bonuses and free spins</p>
        </div>

        {/* Daily Login Rewards */}
        <Card className="bg-gaming-card border-premium-gold/30 mb-8">
          <CardHeader>
            <CardTitle className="font-cinzel text-premium-gold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              7-Day Login Streak
            </CardTitle>
            <CardDescription>Claim rewards for 7 consecutive days to unlock the mega bonus!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 md:gap-4">
              {dailyRewards.map((day, index) => {
                const Icon = day.icon;
                return (
                  <div
                    key={index}
                    className={`relative p-3 md:p-4 rounded-lg text-center transition-all ${
                      day.claimed 
                        ? 'bg-turquoise/20 border border-turquoise/50' 
                        : day.isToday 
                          ? 'bg-premium-gold/20 border-2 border-premium-gold animate-pulse' 
                          : 'bg-gaming-dark/50 border border-border/50'
                    }`}
                  >
                    {day.claimed && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-turquoise rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mb-1">Day {day.day}</p>
                    <Icon className={`w-6 h-6 mx-auto mb-1 ${
                      day.claimed ? 'text-turquoise' : day.isToday ? 'text-premium-gold' : 'text-muted-foreground'
                    }`} />
                    <p className={`text-xs font-medium ${
                      day.claimed ? 'text-turquoise' : day.isToday ? 'text-premium-gold' : 'text-foreground'
                    }`}>
                      {day.reward}
                    </p>
                  </div>
                );
              })}
            </div>
            
            {user ? (
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-bold"
                onClick={() => {}}
              >
                <Gift className="w-4 h-4 mr-2" />
                Claim Today's Reward
              </Button>
            ) : (
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-turquoise to-emerald text-white font-bold"
                onClick={() => navigate('/auth')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Sign Up to Start Claiming
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Bonus Offers */}
        <h2 className="text-2xl font-cinzel font-bold text-premium-gold mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Active Bonus Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {bonusOffers.map((offer) => (
            <Card key={offer.id} className="bg-gaming-card border-premium-gold/30 hover:border-premium-gold/60 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-cinzel font-bold text-lg text-foreground">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground">{offer.description}</p>
                  </div>
                  <Badge variant="outline" className="border-turquoise/50 text-turquoise">
                    <Clock className="w-3 h-3 mr-1" />
                    {offer.expires}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Code:</span>
                    <code className="px-2 py-1 bg-gaming-dark rounded text-premium-gold font-mono text-sm">
                      {offer.code}
                    </code>
                  </div>
                  <Button 
                    size="sm"
                    variant={offer.available ? "default" : "outline"}
                    className={offer.available 
                      ? "bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark" 
                      : "border-border/50 text-muted-foreground"
                    }
                    onClick={() => offer.available && navigate('/deposit')}
                  >
                    {offer.available ? "Claim Now" : "Claimed"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <h2 className="text-2xl font-cinzel font-bold text-premium-gold mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6" />
          Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {achievements.map((achievement, index) => (
            <Card key={index} className={`bg-gaming-card border-premium-gold/30 ${achievement.unlocked ? 'ring-2 ring-turquoise/50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {achievement.unlocked ? (
                      <Star className="w-5 h-5 text-turquoise fill-turquoise" />
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                    <h3 className={`font-medium ${achievement.unlocked ? 'text-turquoise' : 'text-foreground'}`}>
                      {achievement.name}
                    </h3>
                  </div>
                  <Badge variant="outline" className="border-premium-gold/50 text-premium-gold text-xs">
                    {achievement.reward}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                <Progress value={achievement.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1 text-right">{achievement.progress}%</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Raffle CTA */}
        <Card className="bg-gradient-to-r from-mystic-red/20 via-premium-gold/20 to-mystic-red/20 border-premium-gold/50">
          <CardContent className="p-8 text-center">
            <Badge className="bg-mystic-red text-white mb-4 animate-pulse">🎉 MASSIVE GIVEAWAY</Badge>
            <h2 className="text-3xl font-cinzel font-bold text-premium-gold mb-2">
              $100,000 Drop Party
            </h2>
            <p className="text-muted-foreground mb-6">
              Enter the ultimate raffle for a chance to win your share of $100,000 in prizes!
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-mystic-red to-ancient-bronze text-white font-bold"
              onClick={() => navigate('/raffle')}
            >
              <Crown className="w-5 h-5 mr-2" />
              Enter the Raffle Now
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Rewards;
