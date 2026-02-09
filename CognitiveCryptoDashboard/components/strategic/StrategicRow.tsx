
import React from 'react';
import { CryptoData } from '../../types';
import { PriceTicker } from '../PriceTicker';
import { MarketChart } from '../MarketChart';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useFocus } from '../../context/FocusContext';
import { MiniChartTimeframe } from './StrategicHeader';

interface Props {
  coin: CryptoData;
  isExpanded: boolean;
  onToggle: () => void;
  miniTimeframe: MiniChartTimeframe;
}

export const StrategicRow: React.FC<Props> = ({ coin, isExpanded, onToggle, miniTimeframe }) => {
  const { setFocusedId, isDimmed } = useFocus();
  const dimmed = isDimmed(coin.id);

  // Logic for Mini-Chart Data
  const fullHistory = coin.sparkline_in_7d?.price || [];
  const miniChartData = miniTimeframe === '24H' ? fullHistory.slice(-24) : fullHistory;
  
  const isTrendUp = miniChartData.length > 0 && miniChartData[miniChartData.length - 1] > miniChartData[0];
  const chartColor = isTrendUp ? '#10b981' : '#ef4444';
  
  // Determine if positive or negative for the row overlay
  const isPositive = coin.price_change_percentage_24h >= 0;
  const ratio = coin.total_volume / coin.market_cap;

  return (
    <tr 
        onClick={onToggle}
        onMouseEnter={() => setFocusedId(coin.id)}
        onMouseLeave={() => setFocusedId(null)}
        className={`
            group transition-all duration-200 cursor-pointer border-b border-term-border/50 relative
            ${dimmed ? 'opacity-30 blur-[0.5px]' : 'opacity-100'}
            /* Background Logic: Expanded vs Resting State with Gradient Overlay */
            ${isExpanded 
                ? 'bg-term-border/20' 
                : isPositive 
                    ? 'bg-gradient-to-r from-trade-up/[0.06] via-transparent to-transparent hover:from-trade-up/[0.1]' 
                    : 'bg-gradient-to-r from-trade-down/[0.06] via-transparent to-transparent hover:from-trade-down/[0.1]'
            }
            hover:bg-term-border/30
        `}
    >
        <td className="py-4 px-6 text-center">
            {isExpanded 
                ? <Minimize2 size={14} className="text-term-accent" /> 
                : <Maximize2 size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
            }
        </td>
        <td className="py-4 px-6">
            <div className="flex items-center gap-3">
            {/* Indicator Line (reinforced color) */}
            <div className={`w-1 h-8 rounded-full ${isPositive ? 'bg-trade-up' : 'bg-trade-down'} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            
            <img src={coin.image} alt="" className="w-6 h-6 rounded-full transition-all group-hover:scale-110" />
            
            <div>
                <div className="font-bold text-text-main group-hover:text-white transition-colors">{coin.name}</div>
                <div className="text-xs text-text-muted uppercase font-mono">{coin.symbol}</div>
            </div>
            </div>
        </td>
        <td className="py-4 px-6 text-right">
            <PriceTicker value={coin.current_price} className="font-mono text-text-main" />
        </td>
        <td className="py-4 px-6 text-right">
            <PriceTicker 
            value={coin.price_change_percentage_24h} 
            isCurrency={false} 
            showIcon={true}
            className="font-medium" 
            />
        </td>
        <td className="py-4 px-6 text-right text-text-muted hidden lg:table-cell font-mono text-sm">
            ${(coin.market_cap / 1e9).toFixed(2)}B
        </td>
        <td className="py-2 px-6 hidden xl:table-cell w-32 h-16">
            <div className="h-10 w-28 opacity-70 group-hover:opacity-100 transition-opacity">
                {miniChartData.length > 0 && (
                    <MarketChart data={miniChartData} color={chartColor} />
                )}
            </div>
        </td>
        <td className="py-4 px-6 text-right hidden lg:table-cell w-32">
            <div className="h-1 w-full bg-term-bg rounded-full overflow-hidden border border-term-border/50">
                <div 
                className="h-full bg-term-accent" 
                style={{ width: `${Math.min(ratio * 500, 100)}%` }}
                ></div>
            </div>
        </td>
    </tr>
  );
};
