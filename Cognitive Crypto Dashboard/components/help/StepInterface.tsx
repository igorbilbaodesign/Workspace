
import React from 'react';
import { Terminal, Activity, List } from 'lucide-react';

export const interfaceData = {
  title: "Command Center Layout",
  subtitle: "Strategic Structure",
  description: "The interface is architected into three strategic zones: 1) System Insight for AI analysis, 2) The Temporal Nexus for comparative charting, and 3) The Strategic Feed for detailed asset tracking."
};

export const InterfaceVisual: React.FC = () => (
  <div className="w-full max-w-[420px] aspect-[16/10] bg-term-bg border border-term-border rounded-xl shadow-2xl flex flex-col overflow-hidden relative select-none text-[8px] font-mono leading-tight group">
    
    {/* APP HEADER MOCK */}
    <div className="h-5 bg-term-header border-b border-term-border flex items-center px-3 justify-between shrink-0">
        <div className="flex items-center gap-1.5 opacity-70">
             <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded shadow-glow"></div>
             <span className="font-bold text-gray-300 tracking-wide text-[9px]">Cognitive Crypto Dashboard</span>
        </div>
        <div className="flex gap-1.5 opacity-50">
             <div className="text-[7px] text-gray-500">NET_V2: ONLINE</div>
        </div>
    </div>

    <div className="flex-1 p-3 space-y-2 overflow-hidden bg-term-bg flex flex-col">
        
        {/* SECTION 1: SYSTEM INSIGHT */}
        <div className="border border-term-border rounded bg-term-panel/40 shrink-0">
            <div className="bg-term-header/50 px-2 py-1 border-b border-term-border/50 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <span className="text-blue-400 font-bold flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-blue-500"></span> >_ AI_SENTIMENT_LOG
                    </span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)] animate-pulse"></div>
            </div>
            <div className="p-2 text-gray-400">
                <div className="mb-1">
                    <span className="text-blue-500 mr-1 font-bold">root@cognitive:~$</span>
                    <span className="text-gray-300">The market is currently undergoing a minor healthy retracement...</span>
                </div>
                <div className="flex gap-1 mt-1 opacity-70">
                    <span className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-gray-400">[Consolidation]</span>
                    <span className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-gray-400">[Resilience]</span>
                    <span className="bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded text-gray-400">[Volatility]</span>
                </div>
            </div>
        </div>

        {/* SECTION 2: TEMPORAL NEXUS */}
        <div className="border border-term-border rounded bg-term-panel shrink-0 flex flex-col h-[35%]">
             <div className="px-2 py-1 border-b border-term-border/50 flex items-center justify-between bg-term-header/30">
                 <div className="flex items-center gap-2">
                     <span className="text-indigo-400 font-bold flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-indigo-500"></span> TEMPORAL NEXUS
                     </span>
                     <div className="flex gap-1">
                         <span className="bg-black/40 border border-gray-700/50 px-1.5 py-0.5 rounded-full text-gray-400 text-[6px] border-l-2 border-l-blue-500">BTC</span>
                         <span className="bg-black/40 border border-gray-700/50 px-1.5 py-0.5 rounded-full text-gray-400 text-[6px] border-l-2 border-l-emerald-500">ETH</span>
                         <span className="bg-black/40 border border-gray-700/50 px-1.5 py-0.5 rounded-full text-gray-400 text-[6px] border-l-2 border-l-amber-500">SOL</span>
                     </div>
                 </div>
                 <div className="flex bg-black/40 rounded border border-gray-700/50">
                    <span className="px-1 text-[6px] text-gray-500">1H</span>
                    <span className="px-1 text-[6px] bg-gray-700 text-white">24H</span>
                    <span className="px-1 text-[6px] text-gray-500">7D</span>
                 </div>
             </div>
             <div className="flex-1 relative w-full overflow-hidden">
                 {/* Mock Chart Lines */}
                 <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
                     <defs>
                        <linearGradient id="gradMock" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                     </defs>
                     <path d="M0,25 Q10,20 20,28 T40,35 T60,20 T80,15 T100,25" fill="url(#gradMock)" stroke="#3b82f6" strokeWidth="0.5" />
                     <path d="M0,25 Q10,30 20,25 T40,20 T60,28 T80,35 T100,30" fill="none" stroke="#10b981" strokeWidth="0.5" />
                     <path d="M0,25 Q10,22 20,18 T40,15 T60,25 T80,30 T100,40" fill="none" stroke="#f59e0b" strokeWidth="0.5" />
                     {/* Zero Line */}
                     <line x1="0" y1="25" x2="100" y2="25" stroke="#334155" strokeWidth="0.2" strokeDasharray="1 1" />
                 </svg>
             </div>
        </div>

        {/* SECTION 3: STRATEGIC OVERVIEW */}
        <div className="border border-term-border rounded bg-term-panel flex-1 flex flex-col min-h-0">
             <div className="px-2 py-1 border-b border-term-border/50 flex justify-between items-center bg-term-header/30">
                 <span className="text-emerald-500 font-bold flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span> STRATEGIC OVERVIEW
                 </span>
                 <span className="text-[6px] bg-blue-600/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">+ Add Asset</span>
             </div>
             <div className="flex-1 bg-term-bg/30 flex flex-col">
                 {/* Table Header */}
                 <div className="flex justify-between px-3 py-1 text-gray-600 border-b border-gray-800 text-[7px] uppercase tracking-wider font-bold">
                     <div className="w-1/3">Asset</div>
                     <div className="w-1/3 text-right">Price</div>
                     <div className="w-1/3 text-right">24h</div>
                 </div>
                 {/* Rows */}
                 <div className="flex-1 overflow-hidden">
                     {[
                         {n:'Bitcoin', s:'BTC', p:'$69,150.00', c:'-2.61%', color: 'text-red-500'},
                         {n:'Ethereum', s:'ETH', p:'$2,079.81', c:'-0.65%', color: 'text-red-500'},
                         {n:'Tether', s:'USDT', p:'$1.00', c:'-0.02%', color: 'text-green-500'},
                         {n:'BNB', s:'BNB', p:'$642.58', c:'-2.43%', color: 'text-red-500'},
                     ].map((row, i) => (
                         <div key={i} className="flex justify-between items-center px-3 py-1.5 border-b border-gray-800/30 hover:bg-white/5">
                             <div className="w-1/3 flex items-center gap-1.5">
                                 <div className={`w-3 h-3 rounded-full flex items-center justify-center text-[5px] font-bold ${i===0?'bg-orange-500/20 text-orange-500':i===1?'bg-blue-500/20 text-blue-500':i===2?'bg-emerald-500/20 text-emerald-500':'bg-yellow-500/20 text-yellow-500'}`}>
                                    {row.s[0]}
                                 </div>
                                 <div className="flex flex-col">
                                     <span className="text-gray-200 font-bold">{row.n}</span>
                                     <span className="text-gray-600 text-[6px]">{row.s}</span>
                                 </div>
                             </div>
                             <div className="w-1/3 text-right text-gray-300 font-mono">{row.p}</div>
                             <div className={`w-1/3 text-right font-mono font-bold ${row.color}`}>{row.c}</div>
                         </div>
                     ))}
                 </div>
             </div>
        </div>

    </div>
  </div>
);
