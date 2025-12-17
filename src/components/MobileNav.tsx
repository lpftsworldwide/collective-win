import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  Home, 
  Gamepad2, 
  Shield, 
  FileCheck, 
  Heart, 
  LogOut, 
  User,
  Sparkles,
  ScrollText,
  Crown,
  Wallet,
  Gift,
  Ticket,
  Users,
  TrendingDown,
  Volume2,
  VolumeX
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserBalanceDisplay } from "@/components/UserBalanceDisplay";
import { useSound } from "@/contexts/SoundContext";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isMuted, toggleMute } = useSound();

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Deposit", icon: Wallet, path: "/deposit" },
    { label: "Withdraw", icon: TrendingDown, path: "/withdraw" },
    { label: "Rewards", icon: Gift, path: "/rewards" },
    { label: "Raffle", icon: Ticket, path: "/raffle" },
    { label: "Community", icon: Users, path: "/community" },
    { label: "VIP Club", icon: Crown, path: "/vip" },
    { label: "Games", icon: Gamepad2, path: "/#games" },
    { label: "Fair Play", icon: Shield, path: "/fair-play" },
    { label: "KYC Verification", icon: FileCheck, path: "/kyc" },
    { label: "Responsible Gambling", icon: Heart, path: "/responsible-gambling" },
  ];

  const handleNavigate = (path: string) => {
    setOpen(false);
    if (path.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(path.replace('/#', ''));
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(path);
    }
  };

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-premium-gold hover:bg-premium-gold/10"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[280px] bg-gradient-to-b from-gaming-dark via-gaming-card to-gaming-dark border-l border-premium-gold/30"
      >
        <SheetHeader className="border-b border-premium-gold/20 pb-4">
          <SheetTitle className="flex items-center gap-2 text-premium-gold">
            <div className="p-2 rounded-lg bg-gradient-to-br from-premium-gold to-ancient-bronze">
              <Sparkles className="w-5 h-5 text-gaming-dark" />
            </div>
            <span className="font-cinzel">Collective Winners</span>
          </SheetTitle>
        </SheetHeader>

        {/* Sound Toggle */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 py-4 text-foreground hover:text-premium-gold hover:bg-premium-gold/10"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          <span className="font-medium">{isMuted ? "Unmute Sounds" : "Mute Sounds"}</span>
        </Button>

        {/* Egyptian decorative border */}
        <div className="h-1 bg-gradient-to-r from-transparent via-premium-gold to-transparent my-4" />

        <nav className="flex flex-col gap-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={`w-full justify-start gap-3 py-6 ${
                  isActive 
                    ? 'bg-premium-gold/20 text-premium-gold border-l-2 border-premium-gold' 
                    : 'text-foreground hover:text-premium-gold hover:bg-premium-gold/10'
                }`}
                onClick={() => handleNavigate(item.path)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Mystical divider */}
        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-premium-gold/50" />
          <Crown className="w-4 h-4 text-premium-gold/50" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-premium-gold/50" />
        </div>

        {/* User section */}
        {user ? (
          <div className="space-y-3">
            {/* Balance Display */}
            <UserBalanceDisplay />
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gaming-card/50 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-turquoise to-emerald flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">Active Player</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-mystic-red/50 text-mystic-red hover:bg-mystic-red/10"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-premium-gold to-ancient-bronze text-gaming-dark font-bold"
              onClick={() => handleNavigate('/auth')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Join Now
            </Button>
            <Button
              variant="outline"
              className="w-full border-turquoise/50 text-turquoise hover:bg-turquoise/10"
              onClick={() => handleNavigate('/auth')}
            >
              Login
            </Button>
          </div>
        )}

        {/* Footer mystical pattern */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ScrollText className="w-3 h-3" />
            <span>Ancient Fortune Awaits</span>
            <ScrollText className="w-3 h-3" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
