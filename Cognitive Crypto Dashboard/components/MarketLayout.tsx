
import React from 'react';
import { CryptoData } from '../types';
import { TacticalCard } from './TacticalCard';
import { StrategicTable } from './StrategicTable';
import { Plus, ListFilter } from 'lucide-react';

interface Props {
  data: CryptoData[];
  onAddAsset: () => void;
}

export const MarketLayout: React.FC<Props> = ({ data, onAddAsset }) => {
  
  const AddButton = () => (
    <button 
        onClick={onAddAsset}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-term-accent hover:text-white transition-colors border border-term-accent/20 hover:border-term-accent px-2 py-1 rounded"
    >
        <Plus size={12} /> Add Asset
    </button>
  );

  return (
    <>
      {/* 
        Mobile View (< 768px): Tactical List 
        Vertical Stack for better information density on small screens
      */}
      <section className="md:hidden space-y-4" aria-label="Tactical Market Data">
        <div className="flex items-center justify-between px-1 mb-2">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-term-accent animate-pulse"></span>
            Tactical Feed
          </h2>
          <AddButton />
        </div>
        
        <div className="flex flex-col gap-3 pb-6">
          {data.map(coin => (
            <TacticalCard key={coin.id} data={coin} />
          ))}
          {data.length === 0 && (
             <div className="p-8 text-center text-text-muted text-xs border border-dashed border-term-border rounded-lg">
                System Initializing...
             </div>
          )}
        </div>
      </section>

      {/* 
        Tablet & Desktop View (>= 768px): Strategic Table 
        We use the Strategic Table as the primary view for anything larger than mobile
        to provide the detailed "Overview" requested.
      */}
      <section className="hidden md:block space-y-4" aria-label="Strategic Market Data">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
            <ListFilter size={12} />
            Strategic Overview
            </h2>
            <AddButton />
        </div>
        <StrategicTable data={data} />
      </section>
    </>
  );
};
