
import React from 'react';
import { Clock } from 'lucide-react';

export const expandedData = {
  title: "Deep Analysis",
  subtitle: "Expanded View",
  description: "Clicking any asset expands its row. This reveals session statistics (Open, High, Low) and a detailed trend chart where you can switch between 1H, 24H, and 7D timeframes."
};

export const ExpandedVisual: React.FC = () => (
  <div className="w-full max-w-[340px] bg-term-bg border border-term-border rounded-xl overflow-hidden shadow-2xl">
     {/* Header context */}
     <div className="p-2 border-b border-term-border bg-term-panel flex justify-between items-center">
        <span className="text-xs font-bold text-white pl-2">Bitcoin (BTC)</span>
        <span className="text-[10px] text-trade-up bg-trade-up/10 px-2 py-0.5 rounded">+1.2%</span>
     </div>

     <div className="p-4 flex gap-4">
        {/* Left Stats */}
        <div className="w-1/3 space-y-3">
           <div>
              <div className="text-[9px] text-text-muted uppercase">Session High</div>
              <div className="text-xs font-mono text-trade-up">$65,100</div>
           </div>
           <div>
              <div className="text-[9px] text-text-muted uppercase">Session Low</div>
              <div className="text-xs font-mono text-trade-down">$63,200</div>
           </div>
           <div>
              <div className="text-[9px] text-text-muted uppercase">Vol/Cap</div>
              <div className="text-xs font-mono text-text-main">0.0345</div>
           </div>
        </div>

        {/* Right Chart */}
        <div className="w-2/3 bg-term-panel border border-term-border rounded p-2 relative">
            <div className="flex justify-between items-center mb-2">
               <div className="flex items-center gap-1 text-[9px] text-text-muted uppercase font-bold">
                  <Clock size={10} /> Trend
               </div>
               <div className="flex bg-term-bg rounded border border-term-border p-0.5">
                  <span className="px-1.5 py-0.5 text-[8px] text-text-muted">1H</span>
                  <span className="px-1.5 py-0.5 text-[8px] bg-term-accent text-white rounded shadow-sm">24H</span>
                  <span className="px-1.5 py-0.5 text-[8px] text-text-muted">7D</span>
               </div>
            </div>
            
            <div className="h-16 w-full border-b border-l border-term-border/30 relative">
               <svg className="absolute inset-0 w-full h-full overflow-visible">
                  <path d="M0,50 C20,40 40,55 60,30 C80,20 100,10 120,5" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  <defs>
                     <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                     </linearGradient>
                  </defs>
                  <path d="M0,50 C20,40 40,55 60,30 C80,20 100,10 120,5 V60 H0 Z" fill="url(#grad)" stroke="none" />
               </svg>
            </div>
        </div>
     </div>
  </div>
);
