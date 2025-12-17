import { useState, useEffect } from "react";
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
  Ticket,
  Trophy,
  Clock,
  Users,
  DollarSign,
  Star,
  Flame
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const Raffle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 45, seconds: 32 });
  const [ticketCount, setTicketCount] = useState(0);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; hours = 0; minutes = 0; seconds = 0; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const prizes = [
    { place: "🥇 1st", prize: "$50,000 Cash", tickets: 1 },
    { place: "🥈 2nd", prize: "$25,000 Cash", tickets: 1 },
    { place: "🥉 3rd", prize: "$10,000 Cash", tickets: 1 },
    { place: "4th-10th", prize: "$1,000 Each", tickets: 7 },
    { place: "11th-50th", prize: "$200 Each", tickets: 40 },
    { place: "51st-100th", prize: "$50 + 50 Spins", tickets: 50 },
  ];

  const recentWinners = [
    { name: "Lucky_Dragon88", prize: "$25,000", time: "2 days ago" },
    { name: "GoldRush_King", prize: "$10,000", time: "5 days ago" },
    { name: "MysticPharaoh", prize: "$5,000", time: "1 week ago" },
    { name: "DiamondQueen", prize: "$2,500", time: "2 weeks ago" },
  ];

  const howToEarn = [
    { action: "Deposit $50+", tickets: 1, icon: DollarSign },
    { action: "Deposit $100+", tickets: 3, icon: DollarSign },
    { action: "Deposit $500+", tickets: 10, icon: DollarSign },
    { action: "Daily Login", tickets: 1, icon: Clock },
    { action: "Refer a Friend", tickets: 5, icon: Users },
    { action: "VIP Gold+", tickets: "2x Bonus", icon: Crown },
  ];

  const handleClaimTicket = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setTicketCount(prev => prev + 1);
    toast.success("🎟️ You earned 1 raffle ticket!");
  };

  return (
    <div className="min-h-screen bg-background hieroglyph-bg">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(0_70%_20%/0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(45_85%_20%/0.4),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="border-b border-premium-gold/20 bg-gaming-dark/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mystic-red via-premium-gold to-mystic-red" />
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
            <h1 className="font-cinzel text-xl text-premium-gold font-bold">$100K Drop Party</h1>
            <Badge variant="outline" className="border-mystic-red/50 text-mystic-red">
              <Ticket className="w-3 h-3 mr-1" />
              {ticketCount} Tickets
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Banner */}
        <Card className="bg-gradient-to-r from-mystic-red/30 via-premium-gold/20 to-mystic-red/30 border-premium-gold/50 mb-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsMjE1LDAsLjEpIi8+PC9zdmc+')] opacity-30" />
          <CardContent className="p-8 md:p-12 text-center relative">
            <Badge className="bg-mystic-red text-white mb-4 animate-pulse text-lg px-4 py-1">
              <Flame className="w-4 h-4 mr-1" />
              LIVE NOW
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-premium-gold mb-2 glow-gold-text">
              $100,000
            </h1>
            <h2 className="text-2xl md:text-3xl font-cinzel text-foreground mb-6">
              MEGA DROP PARTY
            </h2>
            
            {/* Countdown */}
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="bg-gaming-dark/80 rounded-lg p-3 border border-premium-gold/30">
                  <p className="text-2xl md:text-3xl font-bold text-premium-gold">{String(item.value).padStart(2, '0')}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-mystic-red to-premium-gold text-white font-bold text-lg px-8"
                onClick={handleClaimTicket}
              >
                <Ticket className="w-5 h-5 mr-2" />
                Get Free Ticket
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-premium-gold/50 text-premium-gold hover:bg-premium-gold/10"
                onClick={() => navigate('/deposit')}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Deposit for More Tickets
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prize Pool */}
          <div className="lg:col-span-2">
            <Card className="bg-gaming-card border-premium-gold/30">
              <CardHeader>
                <CardTitle className="font-cinzel text-premium-gold flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Prize Breakdown
                </CardTitle>
                <CardDescription>100 winners will share $100,000 in cash and prizes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prizes.map((prize, index) => (
                    <div 
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        index === 0 ? 'bg-premium-gold/20 border border-premium-gold/50' :
                        index === 1 ? 'bg-gray-400/10 border border-gray-400/30' :
                        index === 2 ? 'bg-amber-600/10 border border-amber-600/30' :
                        'bg-gaming-dark/50 border border-border/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold">{prize.place}</span>
                        <span className={`font-bold ${
                          index === 0 ? 'text-premium-gold text-xl' :
                          index === 1 ? 'text-gray-300' :
                          index === 2 ? 'text-amber-500' :
                          'text-foreground'
                        }`}>
                          {prize.prize}
                        </span>
                      </div>
                      <Badge variant="outline" className="border-turquoise/50 text-turquoise">
                        {prize.tickets} {prize.tickets === 1 ? 'Winner' : 'Winners'}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Progress bar to goal */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Entries Received</span>
                    <span className="text-premium-gold font-bold">24,567 / 50,000</span>
                  </div>
                  <Progress value={49} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Draw triggers at 50,000 entries or countdown end - whichever comes first!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How to Earn Tickets */}
            <Card className="bg-gaming-card border-premium-gold/30">
              <CardHeader className="pb-2">
                <CardTitle className="font-cinzel text-premium-gold text-lg flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Earn Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {howToEarn.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-gaming-dark/50">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-turquoise" />
                        <span className="text-sm text-foreground">{item.action}</span>
                      </div>
                      <Badge variant="outline" className="border-premium-gold/50 text-premium-gold text-xs">
                        +{item.tickets}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Winners */}
            <Card className="bg-gaming-card border-premium-gold/30">
              <CardHeader className="pb-2">
                <CardTitle className="font-cinzel text-premium-gold text-lg flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Recent Winners
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentWinners.map((winner, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-gaming-dark/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{winner.name}</p>
                      <p className="text-xs text-muted-foreground">{winner.time}</p>
                    </div>
                    <span className="text-premium-gold font-bold">{winner.prize}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Your Tickets */}
            <Card className="bg-gradient-to-br from-premium-gold/20 to-ancient-bronze/20 border-premium-gold/50">
              <CardContent className="p-6 text-center">
                <Ticket className="w-12 h-12 text-premium-gold mx-auto mb-3" />
                <h3 className="font-cinzel font-bold text-premium-gold text-lg mb-1">Your Tickets</h3>
                <p className="text-4xl font-bold text-foreground mb-2">{ticketCount}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  More tickets = higher chances!
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-bold"
                  onClick={() => navigate('/deposit')}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Deposit for Tickets
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Raffle;
