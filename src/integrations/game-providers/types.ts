/**
 * Game Provider Integration Types
 * Supports JILI, Boomberg, Pragmatic Play, and other providers
 */

export type GameProviderCode = 
  | 'jili' 
  | 'boomberg' 
  | 'pragmatic' 
  | 'netent' 
  | 'evolution' 
  | 'playson'
  | 'bgaming'
  | 'hacksaw'
  | 'demo';

export interface GameProviderConfig {
  code: GameProviderCode;
  name: string;
  apiEndpoint: string;
  apiKey: string;
  secretKey: string;
  iframeBaseUrl: string;
  launchUrl: string;
  status: 'active' | 'inactive' | 'maintenance';
  rngCertification: string;
  licenseJurisdiction: string;
}

export interface GameLaunchParams {
  gameCode: string;
  userId: string;
  sessionId?: string;
  currency: string;
  language: string;
  mode: 'real' | 'demo';
  betLimits?: {
    min: number;
    max: number;
  };
}

export interface GameLaunchResponse {
  launchUrl: string;
  sessionToken: string;
  expiresAt: string;
  gameId: string;
}

export interface GameProviderBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface GameTransaction {
  transactionId: string;
  gameId: string;
  userId: string;
  amount: number;
  type: 'bet' | 'win' | 'refund';
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

