import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Play, Sparkles } from 'lucide-react';

export const aiData = {
  title: "Cognitive Insight",
  subtitle: "Powered by Gemini",
  description: "The AI module doesn't just list data; it interprets 'sentiment'. It acts as a senior analyst, filtering noise and providing a calm, objective summary of market conditions."
};

export const AiVisual: React.FC = () => {
  // States: 'idle' (button), 'loading' (spinner), 'typing' (text), 'done' (final)
  const [stage, setStage] = useState<'idle' | 'loading' | 'typing' | 'done'>('idle');
  const [typedText, setTypedText] = useState("");
  const [loopCount, setLoopCount] = useState(0);

  const fullText = "Market showing resilience. Sentiment leans bullish due to volume accumulation...";
  const maxLoops = 2; // 0, 1, 2 = 3 times total execution

  // Sequence Controller
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (stage === 'idle') {
      // Simulate user reading then clicking (1.2s delay)
      timeout = setTimeout(() => setStage('loading'), 1200);
    } else if (stage === 'loading') {
      // Simulate API network call (1.5s delay)
      timeout = setTimeout(() => setStage('typing'), 1500);
    } else if (stage === 'done') {
        // Stop.
    }

    return () => clearTimeout(timeout);
  }, [stage]);

  // Typing Logic
  useEffect(() => {
    if (stage !== 'typing') return;

    let index = 0;
    setTypedText(""); // Reset text

    const typeInterval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;

      if (index === fullText.length) {
        clearInterval(typeInterval);
        
        // Wait a bit after finishing typing to show the result before restarting or stopping
        setTimeout(() => {
           if (loopCount < maxLoops) {
             setLoopCount(prev => prev + 1);
             setStage('idle');
             setTypedText("");
           } else {
             setStage('done');
           }
        }, 3000);
      }
    }, 40); // Typing speed

    return () => clearInterval(typeInterval);
  }, [stage, loopCount]);

  return (
    <div className="w-full max-w-[340px] aspect-[4/3] bg-term-bg border border-term-border rounded-lg overflow-hidden shadow-2xl relative flex flex-col">
       {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-term-accent via-blue-500 to-transparent opacity-50 z-10"></div>

      {/* Header */}
      <div className="bg-term-header px-3 py-2 border-b border-term-border flex items-center justify-between shrink-0">
         <div className="flex items-center gap-2">
            <Terminal size={12} className="text-text-muted" />
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">AI_SENTIMENT_LOG</span>
         </div>
         {stage === 'typing' || stage === 'done' ? (
             <div className="flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-trade-up animate-pulse"></div>
                 <span className="text-[8px] text-trade-up font-bold">LIVE</span>
             </div>
         ) : (
             <div className="flex items-center gap-1 opacity-50">
                 <div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div>
                 <span className="text-[8px] text-gray-500 font-bold">STANDBY</span>
             </div>
         )}
      </div>
      
      {/* FIXED HEIGHT CONTAINER to prevent resizing */}
      <div className="flex-1 p-4 bg-term-bg relative overflow-hidden flex flex-col h-full">
         
         {/* SCENARIO 1: IDLE / BUTTON */}
         {(stage === 'idle') && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
                <div className="text-text-muted flex flex-col items-center gap-2 opacity-70">
                    <Sparkles size={16} />
                    <span className="text-[9px] font-mono uppercase tracking-widest">Awaiting Command</span>
                </div>
                {/* Simulate Button Click Animation */}
                <div className="relative">
                    <button className="flex items-center gap-2 px-4 py-2 bg-term-accent hover:bg-term-accent text-white border border-term-accent/30 rounded shadow-glow transform transition-all duration-300 scale-100 animate-pulse">
                        <Play size={12} className="fill-current" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">Generate Insight</span>
                    </button>
                    {/* Fake Cursor/Pulse simulating click moment */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/20 rounded opacity-0 animate-[ping_0.5s_ease-in-out_1s]"></div>
                </div>
            </div>
         )}

         {/* SCENARIO 2: LOADING */}
         {(stage === 'loading') && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
                <Cpu size={24} className="text-term-accent animate-spin" />
                <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-mono text-term-accent font-bold">ESTABLISHING NEURAL LINK</span>
                    <span className="text-[8px] font-mono text-text-muted">Analyzing market parameters...</span>
                </div>
            </div>
         )}

         {/* SCENARIO 3: RESULT / TYPING */}
         {(stage === 'typing' || stage === 'done') && (
             <div className="font-mono text-xs leading-relaxed text-text-muted h-full w-full">
                <div className="mb-2">
                    <span className="text-term-accent select-none mr-2">root@cognitive:~$</span>
                    <span className="text-text-main">{typedText}</span>
                    {stage === 'typing' && (
                        <span className="inline-block w-1.5 h-3 bg-term-accent ml-1 animate-pulse align-middle"></span>
                    )}
                </div>
                
                {/* Tags appear only when done or near end of typing */}
                <div className={`flex flex-wrap gap-2 mt-4 transition-opacity duration-500 ${typedText.length > 20 ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="bg-term-border px-1.5 py-0.5 rounded text-[9px] text-text-main border border-white/5 animate-in slide-in-from-bottom-1 fade-in duration-500">[Accumulation]</span>
                    <span className="bg-term-border px-1.5 py-0.5 rounded text-[9px] text-text-main border border-white/5 animate-in slide-in-from-bottom-1 fade-in duration-700 delay-100">[Support_Hold]</span>
                </div>
             </div>
         )}

      </div>
    </div>
  );
};