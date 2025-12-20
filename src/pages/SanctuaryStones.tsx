import { useState } from "react";
import { MysticalLayout } from "@/components/MysticalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Gem, Sparkles, Zap, Shield, Search } from "lucide-react";

interface Stone {
  id: string;
  name: string;
  description: string;
  powerLevel: number;
  aura: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
}

const STONES: Stone[] = [
  { id: '1', name: 'Amethyst of Clarity', description: 'Enhances intuition and spiritual awareness', powerLevel: 75, aura: 'Purple', price: 29.99, rarity: 'rare', icon: '💜' },
  { id: '2', name: 'Citrine of Prosperity', description: 'Attracts wealth and abundance', powerLevel: 85, aura: 'Golden', price: 39.99, rarity: 'epic', icon: '💛' },
  { id: '3', name: 'Obsidian Shield', description: 'Protects against negative energy', powerLevel: 90, aura: 'Dark', price: 49.99, rarity: 'epic', icon: '🖤' },
  { id: '4', name: 'Rose Quartz Heart', description: 'Opens the heart chakra for love', powerLevel: 70, aura: 'Pink', price: 24.99, rarity: 'common', icon: '💗' },
  { id: '5', name: 'Emerald Wisdom', description: 'Grants ancient knowledge and insight', powerLevel: 95, aura: 'Green', price: 79.99, rarity: 'legendary', icon: '💚' },
  { id: '6', name: 'Sapphire Focus', description: 'Sharpens mental clarity and concentration', powerLevel: 80, aura: 'Blue', price: 44.99, rarity: 'rare', icon: '💙' },
  { id: '7', name: 'Ruby Passion', description: 'Ignites inner fire and motivation', powerLevel: 88, aura: 'Red', price: 54.99, rarity: 'epic', icon: '❤️' },
  { id: '8', name: 'Diamond Purity', description: 'Cleanses aura and amplifies intentions', powerLevel: 100, aura: 'White', price: 99.99, rarity: 'legendary', icon: '💎' },
];

const getRarityColor = (rarity: Stone['rarity']) => {
  switch (rarity) {
    case 'common': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    case 'rare': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'epic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'legendary': return 'bg-premium-gold/20 text-premium-gold border-premium-gold/50';
  }
};

export default function SanctuaryStones() {
  const [search, setSearch] = useState("");

  const filteredStones = STONES.filter(stone =>
    stone.name.toLowerCase().includes(search.toLowerCase()) ||
    stone.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MysticalLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gem className="w-12 h-12 text-premium-gold animate-pulse" />
            <h1 className="text-4xl font-cinzel font-bold text-premium-gold glow-gold-text">
              Spiritual Stones
            </h1>
          </div>
          <p className="text-muted-foreground font-crimson text-lg">
            Ancient crystals imbued with mystical power. Each stone carries unique energy.
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-premium-gold/50" />
            <Input
              type="text"
              placeholder="Search stones by name or power..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-gaming-dark/50 border-premium-gold/30 text-premium-gold placeholder:text-premium-gold/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStones.map((stone) => (
            <Card
              key={stone.id}
              className="bg-gaming-card/50 border-premium-gold/30 hover:border-premium-gold/60 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(42_80%_55%/0.3)]"
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{stone.icon}</div>
                  <h3 className="text-xl font-cinzel font-bold text-premium-gold mb-2">
                    {stone.name}
                  </h3>
                  <Badge className={getRarityColor(stone.rarity)}>
                    {stone.rarity.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm mb-4 text-center font-crimson italic">
                  {stone.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Power Level
                    </span>
                    <span className="text-premium-gold font-bold">{stone.powerLevel}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Aura
                    </span>
                    <span className="text-premium-gold font-bold">{stone.aura}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-premium-gold/20">
                  <span className="text-2xl font-cinzel font-bold text-premium-gold">
                    ${stone.price}
                  </span>
                  <button className="px-4 py-2 bg-premium-gold hover:bg-premium-gold-light text-gaming-dark font-cinzel font-bold rounded-lg transition-all hover:scale-105 hover:shadow-lg">
                    Acquire
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStones.length === 0 && (
          <div className="text-center py-12">
            <Gem className="w-16 h-16 text-premium-gold/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No stones found matching your search.</p>
          </div>
        )}
      </div>
    </MysticalLayout>
  );
}

