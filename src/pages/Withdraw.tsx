import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useKycStatus } from "@/hooks/useKycStatus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Wallet, 
  Building2, 
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck,
  Upload,
  Loader2,
  Crown,
  TrendingDown,
  Info,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const Withdraw = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { status: kycStatus, isVerified, isLoading: kycLoading } = useKycStatus();
  const [amount, setAmount] = useState("");
  const [payId, setPayId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  // Fetch user balance
  const { data: userData, refetch: refetchBalance } = useQuery({
    queryKey: ['user-balance', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('users')
        .select('total_balance_aud, bonus_balance, is_kyc_verified')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch pending withdrawals
  const { data: pendingWithdrawals } = useQuery({
    queryKey: ['pending-withdrawals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'withdrawal')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
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
            <CardTitle className="text-2xl font-cinzel text-premium-gold">Secure Withdrawals</CardTitle>
            <CardDescription>Sign in to access your funds</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-bold"
              onClick={() => navigate('/auth')}
            >
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const quickAmounts = [50, 100, 200, 500, 1000];
  const minWithdrawal = 50;
  const maxWithdrawal = Math.min(10000, userData?.total_balance_aud || 0);

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);

    // Validation
    if (!amount || withdrawAmount < minWithdrawal) {
      toast.error(`Minimum withdrawal is $${minWithdrawal} AUD`);
      return;
    }

    if (withdrawAmount > (userData?.total_balance_aud || 0)) {
      toast.error("Insufficient balance");
      return;
    }

    if (!payId.trim()) {
      toast.error("Please enter your PayID");
      return;
    }

    // Check KYC verification
    if (!isVerified) {
      setShowKycModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.rpc('process_withdrawal', {
        p_user_id: user.id,
        p_amount: withdrawAmount,
        p_transaction_hash: `PAYID:${payId}`
      });

      if (error) {
        if (error.message.includes('KYC verification required')) {
          setShowKycModal(true);
          return;
        }
        throw error;
      }

      toast.success(`Withdrawal of $${withdrawAmount.toFixed(2)} AUD initiated!`, {
        description: "Processing typically takes 1-3 business days."
      });
      setAmount("");
      setPayId("");
      refetchBalance();
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      toast.error(error.message || "Failed to process withdrawal");
    } finally {
      setIsProcessing(false);
    }
  };

  const getKycStatusBadge = () => {
    if (kycLoading) {
      return <Badge variant="outline" className="border-muted"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Checking...</Badge>;
    }

    switch (kycStatus) {
      case 'approved':
        return <Badge className="bg-emerald text-white"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-500 text-black"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
      case 'submitted':
        return <Badge className="bg-turquoise text-white"><FileCheck className="w-3 h-3 mr-1" />Submitted</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'expired':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500"><Upload className="w-3 h-3 mr-1" />Not Verified</Badge>;
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
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-premium-gold/10 border border-premium-gold/30 mb-4">
              <TrendingDown className="w-4 h-4 text-premium-gold" />
              <span className="text-sm text-premium-gold font-medium">Secure Withdrawals</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-premium-gold mb-2">
              Withdraw Your Winnings
            </h1>
            <p className="text-muted-foreground">Fast PayID payouts • Secure processing • KYC verified</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Balance & KYC Status */}
            <div className="space-y-6">
              {/* Balance Card */}
              <Card className="bg-gradient-to-br from-gaming-card to-gaming-dark border-premium-gold/30 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-premium-gold via-ancient-bronze to-premium-gold" />
                <CardHeader>
                  <CardTitle className="text-lg font-cinzel text-premium-gold flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Available Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-1">Withdrawable</p>
                    <p className="text-4xl font-bold text-premium-gold glow-gold-text">
                      ${userData?.total_balance_aud?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">AUD</p>
                  </div>

                  {(userData?.bonus_balance || 0) > 0 && (
                    <Alert className="bg-yellow-500/10 border-yellow-500/30">
                      <Info className="w-4 h-4 text-yellow-500" />
                      <AlertDescription className="text-xs text-yellow-200">
                        Bonus balance (${userData?.bonus_balance?.toFixed(2)}) requires wagering before withdrawal.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* KYC Status Card */}
              <Card className="bg-gaming-card border-premium-gold/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Identity Verification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">KYC Status</span>
                    {getKycStatusBadge()}
                  </div>

                  {!isVerified && (
                    <Button 
                      variant="outline" 
                      className="w-full border-premium-gold/50 text-premium-gold hover:bg-premium-gold/10"
                      onClick={() => navigate('/kyc')}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Complete Verification
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                  {isVerified && (
                    <div className="p-3 rounded-lg bg-emerald/10 border border-emerald/30">
                      <div className="flex items-center gap-2 text-emerald">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Ready to withdraw</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pending Withdrawals */}
              {(pendingWithdrawals?.length || 0) > 0 && (
                <Card className="bg-gaming-card border-yellow-500/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-yellow-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Pending Withdrawals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pendingWithdrawals?.map((tx) => (
                        <div key={tx.id} className="flex justify-between items-center p-2 rounded bg-gaming-dark/50">
                          <span className="text-sm text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </span>
                          <span className="font-medium text-yellow-500">${tx.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Withdrawal Form */}
            <div className="lg:col-span-2">
              <Card className="bg-gaming-card border-premium-gold/30">
                <CardHeader>
                  <CardTitle className="font-cinzel text-premium-gold">PayID Withdrawal</CardTitle>
                  <CardDescription>Receive funds directly to your bank account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* KYC Warning */}
                  {!isVerified && !kycLoading && (
                    <Alert className="bg-yellow-500/10 border-yellow-500/30">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <AlertTitle className="text-yellow-500">Verification Required</AlertTitle>
                      <AlertDescription className="text-yellow-200/80">
                        Complete KYC verification to unlock withdrawals. This is required by Australian gambling regulations.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* PayID Input */}
                  <div className="space-y-3">
                    <Label className="text-foreground">Your PayID</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="email@example.com or 04XX XXX XXX"
                        value={payId}
                        onChange={(e) => setPayId(e.target.value)}
                        className="pl-10 bg-gaming-dark border-border/50 focus:border-premium-gold"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Enter your email or phone number registered with PayID</p>
                  </div>

                  {/* Amount Selection */}
                  <div className="space-y-3">
                    <Label className="text-foreground">Withdrawal Amount (AUD)</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {quickAmounts.map((amt) => (
                        <Button
                          key={amt}
                          variant="outline"
                          disabled={amt > (userData?.total_balance_aud || 0)}
                          className={`${
                            amount === String(amt) 
                              ? 'border-premium-gold bg-premium-gold/20 text-premium-gold' 
                              : 'border-border/50 hover:border-premium-gold/50 hover:bg-premium-gold/10'
                          } disabled:opacity-50`}
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
                        max={maxWithdrawal}
                        className="pl-8 bg-gaming-dark border-border/50 focus:border-premium-gold"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum: ${minWithdrawal} AUD • Maximum: ${maxWithdrawal.toFixed(2)} AUD
                    </p>
                  </div>

                  {/* Processing Info */}
                  <div className="p-4 rounded-lg bg-gaming-dark/50 border border-border/50">
                    <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-turquoise" />
                      Processing Times
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PayID Transfers</span>
                        <span className="text-turquoise">1-3 Business Days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verification Check</span>
                        <span className="text-turquoise">Instant</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Withdrawal Fee</span>
                        <span className="text-emerald">FREE</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-bold py-6 text-lg"
                    onClick={handleWithdraw}
                    disabled={isProcessing || !amount || !payId || parseFloat(amount) < minWithdrawal}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5 mr-2" />
                        Withdraw ${amount || '0.00'} AUD
                      </>
                    )}
                  </Button>

                  {/* Security Notice */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gaming-dark/30">
                    <Shield className="w-5 h-5 text-premium-gold flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      All withdrawals are processed securely and comply with Australian gambling regulations. 
                      Funds are sent directly to your verified PayID account.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* KYC Modal */}
      <Dialog open={showKycModal} onOpenChange={setShowKycModal}>
        <DialogContent className="bg-gaming-card border-premium-gold/30">
          <DialogHeader>
            <DialogTitle className="text-premium-gold font-cinzel flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Identity Verification Required
            </DialogTitle>
            <DialogDescription>
              To comply with Australian gambling regulations, we require identity verification before processing withdrawals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-gaming-dark/50 border border-border/50">
              <h4 className="font-medium text-foreground mb-3">Required Documents:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-turquoise" />
                  Government-issued ID (Passport or Driver's License)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-turquoise" />
                  Proof of Address (Utility bill or bank statement)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-turquoise" />
                  Selfie with ID for verification
                </li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">
              Verification typically takes 24-48 hours. Your documents are handled securely and in accordance with our privacy policy.
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowKycModal(false)}
              className="flex-1 border-border/50"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setShowKycModal(false);
                navigate('/kyc');
              }}
              className="flex-1 bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-bold"
            >
              <Upload className="w-4 h-4 mr-2" />
              Start Verification
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Withdraw;
