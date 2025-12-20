import { NFTRewardSystem } from "@/components/NFTRewardSystem";
import { MysticalLayout } from "@/components/MysticalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Sparkles } from "lucide-react";

const NFTs = () => {
  return (
    <MysticalLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-premium-gold" />
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-premium-gold glow-gold-text">
              NFT Sanctuary
            </h1>
            <Sparkles className="w-8 h-8 text-premium-gold" />
          </div>
          <p className="text-muted-foreground text-lg">
            Unlock mystical digital collectibles as you ascend through the tiers
          </p>
        </div>

        {/* NFT Reward System */}
        <Card className="bg-gaming-card/50 border-premium-gold/30 tarot-card">
          <CardHeader>
            <CardTitle className="text-premium-gold font-cinzel text-2xl">
              Your Digital Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NFTRewardSystem />
          </CardContent>
        </Card>
      </div>
    </MysticalLayout>
  );
};

export default NFTs;

