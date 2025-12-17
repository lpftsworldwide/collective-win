import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Trophy,
  Star,
  Users,
  Crown,
  Flame,
  Send,
  Heart,
  Gift
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const Community = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newPost, setNewPost] = useState("");

  const communityPosts = [
    {
      id: 1,
      username: "DragonSlayer99",
      avatar: "🐉",
      tier: "diamond",
      content: "Just hit a massive 500x multiplier on Gates of Olympus! This platform is absolutely incredible! 🎰⚡",
      likes: 234,
      comments: 45,
      time: "2 hours ago",
      isWin: true,
      winAmount: "$12,500"
    },
    {
      id: 2,
      username: "LuckyPhoenix",
      avatar: "🦅",
      tier: "gold",
      content: "The customer support here is top-notch! Had an issue with a withdrawal and they resolved it within minutes. Highly recommend! 💯",
      likes: 156,
      comments: 23,
      time: "4 hours ago",
      isWin: false
    },
    {
      id: 3,
      username: "CryptoKing2024",
      avatar: "👑",
      tier: "platinum",
      content: "Free spins on Sweet Bonanza just paid out big time! Love the daily rewards system 🍬",
      likes: 189,
      comments: 34,
      time: "6 hours ago",
      isWin: true,
      winAmount: "$3,200"
    },
    {
      id: 4,
      username: "NightOwlGamer",
      avatar: "🦉",
      tier: "silver",
      content: "Pro tip: The reload weekend bonus stacks with VIP cashback. Made an extra $200 this weekend! 🔥",
      likes: 312,
      comments: 67,
      time: "8 hours ago",
      isWin: false
    },
    {
      id: 5,
      username: "GoldenEagle777",
      avatar: "🦅",
      tier: "gold",
      content: "Just won the daily raffle! $500 in bonus credits deposited instantly. This community is amazing! 🎉",
      likes: 445,
      comments: 89,
      time: "12 hours ago",
      isWin: true,
      winAmount: "$500"
    },
  ];

  const topContributors = [
    { rank: 1, name: "MysticOracle", points: 15420, tier: "diamond" },
    { rank: 2, name: "LuckyDragon88", points: 12350, tier: "platinum" },
    { rank: 3, name: "GoldRushKing", points: 10200, tier: "gold" },
    { rank: 4, name: "CasinoQueen", points: 8900, tier: "gold" },
    { rank: 5, name: "HighRoller99", points: 7650, tier: "silver" },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'diamond': return 'from-cyan-400 to-blue-500';
      case 'platinum': return 'from-slate-300 to-slate-500';
      case 'gold': return 'from-premium-gold to-ancient-bronze';
      case 'silver': return 'from-gray-300 to-gray-500';
      default: return 'from-amber-600 to-amber-800';
    }
  };

  const handlePost = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!newPost.trim()) {
      toast.error("Please write something before posting!");
      return;
    }
    toast.success("Post shared with the community!");
    setNewPost("");
  };

  return (
    <div className="min-h-screen bg-background hieroglyph-bg">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(270_50%_15%/0.4),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(45_85%_20%/0.3),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="border-b border-premium-gold/20 bg-gaming-dark/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-premium-gold to-transparent" />
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-premium-gold hover:bg-premium-gold/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="font-cinzel text-xl text-premium-gold font-bold">Community Hub</h1>
            <Badge variant="outline" className="border-turquoise/50 text-turquoise">
              <Users className="w-3 h-3 mr-1" />
              2.4K Online
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-premium-gold/10 border border-premium-gold/30 mb-4">
            <MessageSquare className="w-4 h-4 text-premium-gold" />
            <span className="text-sm text-premium-gold font-medium">Community</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-premium-gold mb-2">
            Winners Circle
          </h1>
          <p className="text-muted-foreground">Share wins, tips, and connect with fellow players</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Box */}
            <Card className="bg-gaming-card border-premium-gold/30">
              <CardContent className="p-4">
                <Textarea 
                  placeholder={user ? "Share your big win or casino tips..." : "Sign in to share with the community..."}
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="mb-3 bg-gaming-dark/50 border-border/50 resize-none"
                  rows={3}
                  disabled={!user}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-border/50 text-muted-foreground">
                      <Trophy className="w-4 h-4 mr-1" />
                      Tag Win
                    </Button>
                    <Button size="sm" variant="outline" className="border-border/50 text-muted-foreground">
                      <Gift className="w-4 h-4 mr-1" />
                      Share Bonus
                    </Button>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-bold"
                    onClick={handlePost}
                    disabled={!user}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <Tabs defaultValue="trending" className="w-full">
              <TabsList className="bg-gaming-dark/50 mb-4">
                <TabsTrigger value="trending" className="data-[state=active]:bg-premium-gold/20 data-[state=active]:text-premium-gold">
                  <Flame className="w-4 h-4 mr-1" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="wins" className="data-[state=active]:bg-turquoise/20 data-[state=active]:text-turquoise">
                  <Trophy className="w-4 h-4 mr-1" />
                  Big Wins
                </TabsTrigger>
                <TabsTrigger value="tips" className="data-[state=active]:bg-emerald/20 data-[state=active]:text-emerald">
                  <Star className="w-4 h-4 mr-1" />
                  Tips
                </TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="space-y-4">
                {communityPosts.map((post) => (
                  <Card key={post.id} className="bg-gaming-card border-border/50 hover:border-premium-gold/30 transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTierColor(post.tier)} flex items-center justify-center text-xl`}>
                          {post.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{post.username}</span>
                            <Badge variant="outline" className={`text-xs capitalize border-${post.tier === 'diamond' ? 'cyan-400' : post.tier === 'gold' ? 'premium-gold' : 'gray-400'}/50`}>
                              {post.tier}
                            </Badge>
                            {post.isWin && (
                              <Badge className="bg-turquoise/20 text-turquoise text-xs">
                                <Trophy className="w-3 h-3 mr-1" />
                                {post.winAmount}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground ml-auto">{post.time}</span>
                          </div>
                          <p className="text-foreground mb-3">{post.content}</p>
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-mystic-red transition-colors">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-turquoise transition-colors">
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-sm">{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-premium-gold transition-colors">
                              <Share2 className="w-4 h-4" />
                              <span className="text-sm">Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="wins" className="space-y-4">
                {communityPosts.filter(p => p.isWin).map((post) => (
                  <Card key={post.id} className="bg-gaming-card border-turquoise/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTierColor(post.tier)} flex items-center justify-center text-xl`}>
                          {post.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{post.username}</span>
                            <Badge className="bg-turquoise text-white text-xs">
                              <Trophy className="w-3 h-3 mr-1" />
                              WON {post.winAmount}
                            </Badge>
                          </div>
                          <p className="text-foreground">{post.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="tips" className="space-y-4">
                {communityPosts.filter(p => !p.isWin).map((post) => (
                  <Card key={post.id} className="bg-gaming-card border-emerald/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getTierColor(post.tier)} flex items-center justify-center text-xl`}>
                          {post.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{post.username}</span>
                            <Badge variant="outline" className="text-xs border-emerald/50 text-emerald">
                              <Star className="w-3 h-3 mr-1" />
                              Pro Tip
                            </Badge>
                          </div>
                          <p className="text-foreground">{post.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <Card className="bg-gaming-card border-premium-gold/30">
              <CardHeader className="pb-2">
                <CardTitle className="font-cinzel text-premium-gold text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Top Contributors
                </CardTitle>
                <CardDescription>This month's most active members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topContributors.map((user) => (
                  <div key={user.rank} className="flex items-center justify-between p-2 rounded bg-gaming-dark/50">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.rank === 1 ? 'bg-premium-gold text-gaming-dark' :
                        user.rank === 2 ? 'bg-gray-400 text-gaming-dark' :
                        user.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-gaming-dark text-foreground'
                      }`}>
                        {user.rank}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <Badge variant="outline" className="text-xs capitalize">{user.tier}</Badge>
                      </div>
                    </div>
                    <span className="text-premium-gold font-bold text-sm">{user.points.toLocaleString()}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="bg-gaming-card border-premium-gold/30">
              <CardHeader className="pb-2">
                <CardTitle className="font-cinzel text-premium-gold text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded bg-gaming-dark/50">
                  <span className="text-muted-foreground">Total Members</span>
                  <span className="text-premium-gold font-bold">45,234</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-gaming-dark/50">
                  <span className="text-muted-foreground">Posts Today</span>
                  <span className="text-turquoise font-bold">1,234</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-gaming-dark/50">
                  <span className="text-muted-foreground">Big Wins Shared</span>
                  <span className="text-emerald font-bold">567</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded bg-gaming-dark/50">
                  <span className="text-muted-foreground">Total Won Today</span>
                  <span className="text-premium-gold font-bold">$234,567</span>
                </div>
              </CardContent>
            </Card>

            {/* Join CTA */}
            {!user && (
              <Card className="bg-gradient-to-br from-premium-gold/20 to-ancient-bronze/20 border-premium-gold/50">
                <CardContent className="p-6 text-center">
                  <Users className="w-10 h-10 text-premium-gold mx-auto mb-3" />
                  <h3 className="font-cinzel font-bold text-premium-gold mb-2">Join the Community</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Share wins, get tips, and connect with winners!
                  </p>
                  <Button 
                    className="w-full bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-bold"
                    onClick={() => navigate('/auth')}
                  >
                    Sign Up Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Community;
