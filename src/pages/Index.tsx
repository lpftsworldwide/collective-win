import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { paymentMethods } from "@/data/gameLibrary";
import { PaymentMethodCard } from "@/components/PaymentMethodCard";
import { KYCModal } from "@/components/KYCModal";
import { GameCatalog } from "@/components/GameCatalog";
import { AdminGameToggle } from "@/components/AdminGameToggle";
import { WinnersLeaderboard } from "@/components/WinnersLeaderboard";
import { LiveWinsTicker } from "@/components/LiveWinsTicker";
import { LaunchHypeBanner } from "@/components/LaunchHypeBanner";
import { MobileNav } from "@/components/MobileNav";
import { SignupBonusBanner } from "@/components/SignupBonusBanner";
import { VIPCard } from "@/components/VIPCard";
import { LiveTransactionsFeed } from "@/components/LiveTransactionsFeed";
import { RTPMarketingBanner } from "@/components/RTPMarketingBanner";
import { GameLeaderboard } from "@/components/GameLeaderboard";
import { Footer } from "@/components/Footer";
import { TarotLoreBanner } from "@/components/TarotLoreBanner";
import { RewardsShowcase } from "@/components/RewardsShowcase";
// Removed DemoBanner - this is a REAL MONEY platform
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trophy, CreditCard, Shield, Sparkles, LogOut, User, Activity, ScrollText, Pyramid, Crown, Eye, Gift, Ticket, Users, Gem, ShoppingBag, ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/contexts/AuthContext";
import { GamingAdvisor } from "@/components/GamingAdvisor";
import { AdminTestPanel } from "@/components/AdminTestPanel";
import { AdminDashboard } from "@/components/AdminDashboard";
import { useUserRole } from "@/hooks/useUserRole";
import { RealtimeMonitor } from "@/components/RealtimeMonitor";
import { UserBalanceDisplay } from "@/components/UserBalanceDisplay";
import { SoundToggle } from "@/components/SoundToggle";

