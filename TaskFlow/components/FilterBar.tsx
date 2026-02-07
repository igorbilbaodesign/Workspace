import React from 'react';
import { FilterType } from '../types';

interface FilterBarProps {
  currentFilter: FilterType;
  stats: { total: number; active: number; completed: number };
  onSetFilter: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, stats, onSetFilter, onClearCompleted }) => {
  const filters: FilterType[] = ['all', 'active', 'completed'];

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => onSetFilter(f)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm whitespace-nowrap
            ${currentFilter === f 
              ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-lg transform scale-105' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)} 
          <span className="opacity-60 text-xs ml-1">
            {f === 'all' ? stats.total : f === 'active' ? stats.active : stats.completed}
          </span>
        </button>
      ))}
      <div className="flex-1"></div>
      <button 
        onClick={onClearCompleted} 
        className="px-3 py-2 rounded-full bg-white dark:bg-gray-800 text-red-500 text-xs font-bold border border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 whitespace-nowrap"
      >
         Clean Up
      </button>
    </div>
  );
};

export default FilterBar;