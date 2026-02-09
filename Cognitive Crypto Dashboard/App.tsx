
import React, { useEffect, useState, useCallback } from 'react';
import { MarketState, DataIntegrityStatus, AnalysisResult, CryptoData } from './types';
import { fetchMarketData, fetchSpecificCoin } from './services/cryptoService';
import { analyzeMarket } from './services/geminiService';
import { REFRESH_RATE_MS } from './constants';
import { StatusIndicator } from './components/StatusIndicator';
import { CognitiveInsight } from './components/CognitiveInsight';
import { MarketLayout } from './components/MarketLayout';
import { TemporalNexus } from './components/TemporalNexus';
import { AssetInjector } from './components/AssetInjector';
import { HelpModal } from './components/HelpModal';
import { FocusProvider } from './context/FocusContext';
import { Brain, Menu, Activity, Pause, Play, Plus, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [marketState, setMarketState] = useState<MarketState>({
    data: [],
    status: DataIntegrityStatus.HISTORICAL,
    lastFetchAttempt: 0
  });

  // State for AI
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // State for Controls
  const [isPaused, setIsPaused] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // State for Temporal Nexus (Chart) & Asset Injection
  const [activeChartIds, setActiveChartIds] = useState<string[]>(['bitcoin', 'solana', 'ethereum']);
  const [isInjectorOpen, setIsInjectorOpen] = useState(false);
  const [userInjectedIds, setUserInjectedIds] = useState<string[]>([]); // Track user added coins

  const loadData = useCallback(async () => {
    if (isPaused) return; 

    // 1. Fetch Default Market Data
    const defaultState = await fetchMarketData();
    let finalData = defaultState.data;

    // 2. If user has injected custom coins, fetch them individually and merge
    // (Note: In production, we would optimize this to a single batched call if API allowed)
    if (userInjectedIds.length > 0) {
      const customPromises = userInjectedIds.map(id => fetchSpecificCoin(id));
      const customResults = await Promise.all(customPromises);
      const validCustomCoins = customResults.filter((c): c is CryptoData => c !== null);
      
      // Merge unique coins
      const existingIds = new Set(finalData.map(c => c.id));
      const newCoins = validCustomCoins.filter(c => !existingIds.has(c.id));
      finalData = [...newCoins, ...finalData];
    }

    setMarketState({
      ...defaultState,
      data: finalData
    });
  }, [isPaused, userInjectedIds]);

  // Handle Asset Injection
  const handleInjectAsset = async (coinId: string) => {
    setIsInjectorOpen(false);
    
    // Check if already exists
    if (marketState.data.find(c => c.id === coinId)) {
        // Just add to chart if not there
        if (!activeChartIds.includes(coinId)) {
            setActiveChartIds(prev => [...prev.slice(-4), coinId]); // Max 5
        }
        return;
    }

    // Fetch and Add
    const newCoin = await fetchSpecificCoin(coinId);
    if (newCoin) {
        setUserInjectedIds(prev => [...prev, coinId]);
        setMarketState(prev => ({
            ...prev,
            data: [newCoin, ...prev.data] // Add to top
        }));
        setActiveChartIds(prev => [...prev.slice(-4), coinId]); // Auto add to chart
    }
  };

  const handleToggleChartAsset = (id: string) => {
    setActiveChartIds(prev => {
        if (prev.includes(id)) return prev.filter(cid => cid !== id);
        if (prev.length >= 5) return [...prev.slice(1), id]; // Rotate if full
        return [...prev, id];
    });
  };

  const triggerAnalysis = () => {
    if (marketState.data.length > 0 && !isAnalyzing) {
      setIsAnalyzing(true);
      analyzeMarket(marketState.data).then(result => {
        setAiAnalysis(result);
        setIsAnalyzing(false);
      });
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, REFRESH_RATE_MS);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handle Global ESC to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsInjectorOpen(false);
            setIsHelpOpen(false);
        }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <FocusProvider>
      <div className="min-h-screen bg-term-bg text-text-main font-sans selection:bg-term-accent selection:text-white flex flex-col">
        
        {/* SEMANTIC HEADER */}
        <header className="sticky top-0 z-50 bg-term-bg/80 backdrop-blur-md border-b border-term-border h-16">
          <div className="container mx-auto px-4 h-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-glow border border-white/10">
                <Brain className="text-white fill-current/10 w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-tight text-white leading-none">Cognitive Crypto Dashboard</h1>
                <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Cognitive OS v2.0</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-bold uppercase tracking-wider transition-all
                  ${isPaused 
                    ? 'bg-status-warn/10 text-status-warn border-status-warn/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                    : 'bg-term-panel text-text-muted border-term-border hover:text-white'
                  }`}
              >
                {isPaused ? <Play size={10} className="fill-current" /> : <Pause size={10} className="fill-current" />}
                <span className="hidden sm:inline">{isPaused ? 'RESUME' : 'FREEZE'}</span>
              </button>

              <div className="hidden md:flex items-center gap-2 text-xs text-text-muted font-mono border-l border-term-border pl-4">
                 <Activity size={14} />
                 <span>NET_V2: {isPaused ? 'PAUSED' : 'ONLINE'}</span>
              </div>
              
              <StatusIndicator 
                status={isPaused ? DataIntegrityStatus.HISTORICAL : marketState.status} 
                lastFetch={marketState.lastFetchAttempt} 
              />
              
              <button 
                 onClick={() => setIsHelpOpen(true)}
                 className="text-text-muted hover:text-term-accent transition-colors p-1"
                 aria-label="Help & Guide"
              >
                 <HelpCircle size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* MODALS */}
        <AssetInjector 
            isOpen={isInjectorOpen} 
            onClose={() => setIsInjectorOpen(false)} 
            onSelect={handleInjectAsset} 
        />
        
        <HelpModal 
            isOpen={isHelpOpen} 
            onClose={() => setIsHelpOpen(false)} 
        />

        <main className="flex-grow container mx-auto px-4 py-6 space-y-8">
          
          {/* Layer 1: Cognitive Context */}
          <section aria-label="Market Intelligence">
             <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-status-warn' : 'bg-term-accent animate-pulse'}`}></span>
                  System Insight
                </h2>
             </div>
             <CognitiveInsight 
                analysis={aiAnalysis} 
                loading={isAnalyzing} 
                onAnalyze={triggerAnalysis}
             />
          </section>

          {/* Layer 2 (NEW): Temporal Nexus - Comparative Analysis */}
          <section aria-label="Temporal Analysis">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                Temporal Nexus
            </h2>
            <TemporalNexus 
                data={marketState.data}
                activeIds={activeChartIds}
                onToggleAsset={handleToggleChartAsset}
                onAddAsset={() => setIsInjectorOpen(true)}
            />
          </section>

          {/* Layer 3: Adaptive Market Data (Headers handled inside) */}
          <MarketLayout 
            data={marketState.data} 
            onAddAsset={() => setIsInjectorOpen(true)}
          />

        </main>

        <footer className="border-t border-term-border bg-term-panel py-6 mt-8">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-text-muted font-mono uppercase tracking-wider">
            <div>
              Secure Connection • Encrypted • Local Storage Enabled
            </div>
            <div className="flex gap-4">
              <span>Latency: 24ms</span>
              <span>Mode: {isPaused ? 'Static Analysis' : 'Live Stream'}</span>
            </div>
          </div>
        </footer>
      </div>
    </FocusProvider>
  );
};

export default App;
