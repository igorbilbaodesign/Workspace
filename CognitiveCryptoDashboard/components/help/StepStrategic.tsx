
import React from 'react';
import { ArrowUp, Maximize2 } from 'lucide-react';

export const strategicData = {
  title: "Strategic Overview",
  subtitle: "Desktop Command",
  description: "A comprehensive table view for deep market scanning. It includes mini-charts for 7-day trend recognition, volume/cap ratios, and sortable metrics to find opportunities quickly."
};

export const StrategicVisual: React.FC = () => (
  <div className="w-full max-w-[340px] bg-term-panel border border-term-border rounded-xl overflow-hidden shadow-2xl text-xs">
      {/* Table Header */}
      <div className="bg-term-header border-b border-term-border grid grid-cols-4 p-3 text-[10px] text-text-muted font-bold uppercase tracking-wider">
         <div className="col-span-2">Asset</div>
         <div className="text-right">Price</div>
         <div className="text-right">Trend</div>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-4 p-3 border-b border-term-border/50 bg-gradient-to-r from-trade-up/[0.05] to-transparent items-center">
         <div className="col-span-2 flex items-center gap-2">
            <Maximize2 size={12} className="text-text-muted" />
            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-[8px] font-bold text-orange-500">BTC</div>
            <div className="font-bold text-text-main">Bitcoin</div>
         </div>
         <div className="text-right font-mono">$64,230</div>
         <div className="text-right flex justify-end">
            <div className="w-16 h-8 opacity-80">
               <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  <path d="M0,35 C20,30 40,38 60,20 C80,10 90,15 100,5" fill="none" stroke="#10b981" strokeWidth="2" />
               </svg>
            </div>
         </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-4 p-3 border-b border-term-border/50 items-center opacity-70">
         <div className="col-span-2 flex items-center gap-2">
             <Maximize2 size={12} className="text-text-muted opacity-50" />
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[8px] font-bold text-blue-500">ETH</div>
            <div className="font-bold text-text-main">Ethereum</div>
         </div>
         <div className="text-right font-mono">$3,450</div>
         <div className="text-right flex justify-end">
             <div className="w-16 h-8 opacity-50">
               <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  <path d="M0,20 C20,25 40,20 60,25 C80,30 90,28 100,35" fill="none" stroke="#ef4444" strokeWidth="2" />
               </svg>
            </div>
         </div>
      </div>
  </div>
);
