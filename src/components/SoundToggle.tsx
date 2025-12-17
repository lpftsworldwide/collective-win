import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSound } from "@/contexts/SoundContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SoundToggle = () => {
  const { isMuted, toggleMute } = useSound();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className={`h-9 w-9 ${
            isMuted 
              ? "text-muted-foreground hover:text-foreground" 
              : "text-premium-gold hover:text-premium-gold/80"
          }`}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isMuted ? "Unmute sounds" : "Mute sounds"}</p>
      </TooltipContent>
    </Tooltip>
  );
};
