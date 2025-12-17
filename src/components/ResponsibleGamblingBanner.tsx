/**
 * Responsible Gambling Banner
 * Prominent header displayed on all pages
 */

import { AlertTriangle, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ResponsibleGamblingBanner = () => {
  const [dismissed, setDismissed] = useState(() => {
    // Check if user has dismissed (stored in sessionStorage)
    return sessionStorage.getItem('rg-banner-dismissed') === 'true';
  });

  if (dismissed) {
    return null;
  }

  return (
    <Alert className="border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-amber-600/20 to-amber-500/20 rounded-none border-x-0 border-t-0 mb-0 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Shield className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="flex-1">
              <AlertDescription className="text-foreground font-semibold text-sm">
                <span className="text-amber-400">18+ | Play Responsibly</span>
                {' '}• Compulsive gaming is when a person risks something in a hope to get something bigger in return. 
                Gambling addiction is the urge to continue betting no matter what impact the losses have on one's life.
              </AlertDescription>
              <div className="flex items-center gap-4 mt-2 text-xs">
                <Link 
                  to="/responsible-gambling" 
                  className="text-amber-300 hover:text-amber-200 underline font-medium"
                >
                  Get Help
                </Link>
                <span className="text-muted-foreground">|</span>
                <a 
                  href="tel:0800654655" 
                  className="text-amber-300 hover:text-amber-200 underline font-medium"
                >
                  Gambling Helpline: 0800 654 655
                </a>
                <span className="text-muted-foreground">|</span>
                <a 
                  href="https://www.problemgambling.org.nz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-300 hover:text-amber-200 underline font-medium"
                >
                  Problem Gambling Foundation
                </a>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setDismissed(true);
              sessionStorage.setItem('rg-banner-dismissed', 'true');
            }}
            className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
};

