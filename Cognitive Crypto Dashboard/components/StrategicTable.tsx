
import React, { useState } from 'react';
import { CryptoData } from '../types';
import { StrategicHeader, SortField, SortDirection, MiniChartTimeframe } from './strategic/StrategicHeader';
import { StrategicRow } from './strategic/StrategicRow';
import { StrategicDetail } from './strategic/StrategicDetail';

interface Props {
  data: CryptoData[];
}

export const StrategicTable: React.FC<Props> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField>('market_cap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [miniTimeframe, setMiniTimeframe] = useState<MiniChartTimeframe>('7D');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === 'asc' 
      ? (aValue > bValue ? 1 : -1)
      : (aValue < bValue ? 1 : -1);
  });

  return (
    <div className="bg-term-panel rounded-xl border border-term-border overflow-hidden shadow-lg animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <StrategicHeader 
             sortField={sortField}
             sortDirection={sortDirection}
             onSort={handleSort}
             miniTimeframe={miniTimeframe}
             onSetMiniTimeframe={setMiniTimeframe}
          />
          <tbody>
            {sortedData.map((coin) => (
              <React.Fragment key={coin.id}>
                 <StrategicRow 
                    coin={coin} 
                    isExpanded={expandedId === coin.id}
                    onToggle={() => toggleRow(coin.id)}
                    miniTimeframe={miniTimeframe}
                 />
                 {expandedId === coin.id && (
                     <StrategicDetail 
                        coin={coin} 
                        initialTimeframe={miniTimeframe} 
                     />
                 )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
