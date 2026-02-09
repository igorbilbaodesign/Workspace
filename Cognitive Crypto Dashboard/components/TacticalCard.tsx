
import React from 'react';
import { CryptoData } from '../types';
import { PriceTicker } from './PriceTicker';
import { ArrowUp, ArrowDown, Activity, BarChart2 } from 'lucide-react';

interface Props {
  data: CryptoData;
}

export const TacticalCard: React.FC<Props> = ({ data }) => {
  const isTrendUp = data.price_change_percentage_24h >= 0;
  const accentColor = isTrendUp ? 'bg-trade-up' : 'bg-trade-down';
  const glowColor = isTrendUp ? 'group-hover:shadow-[inset_4px_0_0_0_#10b981]' : 'group-hover:shadow-[inset_4px_0_0_0_#ef4444]';

  // Calculate volume intensity for a tag
  const volCapRatio = data.total_volume / data.market_cap;
  const isHighVol = volCapRatio > 0.1;

  return (
    <div className={`
      group relative w-full bg-term-panel border border-term-border rounded-lg p-4 pl-5 
      overflow-hidden transition-all duration-300 hover:bg-term-header cursor-pointer
      hover:border-term-border hover:shadow-lg
    `}>
      {/* Accent Strip (Left Border Simulation) */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} transition-all duration-300 group-hover:w-1.5`} />

      <div className="flex items-center justify-between gap-3">
         
         {/* Left: Identity & Tags */}
         <div className="flex items-center gap-3 overflow-hidden flex-1">
             {/* Icon/Checkbox Area */}
             <div className="relative flex-shrink-0">
                <img 
                    src={data.image} 
                    alt={data.name} 
                    className="w-8 h-8 rounded-full bg-term-bg border border-term-border/50 group-hover:scale-110 transition-transform" 
                />
                {isHighVol && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-term-accent rounded-full border border-term-panel flex items-center justify-center">
                        <Activity size={6} className="text-white" />
                    </div>
                )}
             </div>

             <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                   <span className="font-bold text-sm text-gray-200 truncate group-hover:text-white transition-colors">
                     {data.name}
                   </span>
                   <span className="flex-shrink-0 text-[9px] font-mono text-text-muted border border-term-border px-1 rounded bg-term-bg/50 uppercase">
                      {data.symbol}
                   </span>
                </div>
                
                {/* Horizontal Tags Row */}
                <div className="flex items-center gap-2 mt-1">
                   {isHighVol ? (
                      <span className="text-[9px] flex items-center gap-1 text-term-accent font-bold tracking-wide bg-term-accent/10 px-1.5 py-0.5 rounded border border-term-accent/20">
                         HIGH VOL
                      </span>
                   ) : (
                      <span className="text-[9px] flex items-center gap-1 text-text-muted font-bold tracking-wide bg-term-border/30 px-1.5 py-0.5 rounded border border-term-border/50">
                         NORMAL
                      </span>
                   )}
                   <span className="text-[9px] text-text-muted font-mono hidden sm:inline-block">
                     CAP: ${(data.market_cap / 1e9).toFixed(1)}B
                   </span>
                </div>
             </div>
         </div>

         {/* Right: Price & Chart Hint */}
         <div className="flex flex-col items-end flex-shrink-0 gap-0.5">
             <div className="flex items-center gap-2">
                <PriceTicker value={data.current_price} className="text-sm sm:text-base font-bold text-white bg-transparent p-0" />
             </div>
             <div className={`text-[10px] sm:text-xs font-mono font-medium flex items-center gap-1 ${isTrendUp ? 'text-trade-up' : 'text-trade-down'}`}>
                {isTrendUp ? <ArrowUp size={10} strokeWidth={3} /> : <ArrowDown size={10} strokeWidth={3} />}
                {Math.abs(data.price_change_percentage_24h).toFixed(2)}%
             </div>
         </div>
      </div>
    </div>
  );
};
