import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { ConfettiCelebration } from "@/components/ConfettiCelebration";

const EmailConfirm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get token from URL
        const token = searchParams.get("token");
        const type = searchParams.get("type");
        const tokenHash = searchParams.get("token_hash");

        if (!token && !tokenHash) {
          // Try to exchange session from URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            // Set session from URL hash
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.error("Session error:", sessionError);
              setStatus("error");
              return;
            }

            // Success - user is now confirmed
            setStatus("success");
            setShowConfetti(true);
            
            // Claim bonus
            await claimWelcomeBonus();
            
            toast({
              title: "Email Confirmed! 🎉",
              description: "Your account is now active. Welcome bonus claimed!",
            });

            // Redirect to home after 3 seconds
            setTimeout(() => {
              navigate("/");
            }, 3000);
            return;
          }
        }

        // If we have token/token_hash, verify email
        if (tokenHash || token) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash || undefined,
            token: token || undefined,
            type: (type as any) || "email",
          });

          if (verifyError) {
            console.error("Verification error:", verifyError);
            setStatus("error");
            toast({
              title: "Verification Failed",
              description: verifyError.message,
              variant: "destructive",
            });
            return;
          }

          // Success
          setStatus("success");
          setShowConfetti(true);
          
          // Claim bonus
          await claimWelcomeBonus();
          
          toast({
            title: "Email Confirmed! 🎉",
            description: "Your account is now active. Welcome bonus claimed!",
          });

          // Redirect to home after 3 seconds
          setTimeout(() => {
            navigate("/");
          }, 3000);
        } else {
          // No token found - might already be confirmed
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setStatus("success");
            navigate("/");
          } else {
            setStatus("error");
          }
        }
      } catch (error) {
        console.error("Email confirmation error:", error);
        setStatus("error");
        toast({
          title: "Error",
          description: "Failed to confirm email. Please try again.",
          variant: "destructive",
        });
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate, toast]);

  const claimWelcomeBonus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session for bonus claim");
        return;
      }

      const response = await supabase.functions.invoke("claim-bonus", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        console.error("Bonus claim error:", response.error);
        // Don't show error - bonus might already be claimed
      } else {
        console.log("Welcome bonus claimed:", response.data);
      }
    } catch (error) {
      console.error("Error claiming bonus:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <ConfettiCelebration trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(280_45%_15%/0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(42_80%_20%/0.2),transparent_50%)]" />
      
      <Card className="w-full max-w-md bg-gaming-dark/80 border-border backdrop-blur-sm relative z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-premium-gold to-ancient-bronze glow-gold">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-premium-gold">
            {status === "loading" && "Confirming Email..."}
            {status === "success" && "Email Confirmed! 🎉"}
            {status === "error" && "Confirmation Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your email address"}
            {status === "success" && "Your account is now active. Redirecting..."}
            {status === "error" && "There was an error confirming your email"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === "loading" && (
            <div className="flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-premium-gold animate-spin" />
            </div>
          )}
          
          {status === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-premium-gold font-bold text-lg">
                $111 Welcome Bonus Claimed!
              </p>
              <p className="text-muted-foreground">
                Redirecting to your dashboard...
              </p>
            </>
          )}
          
          {status === "error" && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
              <p className="text-muted-foreground">
                Please check your email for a new confirmation link, or contact support.
              </p>
              <Button onClick={() => navigate("/auth")} className="w-full">
                Back to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfirm;

