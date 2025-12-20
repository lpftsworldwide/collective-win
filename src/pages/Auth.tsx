import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Shield, Calendar, Wallet, PartyPopper, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConfettiCelebration } from "@/components/ConfettiCelebration";
import { z } from "zod";
import { useSoundEffects } from "@/hooks/useSoundEffects";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Calculate minimum date for 18+ (must be born before this date)
const getMaxBirthDate = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today.toISOString().split('T')[0];
};

const registerSchema = z.object({
  display_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
  date_of_birth: z.string().refine((dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, "You must be 18 years or older to register"),
  bsb: z.string().regex(/^\d{6}$/, "BSB must be 6 digits"),
  account_number: z.string().regex(/^\d{6,10}$/, "Account number must be 6-10 digits"),
  pay_id: z.string().min(1, "PayID is required"),
  password: z.string().min(6, "Password must be 6-20 characters").max(20),
  referral_code: z.string().optional(),
  terms_accepted: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBonusCelebration, setShowBonusCelebration] = useState(false);
  const { play } = useSoundEffects();

  // Redirect if already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      loginSchema.parse({ email, password });

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const display_name = formData.get("display_name") as string;
    const email = formData.get("email") as string;
    const mobile = formData.get("mobile") as string;
    const date_of_birth = formData.get("date_of_birth") as string;
    const bsb = formData.get("bsb") as string;
    const account_number = formData.get("account_number") as string;
    const pay_id = formData.get("pay_id") as string;
    const password = formData.get("password") as string;
    const referral_code = formData.get("referral_code") as string;

    try {
      registerSchema.parse({ 
        display_name, email, mobile, date_of_birth, 
        bsb, account_number, pay_id, password, 
        referral_code, terms_accepted: termsAccepted 
      });

      // Set redirect URL to email confirmation handler
      const redirectUrl = `${window.location.origin}/auth/confirm`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name,
            mobile,
            date_of_birth,
            bsb,
            account_number,
            pay_id,
            referral_code,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please login instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Check if email confirmation is required
        if (data.user && !data.session) {
          // Email confirmation required
          toast({
            title: "📧 Check Your Email!",
            description: "We've sent you a confirmation email. Click the link to activate your account and claim your $111 bonus!",
            duration: 10000,
          });
          
          // Show celebration for signup success
          setShowConfetti(true);
          play("bonus");
          
          // Don't navigate - user needs to confirm email first
          // They'll be redirected after email confirmation
        } else if (data.session) {
          // User is immediately logged in (email confirmation disabled)
          setShowConfetti(true);
          setShowBonusCelebration(true);
          play("bonus");
          
          toast({
            title: "🎉 CONGRATULATIONS!",
            description: "Your account is created! Claiming your $111 bonus...",
          });
          
          // Auto-claim the welcome bonus
          setTimeout(async () => {
            try {
              const response = await supabase.functions.invoke('claim-bonus', {
                headers: {
                  Authorization: `Bearer ${data.session!.access_token}`,
                },
              });
              
              if (response.error) {
                console.error('Bonus claim failed:', response.error);
                if (!response.error.message?.includes('404') && !response.error.message?.includes('not found')) {
                  toast({
                    title: "Bonus Claim",
                    description: "Your bonus will be available shortly. Please check your account.",
                    variant: "default",
                  });
                }
              } else {
                console.log('Welcome bonus claimed successfully:', response.data);
                toast({
                  title: "Bonus Claimed! 🎉",
                  description: `$${response.data?.bonus_amount || 111} welcome bonus credited!`,
                });
              }
            } catch (err) {
              console.error('Error claiming bonus:', err);
            }
            
            // Navigate to home
            navigate("/");
          }, 2000);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti celebration */}
      <ConfettiCelebration trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Bonus celebration overlay */}
      {showBonusCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gaming-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
            <div className="relative">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-premium-gold to-ancient-bronze flex items-center justify-center glow-gold animate-pulse">
                <Gift className="w-16 h-16 text-gaming-dark" />
              </div>
              <PartyPopper className="absolute -top-4 -left-4 w-12 h-12 text-premium-gold animate-bounce" />
              <PartyPopper className="absolute -top-4 -right-4 w-12 h-12 text-premium-gold animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-cinzel font-bold text-premium-gold glow-gold-text animate-pulse">
                $111 BONUS CLAIMED!
              </h2>
              <p className="text-xl text-papyrus font-crimson">Welcome to CollectiveWinners.org</p>
              <p className="text-muted-foreground">Your bonus is being credited...</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-premium-gold/50 text-2xl">
              <span>𓂀</span>
              <span>𓃭</span>
              <span>𓆣</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Mystical background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(280_45%_15%/0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(42_80%_20%/0.2),transparent_50%)]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 rounded-lg bg-gradient-to-br from-premium-gold to-ancient-bronze glow-gold">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-premium-gold">CollectiveWinners</h1>
            <p className="text-sm text-turquoise-light">Ancient Fortune Awaits</p>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gaming-card border border-border">
            <TabsTrigger value="login" className="data-[state=active]:bg-premium-gold data-[state=active]:text-gaming-dark">Login</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-premium-gold data-[state=active]:text-gaming-dark">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="bg-gaming-dark/80 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-premium-gold">Secure Portal Access</CardTitle>
                <CardDescription>Enter your credentials to continue your journey.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-premium-gold to-ancient-bronze text-primary-foreground hover:opacity-90 font-bold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entering..." : "ENTER THE REALM"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="bg-gaming-dark/80 border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-premium-gold">Join the Collective</CardTitle>
                <CardDescription>Create your account & claim your $111 welcome bonus. Must be 18+.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Personal Info */}
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Full Legal Name</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      type="text"
                      placeholder="As shown on your ID"
                      required
                      className="bg-background border-border"
                    />
                    <p className="text-xs text-muted-foreground">Must match ID for withdrawals</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      placeholder="+61 400 123 456"
                      required
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-premium-gold" />
                      Date of Birth (18+)
                    </Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      max={getMaxBirthDate()}
                      required
                      className="bg-background border-border"
                    />
                    <p className="text-xs text-muted-foreground">You must be 18 years or older</p>
                  </div>

                  {/* Payment Details Section */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-2 text-premium-gold">
                      <Wallet className="w-4 h-4" />
                      <span className="text-sm font-medium">Payment Details (for withdrawals)</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="bsb">BSB</Label>
                        <Input
                          id="bsb"
                          name="bsb"
                          type="text"
                          placeholder="123456"
                          maxLength={6}
                          pattern="\d{6}"
                          required
                          className="bg-background border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account_number">Account No.</Label>
                        <Input
                          id="account_number"
                          name="account_number"
                          type="text"
                          placeholder="12345678"
                          maxLength={10}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pay_id">PayID (Email or Phone)</Label>
                      <Input
                        id="pay_id"
                        name="pay_id"
                        type="text"
                        placeholder="your@email.com or 04xx xxx xxx"
                        required
                        className="bg-background border-border"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">KYC verification required for withdrawals over $100</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      placeholder="6-20 characters"
                      required
                      className="bg-background border-border"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="referral_code">Referrer Code (Optional)</Label>
                    <Input
                      id="referral_code"
                      name="referral_code"
                      type="text"
                      placeholder="Enter referral code"
                      className="bg-background border-border"
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox 
                      id="terms" 
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                      className="mt-1 border-premium-gold data-[state=checked]:bg-premium-gold"
                    />
                    <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                      I confirm I am 18+ years old and agree to the Terms of Service, Privacy Policy, and 
                      Responsible Gambling guidelines. I understand withdrawals require KYC verification.
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-premium-gold to-ancient-bronze text-primary-foreground hover:opacity-90 font-bold py-6"
                    disabled={isLoading || !termsAccepted}
                  >
                    {isLoading ? "Creating account..." : "JOIN & CLAIM $111 BONUS"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 text-premium-gold" />
            <span>256-bit encrypted • Licensed & Regulated</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Play responsibly. 18+ only. Gambling can be addictive.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;