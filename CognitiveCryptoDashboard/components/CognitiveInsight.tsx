import React from 'react';
import { AnalysisResult } from '../types';
import { Terminal, Cpu, Play } from 'lucide-react';

interface Props {
  analysis: AnalysisResult | null;
  loading: boolean;
  onAnalyze?: () => void;
}

export const CognitiveInsight: React.FC<Props> = ({ analysis, loading, onAnalyze }) => {
  if (loading) {
    return (
      <div className="bg-term-panel border border-term-border rounded-lg p-6 font-mono text-xs text-text-muted flex flex-col items-center justify-center gap-3 animate-pulse h-[140px]">
        <Cpu size={24} className="text-term-accent animate-spin" />
        <span>ESTABLISHING NEURAL LINK... PROCESSING MARKET DATA...</span>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-term-panel/40 border border-dashed border-term-border rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4 h-[140px]">
        <div className="flex items-center gap-2 text-text-muted">
          <Terminal size={16} />
          <span className="text-xs font-mono uppercase tracking-wider">Cognitive Module Standby</span>
        </div>
        <button 
          onClick={onAnalyze}
          className="flex items-center gap-2 px-4 py-2 bg-term-accent/10 hover:bg-term-accent text-term-accent hover:text-white border border-term-accent/30 rounded transition-all duration-300 group"
        >
          <Play size={14} className="fill-current group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wide">Initialize Analysis</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-term-bg border border-term-border rounded-lg overflow-hidden relative group">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-term-accent via-blue-500 to-transparent opacity-50"></div>

      <div className="bg-term-header px-3 py-2 border-b border-term-border flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Terminal size={12} className="text-text-muted" />
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">AI_SENTIMENT_LOG</span>
         </div>
         <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${analysis.sentiment === 'bullish' ? 'bg-trade-up' : analysis.sentiment === 'bearish' ? 'bg-trade-down' : 'bg-gray-500'}`}></div>
             <button 
                onClick={onAnalyze}
                className="text-[9px] text-term-accent hover:text-white uppercase font-mono hover:underline"
             >
                Refresh
             </button>
         </div>
      </div>
      
      <div className="p-4 font-mono text-sm leading-relaxed text-text-muted">
         <div className="flex gap-2">
            <span className="text-term-accent select-none">root@cognitive:~$</span>
            <span className="text-text-main animate-in fade-in duration-700">{analysis.summary}</span>
         </div>
         
         <div className="mt-4 flex flex-wrap gap-2">
            {analysis.keyFactors.map((f, i) => (
               <span key={i} className="bg-term-border px-2 py-1 rounded text-[10px] text-text-main border border-white/5">
                  [{f}]
               </span>
            ))}
         </div>
      </div>
    </div>
  );
};