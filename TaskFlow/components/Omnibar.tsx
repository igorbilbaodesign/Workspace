import React, { useState, useRef } from 'react';
import { Plus, Search, Sparkles, Brain, X, ArrowUp, Filter } from 'lucide-react';
import { Priority, FilterType } from '../types';
import { breakdownTaskWithAI, smartFilterTasks } from '../services/geminiService';

interface OmnibarProps {
  onAddTask: (text: string, tags: string[], priority: Priority) => void;
  onSetSearch: (query: string) => void;
  onSmartFilter: (ids: string[]) => void;
  onClearSmartFilter: () => void;
  smartFilterActive: boolean;
  tasksForAI: any[];
  currentFilter: FilterType;
  onSetFilter: (f: FilterType) => void;
}

const Omnibar: React.FC<OmnibarProps> = ({ 
  onAddTask, onSetSearch, onSmartFilter, onClearSmartFilter, 
  smartFilterActive, tasksForAI, currentFilter, onSetFilter 
}) => {
  const [mode, setMode] = useState<'add' | 'search'>('add');
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleAction = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    if (mode === 'add') {
      const tags = inputValue.match(/#\w+/g)?.map(t => t.substring(1)) || [];
      const cleanText = inputValue.replace(/#\w+/g, '').trim();
      onAddTask(cleanText, tags, priority);
      setInputValue('');
    } else {
      handleSmartSearch();
    }
  };

  const handleSmartSearch = async () => {
    if (!inputValue.trim()) return;
    setIsProcessingAI(true);
    try {
      const ids = await smartFilterTasks(inputValue, tasksForAI);
      onSmartFilter(ids);
      onSetSearch(inputValue);
    } catch {
      alert("AI Search Failed");
    } finally {
      setIsProcessingAI(false);
    }
  };

  const toggleMode = () => {
    const newMode = mode === 'add' ? 'search' : 'add';
    setMode(newMode);
    if (newMode === 'add') onClearSmartFilter();
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Filter Chips (Pop up above bar) */}
      {showFilters && (
        <div className="flex gap-2 mb-3 bg-[#f4f4f5]/90 dark:bg-cyber-panel/90 backdrop-blur-md p-2 rounded-2xl border border-gray-400 dark:border-cyber-border animate-in slide-in-from-bottom-2 fade-in shadow-lg">
          {(['all', 'active', 'completed'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => { onSetFilter(f); setShowFilters(false); }}
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors
                ${currentFilter === f 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'text-gray-700 hover:bg-gray-200 dark:text-gray-500 dark:hover:bg-gray-800'}`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* Main Bar */}
      <div className={`
        relative w-full flex items-center gap-2 p-2 rounded-[24px] 
        bg-[#f4f4f5] dark:bg-[#111] border border-gray-400 dark:border-[#333]
        shadow-2xl transition-all duration-300
        ${smartFilterActive ? 'ring-2 ring-purple-500/50' : ''}
      `}>
        
        {/* Left Toggle (Mode) */}
        <button 
          onClick={toggleMode}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors flex-shrink-0
            ${mode === 'add' 
              ? 'bg-gray-200 dark:bg-[#222] text-black dark:text-gray-100' 
              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-600'}`}
        >
          {mode === 'add' ? <Plus size={20} /> : <Search size={20} />}
        </button>

        {/* Filter Toggle */}
        <button 
           onClick={() => setShowFilters(!showFilters)}
           className={`w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0
             ${currentFilter !== 'all' ? 'text-blue-600 bg-blue-100 dark:text-blue-500 dark:bg-blue-900/20' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
        >
           <Filter size={16} />
        </button>

        {/* Input Field */}
        <form onSubmit={handleAction} className="flex-1 min-w-0">
          <input 
            type="text" 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={mode === 'add' ? "New Task..." : "Ask AI..."}
            className="w-full bg-transparent border-none outline-none text-base font-medium text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-600"
          />
        </form>

        {/* Priority Selector (Only in Add Mode) */}
        {mode === 'add' && inputValue.length > 0 && (
           <select 
             value={priority}
             onChange={e => setPriority(e.target.value as Priority)}
             className="hidden sm:block bg-gray-200 dark:bg-[#222] text-xs font-mono font-bold py-1 px-2 rounded-lg border-none outline-none text-gray-700 dark:text-gray-500 cursor-pointer"
           >
             <option value="low">LO</option>
             <option value="medium">MD</option>
             <option value="high">HI</option>
           </select>
        )}

        {/* Action Button */}
        <button
          onClick={(e) => {
            if (smartFilterActive) {
              onClearSmartFilter(); 
              setInputValue('');
            } else {
              handleAction();
            }
          }}
          disabled={!inputValue && !smartFilterActive}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 flex-shrink-0
            ${smartFilterActive 
               ? 'bg-gray-200 dark:bg-[#333] text-gray-600 dark:text-gray-500' 
               : inputValue 
                 ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-100' 
                 : 'bg-transparent text-gray-400 dark:text-gray-700 scale-90'
            }`}
        >
          {isProcessingAI ? <Sparkles size={18} className="animate-spin" /> : smartFilterActive ? <X size={18} /> : <ArrowUp size={20} strokeWidth={3} />}
        </button>

      </div>
    </div>
  );
};

export default Omnibar;