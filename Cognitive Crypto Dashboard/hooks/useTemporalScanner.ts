import { useState, useEffect, useRef } from 'react';
import { CryptoData } from '../types';
import { fetchAssetHistory } from '../services/cryptoService';

type Timeframe = '1H' | '24H' | '7D';
const BASE_SYNC_ORDER: Timeframe[] = ['1H'];

export const useTemporalScanner = (activeAssets: CryptoData[], activeTimeframe: Timeframe) => {
  // Cache structure: { coinId: { '1H': [100, 102...] } }
  const [historyCache, setHistoryCache] = useState<Record<string, Record<string, number[]>>>({});
  
  // Track which timeframes have complete data for the current active set
  const [readyTimeframes, setReadyTimeframes] = useState<Set<Timeframe>>(new Set(['24H', '7D']));
  
  // Visual feedback for what's currently loading
  const [syncingTimeframe, setSyncingTimeframe] = useState<Timeframe | null>(null);

  // Create a stable identifier for the asset set to avoid re-running on simple price updates
  const assetIds = activeAssets.map(a => a.id).sort().join(',');

  useEffect(() => {
    let isMounted = true;

    const scan = async () => {
      if (activeAssets.length === 0) return;

      // 1. Reset ready state (keep 24H/7D as they are instant)
      setReadyTimeframes(prev => {
        const next = new Set(prev);
        BASE_SYNC_ORDER.forEach(tf => next.delete(tf));
        return next;
      });

      // 2. Initial Cooldown
      await new Promise(resolve => setTimeout(resolve, 2000));
      if (!isMounted) return;

      // 3. Dynamic Priority: Put the user's SELECTED timeframe first in the queue (if it needs fetching)
      const dynamicOrder = [
        activeTimeframe,
        ...BASE_SYNC_ORDER.filter(t => t !== activeTimeframe)
      ].filter(t => BASE_SYNC_ORDER.includes(t)); 

      for (const tf of dynamicOrder) {
        if (!isMounted) return;

        // Check cache for ALL active assets
        const missingAssets = activeAssets.filter(asset => {
          const cached = historyCache[asset.id]?.[tf];
          return cached === undefined; 
        });

        if (missingAssets.length === 0) {
          if (isMounted) setReadyTimeframes(prev => new Set(prev).add(tf));
          continue;
        }

        if (isMounted) setSyncingTimeframe(tf);
        
        // PARAMETER MAPPING:
        // 1H -> 1 day (High res), then sliced in UI
        const apiDays = '1';

        for (const asset of missingAssets) {
          if (!isMounted) return;

          try {
            const prices = await fetchAssetHistory(asset.id, apiDays);
            
            setHistoryCache(prev => ({
              ...prev,
              [asset.id]: {
                ...(prev[asset.id] || {}),
                [tf]: prices || []
              }
            }));
            
          } catch (e) {
            console.warn(`[TemporalScanner] Failed to sync ${asset.id} (${tf})`, e);
          }

          // Backoff between individual coin requests
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        if (isMounted) setReadyTimeframes(prev => new Set(prev).add(tf));
      }

      if (isMounted) setSyncingTimeframe(null);
    };

    scan();

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetIds, activeTimeframe]);

  return { historyCache, readyTimeframes, syncingTimeframe };
};