
import React from 'react';
import { ArrowUp, X } from 'lucide-react';

export const mobileData = {
  title: "Tactical Feed",
  subtitle: "Mobile Optimized",
  description: "On mobile, the interface adapts into a vertical Tactical Feed. Information is laid out horizontally for maximum density, giving you a clear status summary at a glance without horizontal scrolling."
};

export const MobileVisual: React.FC = () => (
  <div className="relative w-full max-w-[220px] aspect-[9/16] bg-term-bg border-4 border-term-header rounded-3xl shadow-2xl overflow-hidden flex flex-col">
     {/* Mobile Notch/Header */}
     <div className="h-6 bg-term-header w-full flex justify-center items-center shrink-0">
        <div className="w-12 h-1 bg-term-border rounded-full"></div>
     </div>

     {/* App Content Simulation */}
     <div className="flex-1 p-3 space-y-3 relative bg-term-bg overflow-hidden">
        <div className="text-[9px] font-bold text-text-muted uppercase tracking-widest mb-2 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-term-accent"></span> Tactical Feed
        </div>
        
        {/* Card 1: BTC */}
        <div className="w-full bg-term-panel border border-term-border rounded p-2.5 flex items-center justify-between relative overflow-hidden shadow-sm">
             <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-trade-up"></div>
             <div className="flex items-center gap-2 pl-2">
                 <div className="w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/20 text-[7px] flex items-center justify-center text-orange-400 font-bold">BTC</div>
                 <div>
                     <div className="text-[9px] font-bold text-white">Bitcoin</div>
                     <div className="text-[7px] text-text-muted bg-term-border/50 px-1 rounded inline-block mt-0.5">HIGH VOL</div>
                 </div>
             </div>
             <div className="text-right">
                 <div className="text-[9px] font-bold text-white font-mono">$64,230</div>
                 <div className="text-[7px] text-trade-up font-bold bg-trade-up/10 px-1 rounded inline-block">+1.2%</div>
             </div>
        </div>

        {/* Card 2: ETH */}
         <div className="w-full bg-term-panel border border-term-border rounded p-2.5 flex items-center justify-between relative overflow-hidden shadow-sm opacity-80">
             <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-trade-down"></div>
             <div className="flex items-center gap-2 pl-2">
                 <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-[7px] flex items-center justify-center text-blue-400 font-bold">ETH</div>
                 <div>
                     <div className="text-[9px] font-bold text-white">Ethereum</div>
                     <div className="text-[7px] text-text-muted bg-term-border/50 px-1 rounded inline-block mt-0.5">CAP $400B</div>
                 </div>
             </div>
             <div className="text-right">
                 <div className="text-[9px] font-bold text-white font-mono">$3,450</div>
                 <div className="text-[7px] text-trade-down font-bold bg-trade-down/10 px-1 rounded inline-block">-0.5%</div>
             </div>
        </div>
        
        {/* Card 3: SOL */}
         <div className="w-full bg-term-panel border border-term-border rounded p-2.5 flex items-center justify-between relative overflow-hidden shadow-sm opacity-60">
             <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-trade-up"></div>
             <div className="flex items-center gap-2 pl-2">
                 <div className="w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-[7px] flex items-center justify-center text-purple-400 font-bold">SOL</div>
                 <div>
                     <div className="text-[9px] font-bold text-white">Solana</div>
                     <div className="text-[7px] text-text-muted bg-term-border/50 px-1 rounded inline-block mt-0.5">ACTIVE</div>
                 </div>
             </div>
             <div className="text-right">
                 <div className="text-[9px] font-bold text-white font-mono">$145.80</div>
                 <div className="text-[7px] text-trade-up font-bold bg-trade-up/10 px-1 rounded inline-block">+5.4%</div>
             </div>
        </div>
     </div>
  </div>
);
