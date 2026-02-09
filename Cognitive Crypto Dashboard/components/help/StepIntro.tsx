
import React from 'react';
import { Brain, Bitcoin, Network } from 'lucide-react';

export const introData = {
  title: "Cognitive Crypto Dashboard",
  subtitle: "Cognitive OS v2.0",
  description: "Welcome to the Cognitive Crypto Dashboard. This is not just a dashboard; it is a decision support system designed to reduce cognitive anxiety and transform market volatility into strategic clarity."
};

export const IntroVisual: React.FC = () => (
  <div className="flex flex-col items-center justify-center relative w-64 h-64 animate-in zoom-in-95 duration-700">
    
    {/* Outer Neural Ring (Slow Pulse) */}
    <div className="absolute inset-0 rounded-full bg-term-accent/5 animate-[ping_4s_ease-in-out_infinite]"></div>
    
    {/* Financial Orbit Data */}
    <div className="absolute inset-6 rounded-full border border-dashed border-term-border/40 animate-[spin_16s_linear_infinite]">
        {/* Orbiting Coin Nodes */}
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#eab308]"></div>
        <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>
    </div>

    {/* Reverse Orbit */}
    <div className="absolute inset-12 rounded-full border border-term-accent/10 border-t-term-accent/30 animate-[spin_10s_linear_infinite_reverse]"></div>

    {/* Core Identity Unit */}
    <div className="relative z-10 w-32 h-32 bg-term-bg/90 backdrop-blur-xl border border-term-border rounded-2xl flex flex-col items-center justify-center shadow-[0_0_40px_-10px_rgba(59,130,246,0.25)] group hover:border-term-accent/50 transition-colors duration-500 overflow-hidden">
       
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]"></div>

       {/* Brain + Crypto Logic */}
       <div className="relative flex items-center justify-center">
          {/* The Brain (Base Layer) */}
          <Brain className="text-slate-600 w-16 h-16 relative z-0 opacity-40 group-hover:opacity-60 transition-opacity" />
          
          {/* The Crypto (Overlay Layer) */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
              <Bitcoin className="text-term-accent w-10 h-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse" strokeWidth={1.5} />
          </div>
       </div>
       
       {/* System Status Text */}
       <div className="absolute -bottom-px w-full text-center bg-term-header/80 border-t border-term-border py-1">
          <span className="text-[7px] font-mono font-bold text-text-muted tracking-widest uppercase flex items-center justify-center gap-1">
            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
            NEURAL_FINANCE
          </span>
       </div>
    </div>

    {/* Floating Modules (Satellites) */}
    <div className="absolute top-2 right-2 animate-bounce delay-700 duration-[4000ms]">
        <div className="flex items-center gap-1 bg-term-panel/90 border border-term-border px-1.5 py-1 rounded text-[7px] text-text-muted shadow-lg backdrop-blur">
            <Network size={8} className="text-indigo-400" />
            <span className="font-bold text-white">SYNC</span>
        </div>
    </div>

  </div>
);
