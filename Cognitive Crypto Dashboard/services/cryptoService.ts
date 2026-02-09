import { CryptoData, DataIntegrityStatus, MarketState } from '../types';
import { STATIC_TRUTH_DATA, STALE_THRESHOLD_MS } from '../constants';

const STORAGE_KEY = 'crypto_dashboard_cache_v2';
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Helper to calculate freshness
const calculateIntegrity = (lastUpdated: number): DataIntegrityStatus => {
  const diff = Date.now() - lastUpdated;
  if (diff < 30000) return DataIntegrityStatus.REALTIME; // < 30s
  if (diff < STALE_THRESHOLD_MS) return DataIntegrityStatus.RECENT; // < 5m
  return DataIntegrityStatus.STALE;
};

export const fetchMarketData = async (): Promise<MarketState> => {
  // Layer 1: Try Real-time (Hot Data) - Default Top Coins
  try {
    const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=true`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data: CryptoData[] = await response.json();
    const timestamp = Date.now();

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, timestamp }));

    return {
      data,
      status: DataIntegrityStatus.REALTIME,
      lastFetchAttempt: timestamp
    };

  } catch (error) {
    console.warn("Layer 1 (Realtime) Failed:", error);
    
    // Layer 2: Try Cache
    const cachedRaw = localStorage.getItem(STORAGE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw);
      const integrity = calculateIntegrity(cached.timestamp);
      return {
        data: cached.data,
        status: integrity === DataIntegrityStatus.REALTIME ? DataIntegrityStatus.RECENT : DataIntegrityStatus.STALE,
        lastFetchAttempt: Date.now(),
        error: "Network unavailable. Showing last known truths."
      };
    }

    // Layer 3: Static Truth
    return {
      data: STATIC_TRUTH_DATA,
      status: DataIntegrityStatus.HISTORICAL,
      lastFetchAttempt: Date.now(),
      error: "System offline. Operating in historical reference mode."
    };
  }
};

// NEW: Search for assets to inject
export const searchAssets = async (query: string) => {
  if (query.length < 2) return [];
  try {
    const response = await fetch(`${BASE_URL}/search?query=${query}`);
    const data = await response.json();
    return data.coins.slice(0, 5); // Return top 5 results
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
};

// NEW: Fetch specific coin data to inject into dashboard
export const fetchSpecificCoin = async (coinId: string): Promise<CryptoData | null> => {
  try {
    const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&ids=${coinId}&sparkline=true`);
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error("Fetch specific coin failed:", error);
    return null;
  }
};

// NEW: Fetch history for chart
// Simplified back to basics since we removed 30D/1Y support
export const fetchAssetHistory = async (coinId: string, days: string): Promise<number[]> => {
  try {
    const response = await fetch(`${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    
    if (data && data.prices) {
      return data.prices.map((item: number[]) => item[1]);
    }
    return [];
  } catch (error) {
    return [];
  }
};