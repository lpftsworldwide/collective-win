import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface DemoGameBadgeProps {
  className?: string;
}

export const DemoGameBadge = ({ className }: DemoGameBadgeProps) => {
  return (
    <Badge 
      variant="outline" 
      className={`bg-amber-500/20 text-amber-400 border-amber-500/30 ${className}`}
    >
      <AlertTriangle className="w-3 h-3 mr-1" />
      DEMO MODE
    </Badge>
  );
};