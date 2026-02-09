import React, { useState, useEffect } from 'react';
import { Search, Loader2, PlusCircle } from 'lucide-react';
import { searchAssets } from '../services/cryptoService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (coinId: string) => void;
}

export const AssetInjector: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        const coins = await searchAssets(query);
        setResults(coins);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 500); // Debounce

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-term-bg border border-term-border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-term-border bg-term-header">
          <Search className="text-text-muted" size={20} />
          <input 
            type="text" 
            autoFocus
            placeholder="Search asset protocol to inject (e.g. 'pepe', 'ai')..." 
            className="flex-1 bg-transparent border-none outline-none text-sm font-mono text-white placeholder:text-text-muted/50"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {loading && <Loader2 className="animate-spin text-term-accent" size={16} />}
        </div>

        {/* Results List */}
        <div className="max-h-[300px] overflow-y-auto">
          {results.length === 0 && query.length > 2 && !loading && (
             <div className="p-4 text-center text-xs text-text-muted font-mono">
                NO SIGNALS DETECTED
             </div>
          )}
          
          {results.map((coin) => (
            <button
              key={coin.id}
              onClick={() => onSelect(coin.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-term-panel border-l-2 border-l-transparent hover:border-l-term-accent transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <img src={coin.large} alt={coin.symbol} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="font-bold text-sm text-text-main group-hover:text-white">{coin.name}</div>
                  <div className="text-xs text-text-muted font-mono uppercase">{coin.symbol}</div>
                </div>
              </div>
              <PlusCircle className="text-text-muted group-hover:text-term-accent" size={18} />
            </button>
          ))}
          
          {query.length < 2 && (
             <div className="p-8 text-center text-xs text-text-muted/40 font-mono uppercase tracking-widest">
                System Awaiting Input...
             </div>
          )}
        </div>
        
        {/* Footer Hint */}
        <div className="bg-term-panel p-2 text-[10px] text-text-muted text-center border-t border-term-border">
           Press <span className="bg-term-border px-1 rounded text-text-main">ESC</span> to cancel
        </div>
      </div>
    </div>
  );
};