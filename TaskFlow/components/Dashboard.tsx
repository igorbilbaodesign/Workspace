import React from 'react';
import { RotateCcw, RotateCw, Upload, Download, X, Terminal } from 'lucide-react';
import Stats from './Stats';
import { AppState, HistoryState } from '../types';
import { TestSuite } from '../utils/testSuite';

interface DashboardProps {
  stats: AppState['stats'];
  theme: 'light' | 'dark';
  history: HistoryState;
  onUndo: () => void;
  onRedo: () => void;
  onImport: (tasks: any[]) => void;
  onExport: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  allTasks: any[];
  isEmbedded?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  stats,
  theme,
  history,
  onUndo,
  onRedo,
  onImport,
  onExport,
  onMobileClose,
  allTasks,
  isEmbedded = false
}) => {
  
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try { onImport(JSON.parse(ev.target?.result as string)); } 
        catch { alert("Invalid File"); }
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const handleDiagnostics = async () => {
     const suite = new TestSuite();
     const res = await suite.runHealthCheck(allTasks, ()=>{}, ()=>{});
     alert(res);
  };

  // If embedded, we remove the container styles that are used for the modal card
  const containerClass = isEmbedded 
    ? "flex flex-col h-full w-full gap-4" 
    : "flex flex-col h-full bg-[#f4f4f5] dark:bg-[#0f0f0f] relative";

  return (
    <div className={containerClass}>
      {/* Header - Only show if NOT embedded */}
      {!isEmbedded && (
        <div className="flex items-center justify-between p-5 border-b border-gray-300 dark:border-[#222]">
          <h2 className="font-mono text-sm font-bold tracking-widest text-gray-600 dark:text-gray-500 uppercase">System HUD</h2>
          {onMobileClose && (
            <button onClick={onMobileClose} className="p-1 hover:bg-gray-200 dark:hover:bg-[#222] rounded-md">
              <X size={18}/>
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className={isEmbedded ? "space-y-4" : "p-6 space-y-6 overflow-y-auto"}>
        
        {/* Stats Section */}
        <div className="space-y-2">
           <Stats stats={stats} isDark={theme === 'dark'} />
        </div>

        {/* Tools Section */}
        <div className="grid grid-cols-2 gap-3">
           <button 
             onClick={onUndo} 
             disabled={history.past.length === 0}
             className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#f4f4f5] dark:bg-[#111] border border-gray-400 dark:border-[#333] hover:border-blue-500 hover:shadow-md transition-all disabled:opacity-50 text-gray-900 dark:text-gray-100"
           >
             <RotateCcw size={16} /> <span className="text-sm font-medium">Undo</span>
           </button>
           <button 
             onClick={onRedo}
             disabled={history.future.length === 0}
             className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#f4f4f5] dark:bg-[#111] border border-gray-400 dark:border-[#333] hover:border-blue-500 hover:shadow-md transition-all disabled:opacity-50 text-gray-900 dark:text-gray-100"
           >
             <RotateCw size={16} /> <span className="text-sm font-medium">Redo</span>
           </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-100 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-400 cursor-pointer font-medium text-sm hover:bg-blue-200 dark:hover:bg-blue-900/20 transition-colors">
            <Upload size={16} /> Import Data
            <input type="file" className="hidden" accept=".json" onChange={handleImportFile} />
          </label>
          <button 
             onClick={onExport}
             className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#f4f4f5] dark:bg-[#111] border border-gray-400 dark:border-[#333] text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-[#222] transition-colors"
          >
            <Download size={16} /> Export JSON
          </button>
        </div>
        
        <button onClick={handleDiagnostics} className="w-full py-4 flex items-center justify-center gap-2 text-xs font-mono text-gray-500 hover:text-green-700 dark:hover:text-green-600 transition-colors border-t border-dashed border-gray-400 dark:border-[#333] mt-2">
           <Terminal size={12}/> RUN DIAGNOSTICS
        </button>

      </div>
    </div>
  );
};

export default Dashboard;