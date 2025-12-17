/**
 * Licensed Game Iframe Component
 * Embeds real games from providers like JILI, Boomberg, etc.
 */

import { useEffect, useRef, useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { gameProviderService } from '@/integrations/game-providers/GameProviderService';
import type { GameProviderCode } from '@/integrations/game-providers/types';

interface LicensedGameIframeProps {
  gameCode: string;
  providerCode: GameProviderCode;
  onClose?: () => void;
  onBalanceUpdate?: (balance: number) => void;
}

export const LicensedGameIframe = ({
  gameCode,
  providerCode,
  onClose,
  onBalanceUpdate,
}: LicensedGameIframeProps) => {
  const { user } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [launchUrl, setLaunchUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setError('You must be logged in to play licensed games');
      setLoading(false);
      return;
    }

    const loadGame = async () => {
      try {
        setLoading(true);
        setError(null);

        // Launch game through provider service
        const response = await gameProviderService.launchGame(providerCode, {
          gameCode,
          userId: user.id,
          currency: 'AUD',
          language: 'en',
          mode: 'real',
        });

        setLaunchUrl(response.launchUrl);

        // Listen for balance updates from iframe
        const handleMessage = (event: MessageEvent) => {
          // Verify origin for security
          const config = gameProviderService.getProviderConfig(providerCode);
          if (!config || !event.origin.includes(new URL(config.iframeBaseUrl).hostname)) {
            return;
          }

          if (event.data.type === 'balance_update') {
            onBalanceUpdate?.(event.data.balance);
          } else if (event.data.type === 'game_closed') {
            onClose?.();
          }
        };

        window.addEventListener('message', handleMessage);

        return () => {
          window.removeEventListener('message', handleMessage);
        };
      } catch (err) {
        console.error('Failed to load game:', err);
        setError(err instanceof Error ? err.message : 'Failed to load game');
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [user, gameCode, providerCode, onClose, onBalanceUpdate]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gaming-dark/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="p-8 bg-gaming-card border-premium-gold/30">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-premium-gold animate-spin" />
            <p className="text-premium-gold font-semibold">Loading game...</p>
            <p className="text-muted-foreground text-sm">Please wait while we connect to the game server</p>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gaming-dark/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="p-8 bg-gaming-card border-mystic-red/30 max-w-md">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertTriangle className="w-12 h-12 text-mystic-red" />
            <h3 className="text-xl font-bold text-foreground">Game Load Error</h3>
            <p className="text-muted-foreground">{error}</p>
            {onClose && (
              <Button onClick={onClose} className="mt-4">
                Close
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (!launchUrl) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gaming-dark z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gaming-card border-b border-premium-gold/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-premium-gold font-bold">Playing: {gameCode}</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="text-premium-gold hover:text-premium-gold-light">
            Close Game
          </Button>
        )}
      </div>

      {/* Game Iframe */}
      <iframe
        ref={iframeRef}
        src={launchUrl}
        className="flex-1 w-full border-0"
        allow="fullscreen; autoplay; payment; geolocation"
        allowFullScreen
        title={`${gameCode} - Licensed Game`}
      />
    </div>
  );
};