const Index = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [kycModalOpen, setKycModalOpen] = useState(false);
  const [authInterceptOpen, setAuthInterceptOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative hieroglyph-bg tarot-bg">
      {/* Ancient Tarot & Mystical background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(270_50%_15%/0.5),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(45_85%_20%/0.4),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,hsl(230_30%_2%)_100%)]" />
        
        {/* Ancient scriptures and tarot symbols */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-premium-gold/8 text-3xl md:text-4xl animate-hieroglyph"
            style={{
              left: `${(i * 5) + 2}%`,
              top: `${Math.random() * 90 + 5}%`,
              animationDelay: `${i * 0.3}s`,
              fontFamily: 'serif',
            }}
          >
            {['⚡', '🃏', '🃎', '🃍', '⭐', '🔮', '👁', '⚰', '⚱', '☥', '𓂀', '𓃭', '𓆣', '𓇳', '𓊹', '𓋹', '𓏏', '𓂋', '∞', '☯'][i % 20]}
          </div>
        ))}
        
        {/* Tarot card outlines floating */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`tarot-${i}`}
            className="absolute border border-premium-gold/5 rounded-lg animate-float"
            style={{
              width: '120px',
              height: '180px',
              left: `${(i * 12) + 5}%`,
              top: `${Math.random() * 70 + 10}%`,
              animationDelay: `${i * 0.8}s`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-premium-gold/20 bg-gaming-dark/95 backdrop-blur-sm sticky top-0 z-40 relative">
        {/* Egyptian top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-premium-gold to-transparent" />
        
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-premium-gold via-ancient-bronze to-premium-gold flex items-center justify-center glow-gold">
                <Crown className="w-7 h-7 text-gaming-dark" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-cinzel font-bold text-premium-gold glow-gold-text">
                  <span className="inline md:inline">Collective</span>
                  <span className="block md:inline"> Winners</span>
                </h1>
                <p className="text-xs text-papyrus/70 font-crimson flex items-center gap-1">
                  <ScrollText className="w-3 h-3" />
                  Ancient Fortune Awaits
                </p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-premium-gold/10 text-premium-gold border-0 data-[state=open]:bg-premium-gold/20">
                      <Pyramid className="w-4 h-4 mr-1" />
                      Sanctuary
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[200px] p-2 bg-gaming-dark/95 backdrop-blur-md border border-premium-gold/30 rounded-lg">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-premium-gold hover:bg-premium-gold/10 mb-1"
                          onClick={() => navigate("/sanctuary/stones")}
                        >
                          <Gem className="w-4 h-4 mr-2" />
                          Spiritual Stones
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-premium-gold hover:bg-premium-gold/10"
                          onClick={() => navigate("/sanctuary/merch")}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Merch & Relics
                        </Button>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/rewards")}
                className="text-premium-gold hover:bg-premium-gold/10"
              >
                <Gift className="w-4 h-4 mr-1" />
                Rewards
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/raffle")}
                className="text-mystic-red hover:bg-mystic-red/10"
              >
                <Ticket className="w-4 h-4 mr-1" />
                $100K Raffle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/community/feed")}
                className="text-turquoise hover:bg-turquoise/10"
              >
                <Users className="w-4 h-4 mr-1" />
                Community
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/nfts")}
                className="text-premium-gold hover:bg-premium-gold/10"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                NFTs
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/daily-reading")}
                className="text-premium-gold hover:bg-premium-gold/10"
              >
                <ScrollText className="w-4 h-4 mr-1" />
                Daily Reading
              </Button>
              
              {user ? (
                <>
                  <UserBalanceDisplay />
                  <SoundToggle />
                  <GamingAdvisor />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">{user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="border-premium-gold/30 text-premium-gold hover:bg-premium-gold/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <SoundToggle />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="border-turquoise/50 text-turquoise hover:bg-turquoise/10"
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="bg-gradient-to-r from-premium-gold to-ancient-bronze hover:opacity-90 font-bold"
                  >
                    <Sparkles className="w-4 h-4 mr-1" />
                    Join Now
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Nav */}
            <MobileNav />
          </div>
        </div>
      </header>

      {/* Real Money Platform - No demo banner */}

      {/* Signup Bonus Banner */}
      <SignupBonusBanner />

      {/* Live Wins Ticker */}
      <LiveWinsTicker />

      <main className="min-h-screen relative">
        {/* Launch Hype Banner */}
        <LaunchHypeBanner />

        {/* RTP Marketing Banner - #1 in Australia */}
        <section className="container mx-auto px-4 py-6">
          <RTPMarketingBanner />
        </section>

        {/* Tarot Lore Banner */}
        <TarotLoreBanner />

        {/* Rewards Showcase */}
        <RewardsShowcase />

        {/* Live Transactions + VIP Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Transactions */}
            <div className="lg:col-span-2">
              <LiveTransactionsFeed />
            </div>
            
            {/* VIP Card */}
            <div>
              <VIPCard />
            </div>
          </div>
        </section>

        {/* Winners Leaderboard with Animated Simulation */}
        <section className="container mx-auto px-4 py-8">
          <WinnersLeaderboard />
        </section>

        {/* Game Leaderboard */}
        <section className="container mx-auto px-4 py-8">
          <GameLeaderboard />
        </section>

        {/* Egyptian Divider */}
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-premium-gold/50" />
            <div className="flex items-center gap-2 text-premium-gold/50">
              <span className="text-xl">𓃭</span>
              <Pyramid className="w-6 h-6" />
              <span className="text-xl">𓃭</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-premium-gold/50" />
          </div>
        </div>

        {/* Game Catalog */}
        <section id="games" className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-premium-gold/10 border border-premium-gold/30">
                <Sparkles className="w-6 h-6 text-premium-gold" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-premium-gold">
                  Sacred Games Library
                </h2>
                <p className="text-sm text-muted-foreground">Sign up to unlock ancient treasures</p>
              </div>
            </div>
            
            {!user && (
              <Button
                onClick={() => navigate('/auth')}
                className="hidden md:flex bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-cinzel font-bold glow-gold"
              >
                <Crown className="w-4 h-4 mr-2" />
                Claim $111 Bonus
              </Button>
            )}
          </div>
          <GameCatalog />
        </section>

        {/* Real-time Monitoring Dashboard */}
        {user && (
          <section className="container mx-auto px-4 py-8">
            <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-premium-gold mb-6 flex items-center gap-3">
              <Activity className="w-6 h-6" />
              Oracle&apos;s Vision
            </h2>
            <RealtimeMonitor />
          </section>
        )}

        {/* Admin Sections */}
        {user && isAdmin && !roleLoading && (
          <>
            <section className="container mx-auto px-4 py-8">
              <AdminGameToggle />
            </section>
            <section className="container mx-auto px-4 py-8">
              <AdminDashboard />
            </section>
            <section className="container mx-auto px-4 py-8">
              <AdminTestPanel />
            </section>
          </>
        )}

        {/* Payment Methods */}
        <section className="space-y-8 py-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-premium-gold/10 border border-premium-gold/30 mb-4">
              <CreditCard className="w-4 h-4 text-premium-gold" />
              <span className="text-sm text-premium-gold font-medium">Sacred Treasury</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-cinzel font-bold text-foreground">Fund Your Journey</h3>
            <p className="text-muted-foreground font-crimson">
              Multiple secure payment options with instant deposits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 container mx-auto px-4">
            {paymentMethods.map((method) => (
              <div 
                key={method.id} 
                onClick={() => navigate('/deposit')}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <PaymentMethodCard {...method} />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={() => navigate('/deposit')}
              className="bg-gradient-to-r from-turquoise to-emerald text-white font-bold"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Deposit Now
            </Button>
            <Button
              variant="outline"
              onClick={() => setKycModalOpen(true)}
              className="border-premium-gold/30 text-premium-gold hover:bg-premium-gold/10"
            >
              <Shield className="w-4 h-4 mr-2" />
              Verification Scroll
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <KYCModal open={kycModalOpen} onOpenChange={setKycModalOpen} />
      
      {/* Auth Intercept Modal */}
      <Dialog open={authInterceptOpen} onOpenChange={setAuthInterceptOpen}>
        <DialogContent className="sm:max-w-md bg-gaming-card border-premium-gold/30 tarot-card">
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-premium-gold to-ancient-bronze flex items-center justify-center glow-gold">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-cinzel font-bold text-premium-gold">The Oracle Speaks</h2>
            <p className="text-foreground leading-relaxed font-crimson">
              Your destiny awaits! Complete your sacred registration to unlock ancient treasures, 
              mystical bonuses, and instant rewards. The gates of fortune are opening...
            </p>
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={() => {
                  setAuthInterceptOpen(false);
                  navigate("/auth");
                }}
                className="w-full bg-gradient-to-r from-premium-gold to-ancient-bronze hover:opacity-90 font-bold"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Register Now & Claim $111 Bonus
              </Button>
              <Button
                onClick={() => {
                  setAuthInterceptOpen(false);
                  navigate("/auth");
                }}
                variant="outline"
                className="w-full border-turquoise/50 text-turquoise hover:bg-turquoise/10"
              >
                Already Initiated? Login
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
