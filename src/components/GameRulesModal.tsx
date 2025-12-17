import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Game } from "@/data/gameLibrary";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GameRulesModalProps {
  game: Game | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GameRulesModal = ({ game, open, onOpenChange }: GameRulesModalProps) => {
  if (!game) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gaming-dark border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-premium-gold">{game.GameTitle}</DialogTitle>
          <DialogDescription className="text-foreground/80">
            {game.UI_ShortDescription}
          </DialogDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge className="bg-premium-gold/20 text-premium-gold border-premium-gold/30">
              {game.GameType}
            </Badge>
            <Badge variant="outline" className="border-green-500/30 text-green-400">
              RTP {game.RTP}
            </Badge>
            <Badge variant="outline">{game.Volatility} Volatility</Badge>
            <Badge variant="secondary">{game.Provider}</Badge>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-premium-gold">Game Mechanics</h3>
              <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                {game.UI_RulesModal.Mechanics}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-premium-gold">Payout Structure</h3>
              <p className="text-sm text-foreground/90 leading-relaxed">
                {game.UI_RulesModal.PayoutStructure}
              </p>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground italic">
                Please play responsibly. This game is for entertainment purposes. The stated RTP is
                calculated over millions of game rounds and individual results will vary.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
