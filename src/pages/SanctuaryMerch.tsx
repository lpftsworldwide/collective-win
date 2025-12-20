import { useState } from "react";
import { MysticalLayout } from "@/components/MysticalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Sparkles, Search, Crown, Shirt, Hat } from "lucide-react";

interface MerchItem {
  id: string;
  name: string;
  description: string;
  category: 'apparel' | 'accessories' | 'collectibles';
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string;
}

const MERCH: MerchItem[] = [
  { id: '1', name: 'Collective Winners Hoodie', description: 'Premium black hoodie with golden embroidery', category: 'apparel', price: 79.99, rarity: 'rare', image: '👕' },
  { id: '2', name: 'Mystical Tarot T-Shirt', description: 'Ancient tarot designs on premium cotton', category: 'apparel', price: 39.99, rarity: 'common', image: '👔' },
  { id: '3', name: 'Golden Crown Cap', description: 'Limited edition cap with mystical symbols', category: 'accessories', price: 34.99, rarity: 'rare', image: '🧢' },
  { id: '4', name: 'Sacred Geometry Pendant', description: 'Handcrafted pendant with ancient patterns', category: 'accessories', price: 59.99, rarity: 'epic', image: '🔮' },
  { id: '5', name: 'Master Collector Statue', description: 'Exclusive collectible statue of the Oracle', category: 'collectibles', price: 199.99, rarity: 'legendary', image: '👑' },
  { id: '6', name: 'Astral Feed Poster', description: 'Mystical artwork for your sanctuary', category: 'collectibles', price: 24.99, rarity: 'common', image: '🖼️' },
  { id: '7', name: 'Premium Gaming Mousepad', description: 'Large mousepad with mystical designs', category: 'accessories', price: 29.99, rarity: 'common', image: '🖱️' },
  { id: '8', name: 'VIP Membership Card', description: 'Exclusive physical membership card', category: 'accessories', price: 49.99, rarity: 'epic', image: '💳' },
];

const getRarityColor = (rarity: MerchItem['rarity']) => {
  switch (rarity) {
    case 'common': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    case 'rare': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'epic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'legendary': return 'bg-premium-gold/20 text-premium-gold border-premium-gold/50';
  }
};

const getCategoryIcon = (category: MerchItem['category']) => {
  switch (category) {
    case 'apparel': return <Shirt className="w-4 h-4" />;
    case 'accessories': return <Sparkles className="w-4 h-4" />;
    case 'collectibles': return <Crown className="w-4 h-4" />;
  }
};

export default function SanctuaryMerch() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const filteredMerch = MERCH.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <MysticalLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingBag className="w-12 h-12 text-premium-gold animate-pulse" />
            <h1 className="text-4xl font-cinzel font-bold text-premium-gold glow-gold-text">
              Merch & Relics
            </h1>
          </div>
          <p className="text-muted-foreground font-crimson text-lg">
            Premium merchandise and collectibles from the Collective Winners universe.
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-premium-gold/50" />
            <Input
              type="text"
              placeholder="Search merchandise..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-gaming-dark/50 border-premium-gold/30 text-premium-gold placeholder:text-premium-gold/40"
            />
          </div>
          
          <div className="flex justify-center gap-2">
            {['all', 'apparel', 'accessories', 'collectibles'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-cinzel font-bold transition-all ${
                  category === cat
                    ? 'bg-premium-gold text-gaming-dark'
                    : 'bg-gaming-dark/50 text-premium-gold border border-premium-gold/30 hover:bg-premium-gold/10'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMerch.map((item) => (
            <Card
              key={item.id}
              className="bg-gaming-card/50 border-premium-gold/30 hover:border-premium-gold/60 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_hsl(42_80%_55%/0.3)]"
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{item.image}</div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getCategoryIcon(item.category)}
                    <h3 className="text-xl font-cinzel font-bold text-premium-gold">
                      {item.name}
                    </h3>
                  </div>
                  <Badge className={getRarityColor(item.rarity)}>
                    {item.rarity.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm mb-4 text-center font-crimson italic">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-premium-gold/20">
                  <span className="text-2xl font-cinzel font-bold text-premium-gold">
                    ${item.price}
                  </span>
                  <button className="px-4 py-2 bg-premium-gold hover:bg-premium-gold-light text-gaming-dark font-cinzel font-bold rounded-lg transition-all hover:scale-105 hover:shadow-lg">
                    Purchase
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMerch.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-premium-gold/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No items found matching your search.</p>
          </div>
        )}
      </div>
    </MysticalLayout>
  );
}

