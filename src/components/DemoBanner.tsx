import { AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DemoBanner = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2">
        <div className="container mx-auto flex items-center justify-center gap-2 text-amber-300 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">
            DEMO PLATFORM — No real money. For preview and educational testing only.
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-300 hover:text-amber-100 hover:bg-amber-500/20 h-6 px-2"
            onClick={() => setShowInfo(true)}
          >
            <Info className="w-3 h-3 mr-1" />
            Learn More
          </Button>
        </div>
      </div>

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Demo Platform Information
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-muted-foreground">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-amber-300 mb-2">Important Notice</h4>
              <p className="text-sm">
                This is a <strong>demonstration platform</strong> using test credits only. 
                No real money is involved in any transactions or gameplay.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">How Demo Mode Works</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Demo Credits:</strong> All balances shown are test credits (XP), not real currency.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Server-Side RNG:</strong> All game outcomes are generated server-side using seeded random number generation for auditability.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>No Withdrawals:</strong> Demo credits cannot be withdrawn or converted to real money.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Educational Purpose:</strong> This platform demonstrates slot mechanics for preview and testing purposes only.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span><strong>Not Certified:</strong> Game outcomes are simulations and not certified by gaming regulators.</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="text-muted-foreground">
                Provider names and game titles shown are for demonstration purposes only 
                and represent simulated gameplay experiences, not actual licensed provider integrations.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
