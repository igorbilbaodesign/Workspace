// Data "Freshness" States
export enum DataIntegrityStatus {
  REALTIME = 'REALTIME',   // < 30s (Sympathetic System)
  RECENT = 'RECENT',       // < 5m (Parasympathetic System)
  STALE = 'STALE',         // > 5m (Degraded Mode)
  HISTORICAL = 'HISTORICAL' // Static/Fallback (Safety Mode)
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h: number;
  low_24h: number;
  market_cap: number;
  total_volume: number;
  last_updated: string; // ISO String
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface MarketState {
  data: CryptoData[];
  status: DataIntegrityStatus;
  lastFetchAttempt: number;
  error?: string;
}

export interface AnalysisResult {
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  keyFactors: string[];
}

export type ViewMode = 'tactical' | 'strategic'; // Mobile vs Desktop mindset