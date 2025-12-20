import { Skeleton } from "@/components/ui/skeleton";

export const GameCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gaming-card/50 w-full aspect-[3/4] animate-pulse">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-premium-gold/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      
      {/* Placeholder content shapes */}
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        {/* Top badges */}
        <div className="flex justify-between items-start">
          <Skeleton className="h-5 w-12 bg-gaming-dark/50" />
          <Skeleton className="h-5 w-8 bg-gaming-dark/50" />
        </div>
        
        {/* Bottom info */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 bg-gaming-dark/50" />
          <Skeleton className="h-3 w-full bg-gaming-dark/50" />
          <Skeleton className="h-3 w-3/4 bg-gaming-dark/50" />
        </div>
      </div>
    </div>
  );
};

