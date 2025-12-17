import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResponsibleGambling } from "@/hooks/useResponsibleGambling";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Shield, 
  Clock, 
  Ban, 
  DollarSign, 
  AlertTriangle, 
  ArrowLeft,
  Timer,
  Pause,
  Lock,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";

const ResponsibleGambling = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    settings, 
    isLoading, 
    updateSettings, 
    setSelfExclusion, 
    setCoolOff,
    isExcluded,
    isInCoolOff 
  } = useResponsibleGambling();

  const [dailyLimit, setDailyLimit] = useState(settings?.daily_deposit_limit?.toString() || "");
  const [weeklyLimit, setWeeklyLimit] = useState(settings?.weekly_deposit_limit?.toString() || "");
  const [monthlyLimit, setMonthlyLimit] = useState(settings?.monthly_deposit_limit?.toString() || "");
  const [sessionLimit, setSessionLimit] = useState(settings?.session_time_limit?.toString() || "");
  const [confirmExclusion, setConfirmExclusion] = useState(false);
  const [exclusionDays, setExclusionDays] = useState("7");

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md bg-gaming-card border-border">
          <CardContent className="pt-6 text-center">
            <Shield className="w-12 h-12 mx-auto text-premium-gold mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access responsible gambling settings.
            </p>
            <Button onClick={() => navigate("/auth")} className="bg-premium-gold text-gaming-dark">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSaveDepositLimits = async () => {
    try {
      await updateSettings.mutateAsync({
        daily_deposit_limit: dailyLimit ? parseFloat(dailyLimit) : null,
        weekly_deposit_limit: weeklyLimit ? parseFloat(weeklyLimit) : null,
        monthly_deposit_limit: monthlyLimit ? parseFloat(monthlyLimit) : null,
      });
      toast.success("Deposit limits updated successfully");
    } catch (error) {
      toast.error("Failed to update deposit limits");
    }
  };

  const handleSaveSessionLimit = async () => {
    try {
      await updateSettings.mutateAsync({
        session_time_limit: sessionLimit ? parseInt(sessionLimit) : null,
      });
      toast.success("Session time limit updated");
    } catch (error) {
      toast.error("Failed to update session limit");
    }
  };

  const handleCoolOff = async (hours: number) => {
    try {
      await setCoolOff.mutateAsync(hours);
      toast.success(`Cool-off period of ${hours} hours activated`);
    } catch (error) {
      toast.error("Failed to activate cool-off period");
    }
  };

  const handleSelfExclude = async (days?: number, permanent?: boolean) => {
    try {
      await setSelfExclusion.mutateAsync({ days, permanent });
      setConfirmExclusion(false);
      toast.success(permanent ? "Permanent self-exclusion activated" : `Self-exclusion activated for ${days} days`);
    } catch (error) {
      toast.error("Failed to activate self-exclusion");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-gaming-dark/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-premium-gold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-premium-gold" />
              <h1 className="text-xl font-bold text-premium-gold">Responsible Gambling</h1>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Active Restrictions Banner */}
        {(isExcluded || isInCoolOff) && (
          <Alert className="mb-6 bg-mystic-red/20 border-mystic-red">
            <AlertTriangle className="h-4 w-4 text-mystic-red" />
            <AlertTitle className="text-mystic-red">Account Restricted</AlertTitle>
            <AlertDescription className="text-foreground/80">
              {isExcluded && settings?.self_exclusion_permanent && (
                "Your account is permanently self-excluded. Contact support if you believe this is an error."
              )}
              {isExcluded && settings?.self_exclusion_until && (
                `Your account is self-excluded until ${format(new Date(settings.self_exclusion_until), 'PPP')}.`
              )}
              {isInCoolOff && settings?.cool_off_until && (
                `Your account is in cool-off until ${format(new Date(settings.cool_off_until), 'PPp')}.`
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Deposit Limits */}
          <Card className="bg-gaming-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-premium-gold" />
                <CardTitle className="text-premium-gold">Deposit Limits</CardTitle>
              </div>
              <CardDescription>
                Set maximum deposit amounts to control your spending
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="daily">Daily Limit (AUD)</Label>
                <Input
                  id="daily"
                  type="number"
                  placeholder="No limit"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weekly">Weekly Limit (AUD)</Label>
                <Input
                  id="weekly"
                  type="number"
                  placeholder="No limit"
                  value={weeklyLimit}
                  onChange={(e) => setWeeklyLimit(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthly">Monthly Limit (AUD)</Label>
                <Input
                  id="monthly"
                  type="number"
                  placeholder="No limit"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>
              <Button 
                onClick={handleSaveDepositLimits}
                disabled={updateSettings.isPending}
                className="w-full bg-premium-gold text-gaming-dark hover:bg-premium-gold-light"
              >
                Save Deposit Limits
              </Button>
              <p className="text-xs text-muted-foreground">
                Note: Lowering limits takes effect immediately. Increasing limits requires a 24-hour cooling period.
              </p>
            </CardContent>
          </Card>

          {/* Session Time Limits */}
          <Card className="bg-gaming-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-turquoise" />
                <CardTitle className="text-turquoise">Session Time Limits</CardTitle>
              </div>
              <CardDescription>
                Set reminders for how long you've been playing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session">Session Duration (minutes)</Label>
                <Input
                  id="session"
                  type="number"
                  placeholder="No limit"
                  value={sessionLimit}
                  onChange={(e) => setSessionLimit(e.target.value)}
                  className="bg-background/50 border-border"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                <div>
                  <p className="text-sm font-medium">Reality Check Reminders</p>
                  <p className="text-xs text-muted-foreground">Get notified about time spent playing</p>
                </div>
                <Switch 
                  checked={settings?.reality_check_enabled ?? true}
                  onCheckedChange={(checked) => updateSettings.mutate({ reality_check_enabled: checked })}
                />
              </div>

              <Button 
                onClick={handleSaveSessionLimit}
                disabled={updateSettings.isPending}
                className="w-full bg-turquoise text-white hover:bg-turquoise-light"
              >
                Save Session Limit
              </Button>
            </CardContent>
          </Card>

          {/* Cool-Off Period */}
          <Card className="bg-gaming-card border-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Pause className="w-5 h-5 text-amber-500" />
                <CardTitle className="text-amber-500">Take a Break</CardTitle>
              </div>
              <CardDescription>
                Temporarily pause access to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground/80">
                Need a short break? Activate a cool-off period to temporarily prevent access to games.
              </p>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleCoolOff(24)}
                  disabled={setCoolOff.isPending || isExcluded}
                  className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                >
                  <Timer className="w-4 h-4 mr-1" />
                  24h
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCoolOff(48)}
                  disabled={setCoolOff.isPending || isExcluded}
                  className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                >
                  <Timer className="w-4 h-4 mr-1" />
                  48h
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCoolOff(72)}
                  disabled={setCoolOff.isPending || isExcluded}
                  className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                >
                  <Timer className="w-4 h-4 mr-1" />
                  72h
                </Button>
              </div>

              {isInCoolOff && settings?.cool_off_until && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-sm text-amber-400">
                    Cool-off active until {format(new Date(settings.cool_off_until), 'PPp')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Self-Exclusion */}
          <Card className="bg-gaming-card border-border border-mystic-red/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Ban className="w-5 h-5 text-mystic-red" />
                <CardTitle className="text-mystic-red">Self-Exclusion</CardTitle>
              </div>
              <CardDescription>
                Block yourself from accessing your account for an extended period
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-mystic-red/10 border-mystic-red/30">
                <AlertTriangle className="h-4 w-4 text-mystic-red" />
                <AlertDescription className="text-foreground/80">
                  Self-exclusion cannot be reversed during the exclusion period. 
                  This is a serious commitment to help you control your gambling.
                </AlertDescription>
              </Alert>

              <Dialog open={confirmExclusion} onOpenChange={setConfirmExclusion}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isExcluded}
                    className="w-full border-mystic-red/50 text-mystic-red hover:bg-mystic-red/10"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {isExcluded ? "Already Self-Excluded" : "Self-Exclude My Account"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gaming-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-mystic-red flex items-center gap-2">
                      <Ban className="w-5 h-5" />
                      Confirm Self-Exclusion
                    </DialogTitle>
                    <DialogDescription>
                      This action will prevent you from accessing your account. 
                      You will not be able to undo this during the exclusion period.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Exclusion Period</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[7, 30, 90, 180].map((days) => (
                          <Button
                            key={days}
                            variant={exclusionDays === days.toString() ? "default" : "outline"}
                            onClick={() => setExclusionDays(days.toString())}
                            className={exclusionDays === days.toString() 
                              ? "bg-mystic-red text-white" 
                              : "border-border"
                            }
                          >
                            {days} days
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <Button
                      variant="outline"
                      onClick={() => handleSelfExclude(undefined, true)}
                      disabled={setSelfExclusion.isPending}
                      className="w-full border-mystic-red text-mystic-red hover:bg-mystic-red/10"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Permanent Self-Exclusion
                    </Button>
                  </div>

                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setConfirmExclusion(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleSelfExclude(parseInt(exclusionDays))}
                      disabled={setSelfExclusion.isPending}
                      className="bg-mystic-red text-white hover:bg-mystic-red/80"
                    >
                      Confirm {exclusionDays}-Day Exclusion
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {isExcluded && (
                <div className="p-3 rounded-lg bg-mystic-red/10 border border-mystic-red/30">
                  <div className="flex items-center gap-2 text-mystic-red">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {settings?.self_exclusion_permanent 
                        ? "Permanently self-excluded" 
                        : `Self-excluded until ${format(new Date(settings!.self_exclusion_until!), 'PPP')}`
                      }
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Help Resources */}
        <Card className="mt-6 bg-gaming-card border-border">
          <CardHeader>
            <CardTitle className="text-premium-gold">Need Help?</CardTitle>
            <CardDescription>
              If you're struggling with gambling, help is available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="https://www.gamblinghelponline.org.au"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-premium-gold" />
                <div>
                  <p className="font-medium">Gambling Help Online</p>
                  <p className="text-xs text-muted-foreground">24/7 support & counselling</p>
                </div>
              </a>
              <a
                href="https://www.gamblersanonymous.org.au"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-premium-gold" />
                <div>
                  <p className="font-medium">Gamblers Anonymous</p>
                  <p className="text-xs text-muted-foreground">Free support groups</p>
                </div>
              </a>
              <a
                href="tel:1800858858"
                className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <Shield className="w-5 h-5 text-emerald" />
                <div>
                  <p className="font-medium">1800 858 858</p>
                  <p className="text-xs text-muted-foreground">Gambling Helpline (Free Call)</p>
                </div>
              </a>
              <a
                href="https://www.lifeline.org.au"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-premium-gold" />
                <div>
                  <p className="font-medium">Lifeline Australia</p>
                  <p className="text-xs text-muted-foreground">13 11 14 - Crisis support</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ResponsibleGambling;
