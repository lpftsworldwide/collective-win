import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Clock } from "lucide-react";

interface KYCModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KYCModal = ({ open, onOpenChange }: KYCModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-gaming-dark border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-premium-gold/10">
              <Shield className="w-6 h-6 text-premium-gold" />
            </div>
            <DialogTitle className="text-xl text-premium-gold">
              Identity Verification Required (First Payout)
            </DialogTitle>
          </div>
          <DialogDescription className="text-foreground/90 pt-4 space-y-4">
            <p className="leading-relaxed">
              To comply with global Anti-Money Laundering (AML) regulations and protect your
              account, a one-time verification is required before your first withdrawal.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-premium-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Required Documents:</p>
                  <p className="text-sm text-muted-foreground">
                    • Proof of ID (Passport/Driver's License)
                    <br />• Proof of Address (Utility Bill &lt; 3 months old)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-premium-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Processing Time:</p>
                  <p className="text-sm text-muted-foreground">
                    Review typically completed within 2-12 hours
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground italic">
                Your information is encrypted and handled in strict compliance with GDPR and
                international data protection standards.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 border-border"
          >
            Close
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-premium-gold to-[hsl(38,90%,50%)] text-primary-foreground hover:opacity-90"
            onClick={() => onOpenChange(false)}
          >
            Upload Documents
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
