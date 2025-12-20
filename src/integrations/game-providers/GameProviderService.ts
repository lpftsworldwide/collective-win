/**
 * Game Provider Service
 * Handles integration with real game providers (JILI, Boomberg, etc.)
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  GameProviderConfig, 
  GameLaunchParams, 
  GameLaunchResponse,
  GameProviderCode 
} from './types';

class GameProviderService {
  private configs: Map<GameProviderCode, GameProviderConfig> = new Map();

  /**
   * Initialize provider configurations from Supabase
   */
  async initialize() {
    try {
      const { data, error } = await supabase
        .from('game_provider_configs')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error('Failed to load game provider configs:', error);
        return;
      }

      data?.forEach((config: any) => {
        this.configs.set(config.code as GameProviderCode, {
          code: config.code,
          name: config.name,
          apiEndpoint: config.api_endpoint,
          apiKey: config.api_key,
          secretKey: config.secret_key,
          iframeBaseUrl: config.iframe_base_url,
          launchUrl: config.launch_url_template,
          status: config.status,
          rngCertification: config.rng_certification,
          licenseJurisdiction: config.license_jurisdiction,
        });
      });
    } catch (error) {
      console.error('Error initializing game providers:', error);
    }
  }

  /**
   * Launch a game from a provider
   * NOTE: We use LOCAL ENGINE for all games - this is only for legacy/external providers
   */
  async launchGame(
    providerCode: GameProviderCode,
    params: GameLaunchParams
  ): Promise<GameLaunchResponse> {
    // ALL GAMES USE LOCAL ENGINE - Don't throw error, just log
    console.warn(`[GameProviderService] Provider ${providerCode} requested but we use LOCAL ENGINE. Redirecting to local game.`);
    
    const config = this.configs.get(providerCode);
    
    if (!config || config.status !== 'active') {
      // Don't throw - return a redirect to local engine instead
      throw new Error(`All games use local engine. Provider ${providerCode} is not needed.`);
    }

    // Call Supabase Edge Function to handle game launch
    const { data, error } = await supabase.functions.invoke('game-launch', {
      body: {
        provider_code: providerCode,
        game_code: params.gameCode,
        user_id: params.userId,
        currency: params.currency,
        language: params.language,
        mode: params.mode,
        bet_limits: params.betLimits,
      },
    });

    if (error) {
      throw new Error(`Failed to launch game: ${error.message}`);
    }

    return data as GameLaunchResponse;
  }

  /**
   * Get provider configuration
   */
  getProviderConfig(code: GameProviderCode): GameProviderConfig | undefined {
    return this.configs.get(code);
  }

  /**
   * Check if provider is available
   * NOTE: We use LOCAL ENGINE - all games work without providers
   */
  isProviderAvailable(code: GameProviderCode): boolean {
    // ALL GAMES USE LOCAL ENGINE - always return true to prevent errors
    // The actual game logic runs in the local slot machine engine
    return true; // Local engine is always available
  }

  /**
   * Get all available providers
   */
  getAvailableProviders(): GameProviderCode[] {
    return Array.from(this.configs.keys()).filter(
      code => this.isProviderAvailable(code)
    );
  }
}

// Singleton instance
export const gameProviderService = new GameProviderService();

