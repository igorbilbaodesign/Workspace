
import React, { useState, useEffect } from 'react';
import { Activity, Plus, X, CheckCircle2 } from 'lucide-react';

export const nexusData = {
  title: "Temporal Nexus",
  subtitle: "Comparative Logic",
  description: "Standard charts mislead because asset prices vary wildly. The Nexus normalizes all assets to a 0% baseline, allowing you to compare true relative performance over different timeframes."
};

// Paths designed with Quadratic Bezier (Q) and Smooth Quadratic (T) 
// to mirror the "organic" look of Card 3
const CHART_PATHS = {
  '1H': {
    // KEPT AS REQUESTED: Tight correlation, smooth micro-moves
    btc: "M0,50 Q35,45 70,52 T140,48 T210,53 T280,49 T350,51",
    eth: "M0,50 Q35,55 70,48 T140,54 T210,47 T280,53 T350,49",
    sol: "M0,50 Q35,50 70,50 T140,45 T210,55 T280,45 T350,50"
  },
  '24H': {
    // ADJUSTED: Higher Frequency (more ups/downs), Medium Amplitude
    // Simulates intraday volatility sessions
    btc: "M0,50 Q30,60 60,40 T120,30 T180,60 T240,45 T300,55",
    eth: "M0,50 Q30,35 60,65 T120,80 T180,40 T240,70 T300,60",
    sol: "M0,50 Q30,70 60,30 T120,20 T180,75 T240,35 T300,65"
  },
  '7D': {
    // ADJUSTED: Lower Frequency (Longer arcs), High Amplitude (Macro Trends)
    // Simulates a full week of price action (Big rallies and dumps)
    btc: "M0,50 Q70,10 140,60 T280,20 T350,40", // Big pump, correction, pump
    eth: "M0,50 Q70,80 140,70 T280,90 T350,60", // Slow bleed/downtrend
    sol: "M0,50 Q60,20 120,90 T240,30 T320,80"  // High Beta: Huge V-shapes
  }
};

type Timeframe = '1H' | '24H' | '7D';

