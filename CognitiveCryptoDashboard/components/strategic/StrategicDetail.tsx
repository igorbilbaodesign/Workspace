
import React, { useState, useEffect } from 'react';
import { CryptoData } from '../../types';
import { MarketChart } from '../MarketChart';
import { fetchAssetHistory } from '../../services/cryptoService';
import { Clock, Loader2 } from 'lucide-react';
import { MiniChartTimeframe } from './StrategicHeader';

type ExpandedTimeframe = '1H' | '24H' | '7D';

interface Props {
  coin: CryptoData;
  initialTimeframe: MiniChartTimeframe;
}

export const StrategicDetail: React.FC<Props> = ({ coin, initialTimeframe }) => {
    const [timeframe, setTimeframe] = useState<ExpandedTimeframe>(initialTimeframe);
    const [chartData, setChartData] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Initial load logic
    useEffect(() => {
        const load = async () => {
            if (timeframe === '7D') {
                setChartData(coin.sparkline_in_7d?.price || []);
            } else if (timeframe === '24H') {
                setChartData(coin.sparkline_in_7d?.price?.slice(-24) || []);
            } else if (timeframe === '1H') {
                setIsLoading(true);
                // '1' day param in API gives ~5 min intervals
                const data = await fetchAssetHistory(coin.id, '1'); 
                if (data && data.length > 0) {
                    setChartData(data.slice(-12)); // Approx last hour
                }
                setIsLoading(false);
            }
        };
        load();
    }, [coin, timeframe]);

    const isTrendUp = chartData.length > 0 && chartData[chartData.length - 1] > chartData[0];
    const color = isTrendUp ? '#10b981' : '#ef4444';
    const openPrice = coin.current_price / (1 + coin.price_change_percentage_24h / 100);
    const volCapRatio = coin.total_volume / coin.market_cap;

    return (
        <tr className="bg-term-bg/30 animate-in fade-in slide-in-from-top-2 duration-300">
          <td colSpan={7} className="p-0 border-b border-term-border">
            <div className="p-6 flex flex-col md:flex-row gap-8">
               
               {/* Left: Detailed Stats */}
               <div className="md:w-1/4 space-y-4">
                  <h4 className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-2 border-b border-term-border pb-1">Session Data</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-[10px] text-text-muted block">OPEN (Est.)</span>
                        <span className="font-mono text-sm text-text-main">${openPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-text-muted block">VOL/CAP</span>
                        <span className="font-mono text-sm text-text-main">{volCapRatio.toFixed(4)}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-text-muted block">HIGH (24H)</span>
                        <span className="font-mono text-sm text-trade-up">${coin.high_24h.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-text-muted block">LOW (24H)</span>
                        <span className="font-mono text-sm text-trade-down">${coin.low_24h.toLocaleString()}</span>
                    </div>
                  </div>
               </div>

               {/* Right: Big Chart with Timeframe Selector */}
               <div className="md:w-3/4 h-48 border border-term-border rounded-lg bg-term-bg/50 p-4 relative overflow-hidden flex flex-col shadow-inner">
                    <div className="flex justify-between items-center mb-2 z-10 relative">
                         <div className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-2">
                            <Clock size={10} />
                            <span>Trend Analysis</span>
                         </div>
                         
                         {/* Detail Timeframe Selector */}
                         <div className="flex bg-term-bg rounded border border-term-border p-0.5">
                            {(['1H', '24H', '7D'] as ExpandedTimeframe[]).map(tf => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    disabled={isLoading}
                                    className={`
                                        px-2 py-0.5 text-[9px] font-bold rounded transition-colors
                                        ${timeframe === tf ? 'bg-term-accent text-white' : 'text-text-muted hover:text-white'}
                                        ${isLoading ? 'opacity-50 cursor-wait' : ''}
                                    `}
                                >
                                    {tf}
                                </button>
                            ))}
                         </div>
                    </div>
                    
                    <div className="flex-grow relative">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="animate-spin text-term-accent" size={20} />
                            </div>
                        ) : (
                            <MarketChart data={chartData} color={color} />
                        )}
                    </div>
                </div>
            </div>
          </td>
        </tr>
    );
};
