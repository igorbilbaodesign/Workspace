import React from 'react';
import { AppState } from '../types';

interface StatsProps {
  stats: AppState['stats'];
  isDark: boolean;
}

const Stats: React.FC<StatsProps> = ({ stats, isDark }) => {
  const percentage = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className={`
      w-full rounded-2xl p-5 relative overflow-hidden transition-all duration-300 border
      ${isDark 
        ? 'bg-gray-900 border-gray-800 text-white' 
        : 'bg-[#f4f4f5] border-gray-400 text-black shadow-sm'
      }
    `}>
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 p-4 opacity-10 ${isDark ? 'text-white' : 'text-black'}`}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
      </div>

      <div className="relative z-10">
        <h3 className="text-4xl font-mono font-bold text-black dark:text-white">{percentage}%</h3>
        <p className={`text-xs uppercase tracking-wider mb-4 font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Completion Rate</p>
        
        <div className={`flex gap-4 border-t pt-4 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          <div>
            <span className="block text-2xl font-bold text-black dark:text-white">{stats.active}</span>
            <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Pending</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-green-700 dark:text-green-500">{stats.completed}</span>
            <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Done</span>
          </div>
          <div>
            <span className={`block text-2xl font-bold ${isDark ? 'text-gray-500' : 'text-gray-800'}`}>{stats.total}</span>
            <span className={`text-[10px] uppercase font-semibold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;