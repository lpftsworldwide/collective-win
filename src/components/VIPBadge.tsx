import { Crown, Star, Diamond, Gem, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VIPBadgeProps {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const tierConfig = {
  bronze: {
    icon: Shield,
    label: "Bronze",
    colors: "from-amber-700 to-amber-900 text-amber-100",
    border: "border-amber-600/50",
    glow: "",
  },
  silver: {
    icon: Star,
    label: "Silver",
    colors: "from-slate-300 to-slate-500 text-slate-900",
    border: "border-slate-400/50",
    glow: "",
  },
  gold: {
    icon: Crown,
    label: "Gold",
    colors: "from-premium-gold to-ancient-bronze text-gaming-dark",
    border: "border-premium-gold/50",
    glow: "shadow-[0_0_15px_hsl(45_85%_50%/0.4)]",
  },
  platinum: {
    icon: Gem,
    label: "Platinum",
    colors: "from-cyan-300 to-cyan-600 text-cyan-950",
    border: "border-cyan-400/50",
    glow: "shadow-[0_0_20px_hsl(180_60%_50%/0.5)]",
  },
  diamond: {
    icon: Diamond,
    label: "Diamond",
    colors: "from-violet-300 via-pink-300 to-cyan-300 text-violet-950",
    border: "border-violet-400/50",
    glow: "shadow-[0_0_25px_hsl(280_60%_60%/0.6)] animate-pulse",
  },
};

const sizeConfig = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

const iconSize = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export const VIPBadge = ({ tier, showLabel = true, size = 'md' }: VIPBadgeProps) => {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Badge
      className={cn(
        "bg-gradient-to-r font-cinzel font-bold gap-1",
        config.colors,
        config.border,
        config.glow,
        sizeConfig[size]
      )}
    >
      <Icon className={iconSize[size]} />
      {showLabel && config.label}
    </Badge>
  );
};
