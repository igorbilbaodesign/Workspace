import React from 'react';
import { CryptoData } from '../types';
import { useFocus } from '../context/FocusContext';

interface Props {
  data: CryptoData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const Watchlist: React.FC<Props> = ({ data, selectedId, onSelect }) => {
  const { setFocusedId } = useFocus();

  return (
    <div className="flex flex-col">
       {/* Header Row */}
       <div className="flex items-center px-4 py-2 bg-term-header text-[10px] uppercase text-text-muted font-bold tracking-wider sticky top-0 z-10">
          <div className="w-1/2">Asset / Vol</div>
          <div className="w-1/4 text-right">Price</div>
          <div className="w-1/4 text-right">24h</div>
       </div>

       {data.map((coin) => {
         const isSelected = coin.id === selectedId;
         const isPositive = coin.price_change_percentage_24h >= 0;

         return (
            <div 
               key={coin.id}
               onClick={() => onSelect(coin.id)}
               onMouseEnter={() => setFocusedId(coin.id)}
               onMouseLeave={() => setFocusedId(null)}
               className={`
                  flex items-center px-4 py-3 border-b border-term-border/50 cursor-pointer transition-colors
                  ${isSelected ? 'bg-term-accent/10 border-l-2 border-l-term-accent' : 'hover:bg-term-border/30 border-l-2 border-l-transparent'}
               `}
            >
               {/* Identity */}
               <div className="w-1/2 flex items-center gap-3">
                  <img src={coin.image} alt={coin.symbol} className="w-6 h-6 rounded-full" />
                  <div>
                     <div className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-text-main'}`}>
                        {coin.symbol.toUpperCase()}
                     </div>
                     <div className="text-[10px] text-text-muted">
                        ${(coin.total_volume / 1e6).toFixed(0)}M Vol
                     </div>
                  </div>
               </div>

               {/* Price */}
               <div className="w-1/4 text-right font-mono text-sm text-text-main">
                  {coin.current_price < 1 ? coin.current_price.toFixed(4) : coin.current_price.toLocaleString()}
               </div>

               {/* Change */}
               <div className={`w-1/4 text-right font-mono text-xs font-bold ${isPositive ? 'text-trade-up' : 'text-trade-down'}`}>
                  {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
               </div>
            </div>
         );
       })}
    </div>
  );
};