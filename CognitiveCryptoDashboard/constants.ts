import { CryptoData } from './types';

// Helper to generate fake chart data for fallback
const generateFakeHistory = (basePrice: number, points: number = 168) => {
  let prices = [basePrice];
  for (let i = 1; i < points; i++) {
    const change = (Math.random() - 0.5) * (basePrice * 0.05);
    prices.push(prices[i-1] + change);
  }
  return prices;
};

// Fallback data for the "Safety Layer" when all APIs fail
export const STATIC_TRUTH_DATA: CryptoData[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 64230.50,
    price_change_percentage_24h: 1.2,
    high_24h: 65000,
    low_24h: 63000,
    market_cap: 1200000000000,
    total_volume: 35000000000,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: generateFakeHistory(64230) }
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 3450.20,
    price_change_percentage_24h: -0.5,
    high_24h: 3500,
    low_24h: 3400,
    market_cap: 400000000000,
    total_volume: 15000000000,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: generateFakeHistory(3450) }
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    current_price: 145.80,
    price_change_percentage_24h: 5.4,
    high_24h: 150,
    low_24h: 138,
    market_cap: 65000000000,
    total_volume: 4000000000,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: generateFakeHistory(145) }
  },
   {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    current_price: 0.45,
    price_change_percentage_24h: -1.2,
    high_24h: 0.46,
    low_24h: 0.44,
    market_cap: 16000000000,
    total_volume: 400000000,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: generateFakeHistory(0.45) }
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    current_price: 0.60,
    price_change_percentage_24h: 0.8,
    high_24h: 0.61,
    low_24h: 0.59,
    market_cap: 33000000000,
    total_volume: 1200000000,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: { price: generateFakeHistory(0.60) }
  }
];

export const REFRESH_RATE_MS = 30000; 
export const STALE_THRESHOLD_MS = 5 * 60 * 1000;