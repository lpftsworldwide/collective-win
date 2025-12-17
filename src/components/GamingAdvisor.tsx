import { useState } from "react";
import { Brain, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdvisorMetrics {
  totalSessions: number;
  totalWagered: string;
  totalWon: string;
  netResult: string;
  currentBalance: number;
  avgWager: string;
  winRate: string;
  favoriteGames: string[];
}

interface AdvisorResponse {
  advice: string;
  metrics: AdvisorMetrics;
}

export const GamingAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string>("");
  const [metrics, setMetrics] = useState<AdvisorMetrics | null>(null);
  const { toast } = useToast();

  const getAdvice = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<AdvisorResponse>('gaming-advisor');

      if (error) throw error;

      if (data?.advice) {
        setAdvice(data.advice);
        setMetrics(data.metrics);
      } else {
        throw new Error('No advice received');
      }
    } catch (error: any) {
      console.error('Error getting advice:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get gaming advice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !advice) {
      getAdvice();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-gaming-card border-premium-gold/30 hover:bg-premium-gold/10 text-foreground"
        >
          <Brain className="w-4 h-4 text-premium-gold" />
          <span className="hidden sm:inline">AI Advisor</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gaming-dark border-l border-premium-gold/20 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-premium-gold">
            <Brain className="w-5 h-5" />
            Your AI Gaming Advisor
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Personalized insights based on your play patterns
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-premium-gold" />
              <p className="text-muted-foreground">Analyzing your play patterns...</p>
            </div>
          ) : advice ? (
            <>
              {/* Metrics Overview */}
              {metrics && (
                <Card className="bg-gaming-card border-premium-gold/20">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center gap-2 text-premium-gold mb-3">
                      <TrendingUp className="w-4 h-4" />
                      <h3 className="font-semibold">Your Stats</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sessions</p>
                        <p className="font-semibold text-foreground">{metrics.totalSessions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Win Rate</p>
                        <p className="font-semibold text-foreground">{metrics.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Wagered</p>
                        <p className="font-semibold text-foreground">${metrics.totalWagered}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Won</p>
                        <p className="font-semibold text-foreground">${metrics.totalWon}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Net Result</p>
                        <p className={`font-semibold ${parseFloat(metrics.netResult) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${metrics.netResult}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Wager</p>
                        <p className="font-semibold text-foreground">${metrics.avgWager}</p>
                      </div>
                    </div>
                    {metrics.favoriteGames.length > 0 && (
                      <div className="pt-2 border-t border-premium-gold/10">
                        <p className="text-muted-foreground text-sm">Favorite Games</p>
                        <p className="font-semibold text-foreground text-sm">{metrics.favoriteGames.join(', ')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* AI Advice */}
              <Card className="bg-gaming-card border-premium-gold/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-premium-gold mb-4">
                    <AlertCircle className="w-4 h-4" />
                    <h3 className="font-semibold">Personalized Insights</h3>
                  </div>
                  <div className="prose prose-sm prose-invert max-w-none">
                    <div 
                      className="text-foreground space-y-3 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ 
                        __html: DOMPurify.sanitize(
                          advice.replace(/\*\*(.*?)\*\*/g, '<strong class="text-premium-gold">$1</strong>')
                            .replace(/\n\n/g, '</p><p class="mt-3">')
                            .replace(/^(.+)$/gm, '<p>$1</p>'),
                          { ALLOWED_TAGS: ['p', 'strong', 'em', 'br'], ALLOWED_ATTR: ['class'] }
                        )
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={getAdvice}
                className="w-full bg-premium-gold text-gaming-dark hover:bg-premium-gold/90"
              >
                Refresh Insights
              </Button>
            </>
          ) : (
            <Card className="bg-gaming-card border-premium-gold/20">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  Click below to get personalized gaming insights
                </p>
                <Button 
                  onClick={getAdvice}
                  className="w-full mt-4 bg-premium-gold text-gaming-dark hover:bg-premium-gold/90"
                >
                  Get AI Insights
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Responsible Gaming Notice */}
          <Card className="bg-gaming-card/50 border-premium-gold/10">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground text-center">
                This advisor provides insights for entertainment purposes. Always play responsibly and within your means.
              </p>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};