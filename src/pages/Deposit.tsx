import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Wallet, 
  CreditCard, 
  Building2, 
  Bitcoin, 
  Sparkles,
  Shield,
  Gift,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Clock,
  Crown
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const Deposit = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { play } = useSoundEffects();

  // Fetch user balance
  const { data: userData } = useQuery({
    queryKey: ['user-balance', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('users')
        .select('total_balance_aud, bonus_balance, is_bonus_claimed')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch VIP profile
  const { data: vipData } = useQuery({
    queryKey: ['vip-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('vip_profiles')
        .select('tier, points, cashback_rate, free_spins_balance')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Redirect to auth if not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center hieroglyph-bg">
        <Card className="max-w-md w-full mx-4 bg-gaming-card border-premium-gold/30">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-premium-gold to-ancient-bronze flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-gaming-dark" />
            </div>
            <CardTitle className="text-2xl font-cinzel text-premium-gold">Sacred Treasury</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-bold"
              onClick={() => navigate('/auth')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const payIdDetails = {
    payId: "pay@collectivewinners.org",
    bsb: "062-000",
    accountNumber: "12345678",
    accountName: "COLLECTIVE WINNERS PTY LTD"
  };

  const quickAmounts = [50, 100, 200, 500, 1000, 2000];

  const handleCopyPayId = () => {
    navigator.clipboard.writeText(payIdDetails.payId);
    setCopied(true);
    toast.success("PayID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeposit = () => {
    if (!amount || parseFloat(amount) < 20) {
      toast.error("Minimum deposit is $20 AUD");
      return;
    }
    play("deposit"); // Play deposit confirmation sound
    toast.success(`Deposit of $${amount} AUD initiated! Funds will appear within 5 minutes.`);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond': return 'from-cyan-400 to-blue-500';
      case 'platinum': return 'from-slate-300 to-slate-500';
      case 'gold': return 'from-premium-gold to-ancient-bronze';
      case 'silver': return 'from-gray-300 to-gray-500';
      default: return 'from-amber-600 to-amber-800';
    }
  };

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
              Back to Games
            </Button>
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
              <span className="font-cinzel text-premium-gold font-bold hidden sm:inline">Collective Winners</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-premium-gold/10 border border-premium-gold/30 mb-4">
              <Wallet className="w-4 h-4 text-premium-gold" />
              <span className="text-sm text-premium-gold font-medium">Sacred Treasury</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-premium-gold mb-2">
              Fund Your Journey
            </h1>
            <p className="text-muted-foreground">Instant deposits with PayID • No fees • Secure & Private</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Account Overview */}
            <div className="space-y-6">
              {/* Balance Card */}
              <Card className="bg-gradient-to-br from-gaming-card to-gaming-dark border-premium-gold/30 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-premium-gold via-ancient-bronze to-premium-gold" />
                <CardHeader>
                  <CardTitle className="text-lg font-cinzel text-premium-gold flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Account Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
                    <p className="text-4xl font-bold text-premium-gold glow-gold-text">
                      ${userData?.total_balance_aud?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">AUD</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-turquoise/10 border border-turquoise/30 text-center">
                      <Gift className="w-5 h-5 text-turquoise mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Bonus Balance</p>
                      <p className="text-lg font-bold text-turquoise">
                        ${userData?.bonus_balance?.toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-mystic-red/10 border border-mystic-red/30 text-center">
                      <Zap className="w-5 h-5 text-mystic-red mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Free Spins</p>
                      <p className="text-lg font-bold text-mystic-red">
                        {vipData?.free_spins_balance || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* VIP Status Card */}
              <Card className="bg-gaming-card border-premium-gold/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    VIP Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={`bg-gradient-to-r ${getTierColor(vipData?.tier || 'bronze')} text-white capitalize px-3 py-1`}>
                      {vipData?.tier || 'Bronze'} Member
                    </Badge>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Cashback Rate</p>
                      <p className="text-lg font-bold text-premium-gold">{vipData?.cashback_rate || 0.5}%</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">VIP Points</span>
                      <span className="text-premium-gold font-medium">{vipData?.points || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* First Deposit Bonus */}
              {!userData?.is_bonus_claimed && (
                <Card className="bg-gradient-to-br from-premium-gold/20 to-ancient-bronze/20 border-premium-gold/50 relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-mystic-red text-white animate-pulse">EXCLUSIVE</Badge>
                  </div>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <Gift className="w-10 h-10 text-premium-gold mx-auto" />
                      <h3 className="font-cinzel font-bold text-premium-gold text-lg">First Deposit Bonus</h3>
                      <p className="text-3xl font-bold text-foreground">200% Match</p>
                      <p className="text-sm text-muted-foreground">Up to $500 + 100 Free Spins</p>
                      <div className="pt-2">
                        <Badge variant="outline" className="border-premium-gold/50 text-premium-gold">
                          <Clock className="w-3 h-3 mr-1" />
                          Limited Time Offer
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Deposit Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gaming-card border-premium-gold/30">
                <CardHeader>
                  <CardTitle className="font-cinzel text-premium-gold">Make a Deposit</CardTitle>
                  <CardDescription>Choose your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="payid" className="w-full">
                    <TabsList className="grid grid-cols-4 bg-gaming-dark/50 mb-6">
                      <TabsTrigger value="payid" className="data-[state=active]:bg-turquoise/20 data-[state=active]:text-turquoise">
                        <Building2 className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">PayID</span>
                      </TabsTrigger>
                      <TabsTrigger value="card" className="data-[state=active]:bg-premium-gold/20 data-[state=active]:text-premium-gold">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Card</span>
                      </TabsTrigger>
                      <TabsTrigger value="crypto" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
                        <Bitcoin className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Crypto</span>
                      </TabsTrigger>
                      <TabsTrigger value="wallet" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
                        <Wallet className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">E-Wallet</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* PayID Tab */}
                    <TabsContent value="payid" className="space-y-6">
                      {/* Bonus Banner */}
                      <div className="p-4 rounded-lg bg-gradient-to-r from-turquoise/20 to-emerald/20 border border-turquoise/30">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-turquoise/20">
                            <Gift className="w-5 h-5 text-turquoise" />
                          </div>
                          <div>
                            <p className="font-semibold text-turquoise">PayID Bonus Active!</p>
                            <p className="text-sm text-muted-foreground">Get an extra 10% on all PayID deposits</p>
                          </div>
                        </div>
                      </div>

                      {/* Amount Selection */}
                      <div className="space-y-3">
                        <Label className="text-foreground">Select Amount (AUD)</Label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {quickAmounts.map((amt) => (
                            <Button
                              key={amt}
                              variant="outline"
                              className={`${
                                amount === String(amt) 
                                  ? 'border-turquoise bg-turquoise/20 text-turquoise' 
                                  : 'border-border/50 hover:border-turquoise/50 hover:bg-turquoise/10'
                              }`}
                              onClick={() => setAmount(String(amt))}
                            >
                              ${amt}
                            </Button>
                          ))}
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            placeholder="Enter custom amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-8 bg-gaming-dark border-border/50 focus:border-turquoise"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Minimum: $20 AUD • Maximum: $10,000 AUD</p>
                      </div>

                      {/* PayID Details */}
                      <div className="p-4 rounded-lg bg-gaming-dark/50 border border-border/50 space-y-4">
                        <h4 className="font-semibold text-foreground flex items-center gap-2">
                          <Shield className="w-4 h-4 text-turquoise" />
                          PayID Bank Transfer Details
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 rounded bg-gaming-card/50">
                            <div>
                              <p className="text-xs text-muted-foreground">PayID</p>
                              <p className="font-mono text-turquoise">{payIdDetails.payId}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={handleCopyPayId}
                              className="text-turquoise hover:bg-turquoise/10"
                            >
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded bg-gaming-card/50">
                              <p className="text-xs text-muted-foreground">BSB</p>
                              <p className="font-mono text-foreground">{payIdDetails.bsb}</p>
                            </div>
                            <div className="p-3 rounded bg-gaming-card/50">
                              <p className="text-xs text-muted-foreground">Account Number</p>
                              <p className="font-mono text-foreground">{payIdDetails.accountNumber}</p>
                            </div>
                          </div>
                          
                          <div className="p-3 rounded bg-gaming-card/50">
                            <p className="text-xs text-muted-foreground">Account Name</p>
                            <p className="font-mono text-foreground">{payIdDetails.accountName}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 p-3 rounded bg-premium-gold/10 border border-premium-gold/30">
                          <Zap className="w-4 h-4 text-premium-gold mt-0.5" />
                          <p className="text-xs text-muted-foreground">
                            <span className="text-premium-gold font-medium">Use your email as reference</span> - Funds credited within 5 minutes during business hours
                          </p>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-turquoise to-emerald text-white font-bold py-6 text-lg"
                        onClick={handleDeposit}
                        disabled={!amount || parseFloat(amount) < 20}
                      >
                        <Wallet className="w-5 h-5 mr-2" />
                        I've Made the Transfer
                      </Button>
                    </TabsContent>

                    {/* Card Tab */}
                    <TabsContent value="card" className="space-y-6">
                      <div className="text-center py-8">
                        <CreditCard className="w-16 h-16 text-premium-gold/50 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">Card Payments Available</h3>
                        <p className="text-muted-foreground">
                          We're integrating Visa, Mastercard & AMEX. Use PayID for instant deposits now!
                        </p>
                      </div>
                    </TabsContent>

                    {/* Crypto Tab */}
                    <TabsContent value="crypto" className="space-y-6">
                      <div className="text-center py-8">
                        <Bitcoin className="w-16 h-16 text-orange-400/50 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">Crypto Deposits Available</h3>
                        <p className="text-muted-foreground">
                          Bitcoin, Ethereum & USDT support is in development. Use PayID for now!
                        </p>
                      </div>
                    </TabsContent>

                    {/* E-Wallet Tab */}
                    <TabsContent value="wallet" className="space-y-6">
                      <div className="text-center py-8">
                        <Wallet className="w-16 h-16 text-emerald/50 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">E-Wallets Available</h3>
                        <p className="text-muted-foreground">
                          PayPal, Skrill & Neteller integration is underway. Use PayID in the meantime!
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <div className="mt-6 p-4 rounded-lg bg-gaming-card/50 border border-border/50">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-turquoise mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Bank-Level Security</p>
                    <p className="text-sm text-muted-foreground">
                      All transactions are encrypted and processed through secure Australian banking networks. 
                      Your funds and personal information are protected 24/7.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Deposit;
