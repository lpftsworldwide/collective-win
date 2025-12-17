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

        {/* Comprehensive Information Section */}
        <Card className="mt-6 bg-gaming-card border-border">
          <CardHeader>
            <CardTitle className="text-premium-gold">Understanding Gambling Addiction</CardTitle>
            <CardDescription>
              Compulsive gaming is when a person risks something in a hope to get something bigger in return. 
              Gambling addiction is the urge to continue betting no matter what impact the losses have on one's life. 
              In 2012 the American Psychiatric Association has officially recognized this addiction similar to drug consumption and alcoholism.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Causes */}
            <div>
              <h3 className="text-lg font-bold text-premium-gold mb-3">What are gambling addiction causes?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We still don't know the exact cause of gambling addiction because in most cases it is a mixture of several of them. 
                However, there are irrefutable links between mental health, social life, and background.
              </p>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-background/50">
                  <h4 className="font-semibold text-foreground mb-2">Biological factors</h4>
                  <p className="text-sm text-muted-foreground">
                    One of the main causes of compulsive gambling is of biological nature because some of the aspects are similar 
                    to the ones that cause other types of addictions. Brain imaging witnesses that gambling win produces a response 
                    that is similar to the one of cocaine or an alcohol addict. Serotonin and norepinephrine deficiencies, chemicals 
                    that are responsible for stress, wellbeing, and happiness, are also related to compulsive actions.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                  <h4 className="font-semibold text-foreground mb-2">Free Access To The Games</h4>
                  <p className="text-sm text-muted-foreground">
                    It is rather easy to find a gambling site nearby or to play a few games online. There is no need to go to an 
                    offline casino to make a few bets: everything is available within a few clicks. Availability and accessibility 
                    of these games make it rather difficult to control the gambling market and to prevent potential addicts from playing.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                  <h4 className="font-semibold text-foreground mb-2">Personality factors</h4>
                  <p className="text-sm text-muted-foreground">
                    Another factor that may influence the development of gambling addiction is the personality one. The personality 
                    factor includes treats of the character like being impulsive, easily bored or restless. Even superstitions may 
                    influence the choices a player makes in an online casino.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                  <h4 className="font-semibold text-foreground mb-2">Society</h4>
                  <p className="text-sm text-muted-foreground">
                    Latest researches show that people, who have problems in personal life or at home are more likely to develop 
                    a gambling addiction compared to those who are satisfied with their life. Relationships play a crucial role in 
                    acquiring wrong gambling habits: if your relatives or friends have problems with betting the chances that you 
                    will also have them are rather high.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Signs and Symptoms */}
            <div>
              <h3 className="text-lg font-bold text-premium-gold mb-3">Signs And Symptoms Of Gambling Addiction</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {[
                  "Neglecting other life aspects",
                  "Keeping this activity in secret",
                  "Making money only via gambling",
                  "Borrowing money to spin the wheel",
                  "Thinking that 'gambling is the only pleasure in life'",
                  "Occupying mind only with online casino games",
                  "Being able to steal something to get money for gambling",
                  "Needing to play a game just to feel the thrill",
                  "Failed attempts to control or stop playing",
                  "Feeling irritated or even aggressive when it is impossible to gamble",
                  "Losing opportunities or relationships because of gambling",
                  "'Chasing losses', i.e. trying to get back the money you have lost"
                ].map((symptom, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded bg-background/30">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Tips for Safe Gambling */}
            <div>
              <h3 className="text-lg font-bold text-premium-gold mb-3">Tips On How To Gamble Online Safely</h3>
              <div className="space-y-2">
                {[
                  "Gambling for fun. It should bring joy, relaxation, and excitement. Avoid negative feelings and anxiety.",
                  "Bet the sums that you are not afraid to lose. Control your budget and never exceed it.",
                  "Never play drunk. You may overestimate your abilities and spend more than intended to.",
                  "Decide in advance how much time you will spend on a game. It is easy to lose the track of time.",
                  "Stay true to yourself. Keep the promises you have made even if you want to continue gambling.",
                  "Casinos always benefit. Don't forget that odds are always against players.",
                  "Stop playing if you win. Once your bet has played, it's necessary to quit the game.",
                  "Never borrow money for the game. It is the first and one of the most important rules of quality gambling."
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded bg-background/30">
                    <CheckCircle className="w-4 h-4 text-emerald mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Zealand Help Resources */}
        <Card className="mt-6 bg-gaming-card border-border">
          <CardHeader>
            <CardTitle className="text-premium-gold">Useful Gambling Addiction Resources For New Zealanders</CardTitle>
            <CardDescription>
              When none of the above methods work and you feel that the situation is out of your control, 
              it is better to reach professional support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <a
                href="tel:0800654655"
                className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <Shield className="w-5 h-5 text-emerald" />
                <div>
                  <p className="font-medium">Gambling Helpline</p>
                  <p className="text-xs text-muted-foreground">0800 654 655 - National free-to-phone service</p>
                </div>
              </a>
              <a
                href="tel:0800654655"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-premium-gold" />
                <div>
                  <p className="font-medium">ChoiceNotChance</p>
                  <p className="text-xs text-muted-foreground">0800 654 655 - Comprehensive information on online gambling</p>
                </div>
              </a>
              <a
                href="tel:0800664262"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-premium-gold" />
                <div>
                  <p className="font-medium">Problem Gambling Foundation (PGF)</p>
                  <p className="text-xs text-muted-foreground">0800 664 262 - Support groups and meetings</p>
                </div>
              </a>
              <a
                href="tel:0800862342"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-premium-gold" />
                <div>
                  <p className="font-medium">Asian Family Services</p>
                  <p className="text-xs text-muted-foreground">0800 862 342 - For Asian gamblers in New Zealand</p>
                </div>
              </a>
              <a
                href="https://www.salvationarmy.org.nz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-premium-gold" />
                <div>
                  <p className="font-medium">The Salvation Army Oasis Centers</p>
                  <p className="text-xs text-muted-foreground">+64 4 802 6269 - Social, educational, and legal support</p>
                </div>
              </a>
              <a
                href="https://www.gamblersanonymous.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-premium-gold" />
                <div>
                  <p className="font-medium">Gamblers Anonymous</p>
                  <p className="text-xs text-muted-foreground">12-step program - Free support groups worldwide</p>
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
