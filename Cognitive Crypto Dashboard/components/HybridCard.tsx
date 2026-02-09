
import React from 'react';
import { CryptoData } from '../types';
import { PriceTicker } from './PriceTicker';
import { ArrowUp, ArrowDown, Database, Clock } from 'lucide-react';
import { useFocus } from '../context/FocusContext';

interface Props {
  data: CryptoData;
}

export const HybridCard: React.FC<Props> = ({ data }) => {
  const { setFocusedId, isDimmed } = useFocus();
  const dimmed = isDimmed(data.id);
  
  const isTrendUp = data.price_change_percentage_24h >= 0;
  const accentColor = isTrendUp ? 'bg-trade-up' : 'bg-trade-down';
  
  // Tag Logic
  const volCapRatio = data.total_volume / data.market_cap;
  const isHighVol = volCapRatio > 0.05;

  return (
    <div 
      onMouseEnter={() => setFocusedId(data.id)}
      onMouseLeave={() => setFocusedId(null)}
      className={`
        group relative w-full bg-term-panel border border-term-border rounded-lg p-5 overflow-hidden 
        transition-all duration-300 hover:bg-term-header hover:border-term-accent/40 hover:shadow-lg hover:-translate-y-0.5
        ${dimmed ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}
      `}
    >
      {/* Accent Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor}`} />

      <div className="flex items-start justify-between">
         
         {/* Left Section */}
         <div className="flex gap-4 pl-2">
             <img src={data.image} alt={data.name} className="w-10 h-10 rounded-full bg-term-bg shadow-sm" />
             
             <div>
                 <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base text-white leading-none">{data.name}</h3>
                    <span className="text-[10px] text-text-muted bg-term-border/40 px-1.5 rounded font-mono uppercase">
                        {data.symbol}
                    </span>
                 </div>
                 
                 {/* Metadata Tags Row */}
                 <div className="flex items-center gap-2">
                     {isHighVol && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[9px] font-bold text-orange-400 uppercase tracking-wide">
                            <Clock size={8} /> Active
                        </div>
                     )}
                     <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 uppercase tracking-wide">
                        <Database size={8} /> Cap ${(data.market_cap / 1e9).toFixed(1)}B
                     </div>
                 </div>
             </div>
         </div>

         {/* Right Section: Price Block */}
         <div className="text-right">
             <PriceTicker value={data.current_price} className="text-lg font-bold text-white block bg-transparent p-0 mb-1" />
             <div className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-full ${isTrendUp ? 'bg-trade-up/10 text-trade-up' : 'bg-trade-down/10 text-trade-down'}`}>
                {isTrendUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                {Math.abs(data.price_change_percentage_24h).toFixed(2)}%
             </div>
         </div>
      </div>
      
      {/* Optional: Very subtle background range bar or decoration could go here, but keeping it clean for 'Task Item' look */}
    </div>
  );
};
