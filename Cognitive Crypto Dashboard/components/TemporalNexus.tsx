
import React, { useState, useMemo } from 'react';
import { CryptoData } from '../types';
import { X, Plus, Activity, Loader2, Lock } from 'lucide-react';
import { useTemporalScanner } from '../hooks/useTemporalScanner';
import { TemporalChart } from './TemporalChart';
import { CurveType } from 'recharts/types/shape/Curve';

interface Props {
  data: CryptoData[];
  activeIds: string[];
  onToggleAsset: (id: string) => void;
  onAddAsset: () => void;
}

type Timeframe = '1H' | '24H' | '7D';
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export const TemporalNexus: React.FC<Props> = ({ data, activeIds, onToggleAsset, onAddAsset }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('7D');
  
  // Filter full data object to just the active ones
  const activeAssets = useMemo(() => {
    return data.filter(d => activeIds.includes(d.id));
  }, [data, activeIds]);

  // Use the custom hook with activeTimeframe to prioritize fetching
  const { historyCache, readyTimeframes, syncingTimeframe } = useTemporalScanner(activeAssets, timeframe);

  // Normalize Data for the Chart
  const chartData = useMemo(() => {
    if (activeAssets.length === 0) return [];
    
    // Helper to get raw price array based on timeframe source
    const getPrices = (asset: CryptoData): number[] => {
      // 1. Instant Props Data
      if (timeframe === '24H') return asset.sparkline_in_7d?.price?.slice(-24) || [];
      if (timeframe === '7D') return asset.sparkline_in_7d?.price || [];

      // 2. Cached Async Data
      if (timeframe === '1H') return historyCache[asset.id]?.['1H']?.slice(-12) || [];
      
      return [];
    };

    // Build datasets
    const datasets = activeAssets.map(asset => ({
      id: asset.id,
      prices: getPrices(asset)
    })).filter(ds => ds.prices.length > 0);

    if (datasets.length === 0) return [];

    // Find the shortest length to ensure alignment from the RIGHT (Latest data)
    const minLength = Math.min(...datasets.map(d => d.prices.length));
    const normalized = [];

    // Slice all datasets to the same length from the END
    const alignedDatasets = datasets.map(ds => ({
      ...ds,
      prices: ds.prices.slice(-minLength)
    }));

    for (let i = 0; i < minLength; i++) {
      const point: any = { index: i };
      alignedDatasets.forEach(ds => {
        const current = ds.prices[i];
        const start = ds.prices[0]; // Normalize against the first point of the VISIBLE range
        
        // Prevent division by zero
        if (start && start !== 0) {
           point[ds.id] = ((current - start) / start) * 100;
        } else {
           point[ds.id] = 0;
        }
      });
      normalized.push(point);
    }

    return normalized;
  }, [activeAssets, timeframe, historyCache]);

  // Determine the smoothing algorithm based on timeframe
  // 1H: 'basis' creates very organic, fluid curves (Good for short term noise reduction)
  // 7D: 'linear' creates jagged, precise lines (Good for showing volatility history)
  // 24H: 'monotone' creates a standard balanced curve
  const curveType: CurveType = useMemo(() => {
    if (timeframe === '1H') return 'basis';
    if (timeframe === '7D') return 'linear';
    return 'monotone';
  }, [timeframe]);

  return (
    <div className="bg-term-panel border border-term-border rounded-xl p-6 shadow-lg relative overflow-hidden min-h-[350px]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Activity size={120} />
      </div>

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 z-10 relative">
        
        {/* Active Asset Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest mr-2">Nexus Feed:</span>
          {activeAssets.map((asset, idx) => (
            <button
              key={asset.id}
              onClick={() => onToggleAsset(asset.id)}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-term-bg border border-term-border text-xs font-mono text-text-main hover:border-term-accent transition-all group"
              style={{ borderLeftColor: COLORS[idx % COLORS.length], borderLeftWidth: 3 }}
            >
              <span>{asset.symbol.toUpperCase()}</span>
              <X size={10} className="text-text-muted group-hover:text-red-400" />
            </button>
          ))}
          
          {activeAssets.length < 5 && (
            <button 
              onClick={onAddAsset}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-term-accent/10 border border-dashed border-term-accent/40 text-xs font-mono text-term-accent hover:bg-term-accent hover:text-white transition-all"
            >
              <Plus size={10} />
              <span>ADD</span>
            </button>
          )}
        </div>

        {/* Timeframe Selector */}
        <div className="flex bg-term-bg p-1 rounded-lg border border-term-border">
            {(['1H', '24H', '7D'] as Timeframe[]).map((tf) => {
                const isReady = readyTimeframes.has(tf);
                const isSyncing = syncingTimeframe === tf;
                const isActive = timeframe === tf;
                const canClick = true; 

                return (
                    <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`
                            px-3 py-1 rounded text-[10px] font-bold transition-all flex items-center gap-1.5
                            ${isActive 
                                ? 'bg-term-header text-white shadow-sm ring-1 ring-term-border' 
                                : canClick
                                    ? 'text-text-muted hover:text-text-main cursor-pointer' 
                                    : 'text-text-muted/30 cursor-not-allowed bg-black/20'
                            }
                        `}
                    >
                        {tf}
                        {isActive && isSyncing && <Loader2 size={8} className="animate-spin text-term-accent" />}
                        {!isReady && !isActive && <Lock size={8} className="opacity-50" />}
                    </button>
                );
            })}
        </div>
      </div>

      {/* Chart Component */}
      <div className="h-[250px] w-full z-10 relative">
        <TemporalChart 
            data={chartData} 
            activeAssets={activeAssets} 
            colors={COLORS} 
            isLoading={!!syncingTimeframe}
            curveType={curveType}
        />
      </div>

      <div className="mt-2 text-center text-[9px] text-text-muted font-mono uppercase tracking-widest flex items-center justify-center gap-2">
          <span>Comparative Performance ({timeframe})</span>
          <span className="text-term-border">•</span>
          <span>Normalized Baseline (0%)</span>
          {syncingTimeframe && timeframe === syncingTimeframe && (
            <span className="ml-2 text-term-accent animate-pulse flex items-center gap-1">
               <Loader2 size={8} className="animate-spin" />
               SYNCING STREAM...
            </span>
          )}
      </div>
    </div>
  );
};
