import { MysticalLayout } from "@/components/MysticalLayout";
import { LiveCommunityFeed } from "@/components/LiveCommunityFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare } from "lucide-react";

const CommunityFeed = () => {
  return (
    <MysticalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-8 h-8 text-premium-gold" />
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-premium-gold glow-gold-text">
              Astral Feed
            </h1>
            <MessageSquare className="w-8 h-8 text-premium-gold" />
          </div>
          <p className="text-muted-foreground text-lg">
            Connect with the Collective - Daily readings, airdrop alerts, and community updates
          </p>
        </div>

        {/* Community Feed */}
        <Card className="bg-gaming-card/50 border-premium-gold/30 tarot-card">
          <CardHeader>
            <CardTitle className="text-premium-gold font-cinzel text-2xl">
              The Oracle's Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LiveCommunityFeed />
          </CardContent>
        </Card>
      </div>
    </MysticalLayout>
  );
};

export default CommunityFeed;

