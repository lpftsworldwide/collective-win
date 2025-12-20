import { MysticalLayout } from "@/components/MysticalLayout";
import { DailyTarotCard } from "@/components/DailyTarotCard";
import { RiddleSystem } from "@/components/RiddleSystem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Sparkles, Eye } from "lucide-react";

const DailyReading = () => {
  return (
    <MysticalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ScrollText className="w-8 h-8 text-premium-gold" />
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-premium-gold glow-gold-text">
              Daily Prophecy
            </h1>
            <Eye className="w-8 h-8 text-premium-gold" />
          </div>
          <p className="text-muted-foreground text-lg">
            Seek guidance from the ancient cards and solve the riddle of the day
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Daily Tarot Card */}
          <Card className="bg-gaming-card/50 border-premium-gold/30 tarot-card">
            <CardHeader>
              <CardTitle className="text-premium-gold font-cinzel text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Your Daily Card
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DailyTarotCard />
            </CardContent>
          </Card>

          {/* Riddle System */}
          <Card className="bg-gaming-card/50 border-premium-gold/30 tarot-card">
            <CardHeader>
              <CardTitle className="text-premium-gold font-cinzel text-2xl flex items-center gap-2">
                <ScrollText className="w-6 h-6" />
                Riddle of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RiddleSystem />
            </CardContent>
          </Card>
        </div>
      </div>
    </MysticalLayout>
  );
};

export default DailyReading;