export const NexusVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Timeframe>('1H');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const sequence: Timeframe[] = ['1H', '24H', '7D'];
    let currentIndex = 0; // Starts at '1H' (index 0)
    let loopCount = 0;
    const MAX_LOOPS = 3;

    const interval = setInterval(() => {
      // Calculate next step
      const nextIndex = (currentIndex + 1) % sequence.length;
      
      setIsTransitioning(true);
      
      // Perform transition
      setTimeout(() => {
        setActiveTab(sequence[nextIndex]);
        setIsTransitioning(false);
      }, 100);

      currentIndex = nextIndex;

      // Logic: If we hit the end of the sequence ('7D'), increment loop counter
      if (currentIndex === sequence.length - 1) {
        loopCount++;
        // Stop exactly after the 3rd time we show '7D'
        if (loopCount >= MAX_LOOPS) {
          clearInterval(interval);
          setIsFinished(true);
        }
      }

    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const paths = CHART_PATHS[activeTab];

  return (
    <div className="w-full max-w-[400px] aspect-[16/9] bg-term-panel border border-term-border rounded-xl shadow-2xl flex flex-col relative overflow-hidden group select-none">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
        <Activity size={100} />
      </div>

      {/* HEADER: Controls */}
      <div className="flex justify-between items-center p-3 border-b border-term-border/30 z-10 bg-term-panel/80 backdrop-blur-sm">
         
         {/* Left: Asset Chips */}
         <div className="flex items-center gap-2 overflow-hidden">
             <span className="text-[9px] uppercase font-bold text-text-muted tracking-widest mr-1 hidden sm:block">Nexus Feed:</span>
             <div className="flex gap-1.5">
                 <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-term-bg border border-term-border text-[8px] font-mono text-text-main border-l-2 border-l-blue-500">
                    BTC <X size={6} className="text-text-muted" />
                 </div>
                 <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-term-bg border border-term-border text-[8px] font-mono text-text-main border-l-2 border-l-emerald-500">
                    ETH <X size={6} className="text-text-muted" />
                 </div>
                 <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-term-bg border border-term-border text-[8px] font-mono text-text-main border-l-2 border-l-amber-500">
                    SOL <X size={6} className="text-text-muted" />
                 </div>
                 <div className="flex items-center justify-center w-5 h-5 rounded-full bg-term-accent/10 border border-dashed border-term-accent/40 text-term-accent">
                    <Plus size={8} />
                 </div>
             </div>
         </div>

         {/* Right: Timeframe Selector */}
         <div className="flex bg-term-bg p-0.5 rounded border border-term-border">
             {(['1H', '24H', '7D'] as Timeframe[]).map(tf => (
                 <div 
                    key={tf}
                    className={`
                        px-1.5 py-0.5 rounded text-[8px] font-bold transition-all duration-300 relative
                        ${activeTab === tf ? 'bg-term-header text-white shadow-sm ring-1 ring-term-border' : 'text-text-muted'}
                    `}
                 >
                    {tf}
                    {/* Visual indicator that it stopped on 7D */}
                    {isFinished && tf === '7D' && activeTab === '7D' && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-term-accent rounded-full animate-pulse shadow-glow"></span>
                    )}
                 </div>
             ))}
         </div>
      </div>

      {/* CHART AREA */}
      <div className="flex-1 relative w-full overflow-hidden bg-gradient-to-b from-transparent to-term-bg/50">
          
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-10 pointer-events-none">
              <div className="w-full h-px bg-term-border"></div>
              <div className="w-full h-px bg-term-border"></div>
              <div className="w-full h-px bg-term-border"></div>
          </div>

          {/* Zero Line (Dashed) */}
          <div className="absolute top-1/2 left-0 w-full h-px border-t border-dashed border-text-muted/40 z-0"></div>
          <div className="absolute top-1/2 left-2 text-[8px] text-text-muted/50 -mt-3 z-0">0%</div>

          {/* Graph Lines - Uses same viewbox logic as Card 3 but scaled */}
          <svg className="absolute inset-0 w-full h-full z-10" preserveAspectRatio="none" viewBox="0 0 300 100">
             <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
             </defs>

             {/* BTC (Blue) */}
             <path 
                d={paths.btc} 
                fill="url(#gradBlue)" 
                stroke="#3b82f6" 
                strokeWidth="1.5"
                strokeLinejoin="round" 
                strokeLinecap="round"
                className="transition-all duration-1000 ease-in-out"
             />
             
             {/* ETH (Green) */}
             <path 
                d={paths.eth} 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="1.5" 
                strokeLinejoin="round" 
                strokeLinecap="round"
                className="transition-all duration-1000 ease-in-out"
             />

             {/* SOL (Amber) */}
             <path 
                d={paths.sol} 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="1.5" 
                strokeLinejoin="round" 
                strokeLinecap="round"
                className="transition-all duration-1000 ease-in-out"
             />
          </svg>
          
          {/* Scanline Overlay for "Screen" Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>

          {/* End of Simulation Indicator */}
          {isFinished && (
            <div className="absolute bottom-4 right-4 bg-term-bg/80 border border-term-accent/30 text-term-accent text-[9px] px-2 py-1 rounded-full flex items-center gap-1.5 animate-in fade-in duration-500 shadow-lg backdrop-blur-sm">
                <CheckCircle2 size={10} />
                <span className="font-bold tracking-wide">SIMULATION COMPLETE</span>
            </div>
          )}
      </div>

      {/* Footer Info */}
      <div className="h-6 border-t border-term-border/30 bg-term-bg/30 flex justify-center items-center gap-3 text-[8px] text-text-muted font-mono uppercase tracking-widest z-10">
         <span>Comp. Performance ({activeTab})</span>
         <span className="text-term-border">•</span>
         <span>Baseline Normalized</span>
      </div>

    </div>
  );
};
