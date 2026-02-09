
import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export type SortField = 'name' | 'current_price' | 'price_change_percentage_24h' | 'market_cap';
export type SortDirection = 'asc' | 'desc';
export type MiniChartTimeframe = '24H' | '7D';

interface Props {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  miniTimeframe: MiniChartTimeframe;
  onSetMiniTimeframe: (tf: MiniChartTimeframe) => void;
}

export const StrategicHeader: React.FC<Props> = ({ 
  sortField, 
  sortDirection, 
  onSort,
  miniTimeframe,
  onSetMiniTimeframe
}) => {
  
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown size={12} className="opacity-30" />;
    return sortDirection === 'asc' ? <ChevronUp size={12} className="text-term-accent" /> : <ChevronDown size={12} className="text-term-accent" />;
  };

  const HeaderCell = ({ field, label, align = 'left', className = '' }: { field: SortField, label: string, align?: string, className?: string }) => (
    <th 
      onClick={() => onSort(field)}
      className={`py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider cursor-pointer hover:text-text-main hover:bg-term-border/30 transition-colors select-none ${className} text-${align}`}
    >
      <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <thead>
      <tr className="bg-term-header border-b border-term-border">
        <th className="py-4 px-6 text-xs w-10"></th> {/* Expand Icon Column */}
        <HeaderCell field="name" label="Asset" />
        <HeaderCell field="current_price" label="Price" align="right" />
        <HeaderCell field="price_change_percentage_24h" label="24h Change" align="right" />
        <HeaderCell field="market_cap" label="Market Cap" align="right" className="hidden lg:table-cell" />
        
        {/* Toggleable Mini-Chart Column Header */}
        <th className="text-center py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider hidden xl:table-cell">
            <div className="flex items-center justify-center gap-2">
                <span>Trend</span>
                <div className="flex bg-term-bg rounded p-0.5 border border-term-border">
                  <button 
                      onClick={() => onSetMiniTimeframe('24H')}
                      className={`px-1.5 py-0.5 text-[9px] rounded transition-colors ${miniTimeframe === '24H' ? 'bg-term-accent text-white' : 'text-text-muted hover:text-white'}`}
                  >
                      24H
                  </button>
                  <button 
                      onClick={() => onSetMiniTimeframe('7D')}
                      className={`px-1.5 py-0.5 text-[9px] rounded transition-colors ${miniTimeframe === '7D' ? 'bg-term-accent text-white' : 'text-text-muted hover:text-white'}`}
                  >
                      7D
                  </button>
                </div>
            </div>
        </th>
        
        <th className="text-right py-4 px-6 text-xs font-semibold text-text-muted uppercase tracking-wider hidden lg:table-cell">Vol/Cap</th>
      </tr>
    </thead>
  );
};
