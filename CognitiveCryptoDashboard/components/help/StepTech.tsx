
import React from 'react';
import { Brain, Activity, LayoutDashboard, ShieldCheck } from 'lucide-react';

export const techData = {
  title: "System Capabilities",
  subtitle: "Feature Overview",
  description: "A holistic decision engine integrating generative AI sentiment analysis, comparative temporal charting, and multi-layer data resilience for strategic crypto decision making."
};

export const TechVisual: React.FC = () => (
  <div className="grid grid-cols-2 gap-3 w-full max-w-[320px]">
     
     {/* Feature 1: AI */}
     <div className="bg-term-bg border border-term-border rounded-lg p-3 flex flex-col gap-2 hover:border-term-accent/50 transition-colors group">
        <div className="w-8 h-8 rounded-md bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20">
            <Brain size={16} className="text-indigo-400" />
        </div>
        <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wide">Cognitive AI</div>
            <div className="text-[8px] text-text-muted leading-tight mt-0.5">Sentiment analysis & noise filtering via Gemini.</div>
        </div>
     </div>

     {/* Feature 2: Nexus */}
     <div className="bg-term-bg border border-term-border rounded-lg p-3 flex flex-col gap-2 hover:border-blue-500/50 transition-colors group">
        <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20">
            <Activity size={16} className="text-blue-400" />
        </div>
        <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wide">Temporal Nexus</div>
            <div className="text-[8px] text-text-muted leading-tight mt-0.5">Normalized comparative performance charting.</div>
        </div>
     </div>

     {/* Feature 3: Strategic */}
     <div className="bg-term-bg border border-term-border rounded-lg p-3 flex flex-col gap-2 hover:border-emerald-500/50 transition-colors group">
        <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20">
            <LayoutDashboard size={16} className="text-emerald-400" />
        </div>
        <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wide">Strategic Data</div>
            <div className="text-[8px] text-text-muted leading-tight mt-0.5">Deep-dive tables with mini-trend visualization.</div>
        </div>
     </div>

     {/* Feature 4: Resilience */}
     <div className="bg-term-bg border border-term-border rounded-lg p-3 flex flex-col gap-2 hover:border-amber-500/50 transition-colors group">
        <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20">
            <ShieldCheck size={16} className="text-amber-400" />
        </div>
        <div>
            <div className="text-[10px] font-bold text-white uppercase tracking-wide">Resilience</div>
            <div className="text-[8px] text-text-muted leading-tight mt-0.5">Layers of Truth architecture for offline safety.</div>
        </div>
     </div>

  </div>
);
