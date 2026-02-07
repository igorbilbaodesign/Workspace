import React, { useReducer, useEffect, useMemo, useState } from 'react';
import { Moon, Sun, LayoutGrid, Lightbulb, CircleHelp } from 'lucide-react';

import { AppState, Task } from './types';
import { StorageService } from './services/storage';
import { appReducer, initialState } from './reducers/appReducer';
import { useHistory } from './hooks/useHistory';
import { generateMockTasks } from './utils/mockData';

import TaskItem from './components/TaskItem';
import Omnibar from './components/Omnibar';
import Dashboard from './components/Dashboard';
import HelpModal from './components/HelpModal';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState, (init) => {
    const loadedTheme = StorageService.loadTheme();
    return { ...init, theme: loadedTheme };
  });

  const { history, undo, redo } = useHistory(state.tasks, state.isLoading, dispatch);

  // Local State
  const [smartFilterIds, setSmartFilterIds] = useState<string[] | null>(null);
  const [isHudOpen, setIsHudOpen] = useState(false); // Mobile HUD Modal
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // --- INIT ---
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const tasksPromise = StorageService.loadTasks();
        const timeoutPromise = new Promise<Task[]>(r => setTimeout(() => r([]), 1500));
        const tasks = await Promise.race([tasksPromise, timeoutPromise]);
        if (mounted) dispatch({ type: 'SET_TASKS', payload: tasks });
      } catch (e) { console.warn(e); } 
      finally { if (mounted) dispatch({ type: 'SET_LOADING', payload: false }); }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  useEffect(() => { 
    if (!state.isLoading) StorageService.saveTasks(state.tasks); 
  }, [state.tasks, state.isLoading]);

  useEffect(() => {
    StorageService.saveTheme(state.theme);
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  // --- HANDLERS ---
  const handleLoadMockData = () => {
    // Instant load for better UX
    const mockTasks = generateMockTasks();
    dispatch({ type: 'IMPORT_DATA', payload: mockTasks });
  };

  // --- FILTERING ---
  const filteredTasks = useMemo(() => {
    return state.tasks.filter(task => {
      const filterMatch = state.filter === 'all' || (state.filter === 'active' ? !task.completed : task.completed);
      let searchMatch = true;
      if (smartFilterIds) {
        searchMatch = smartFilterIds.includes(task.id);
      } else if (state.searchQuery) {
        searchMatch = task.text.toLowerCase().includes(state.searchQuery.toLowerCase());
      }
      return filterMatch && searchMatch;
    });
  }, [state.tasks, state.filter, state.searchQuery, smartFilterIds]);

  if (state.isLoading) return null;

  return (
    <div className="relative h-screen w-full flex flex-col font-sans overflow-hidden bg-canvas dark:bg-[#050505] transition-colors duration-300">
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} theme={state.theme} />

      {/* --- TOP NAV (Translucent) --- */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-canvas/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-gray-300 dark:border-cyber-border h-16 flex items-center justify-center transition-all">
        <div className="w-full max-w-6xl px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h1 className="font-bold tracking-tight text-lg text-black dark:text-gray-100">
              TASK<span className="font-light opacity-80 dark:opacity-60">FLOW</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-1">
             <button 
               onClick={handleLoadMockData}
               className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-gray-800 text-yellow-600 dark:text-yellow-500 transition-colors"
               title="Load Demo Data"
             >
               <Lightbulb size={18} />
             </button>
             
             <button 
               onClick={() => setIsHelpOpen(true)}
               className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400 transition-colors"
               title="Help Guide"
             >
               <CircleHelp size={18} />
             </button>

             <button 
              onClick={() => dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' })}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400 transition-colors"
            >
              {state.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            {/* Mobile HUD Toggle - Hidden on Large Screens */}
            <button 
              onClick={() => setIsHudOpen(true)}
              className="lg:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-400 transition-colors"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* --- WORKSPACE LAYOUT --- */}
      <div className="flex-1 flex justify-center pt-20 px-4 h-full overflow-hidden">
        <div className="w-full max-w-6xl flex gap-8 h-full">
          
          {/* --- MAIN STREAM (Left/Center) --- */}
          <main className="flex-1 flex flex-col h-full relative">
            
            {/* Scrollable Tasks Area */}
            <div className="flex-1 overflow-y-auto pb-40 px-1 no-scrollbar space-y-3">
               
               {/* Status Header */}
               {(state.filter !== 'all' || smartFilterIds || state.searchQuery) && (
                <div className="flex items-center justify-between text-xs font-mono text-gray-500 dark:text-gray-400 mb-2 px-2 animate-in fade-in slide-in-from-top-2">
                  <span>
                    FILTER: <span className="text-blue-600 dark:text-blue-500 font-bold uppercase">{state.filter}</span>
                    {smartFilterIds && <span className="ml-2 text-purple-600 dark:text-purple-500"> + AI ACTIVE</span>}
                  </span>
                  <span>{filteredTasks.length} RESULTS</span>
                </div>
              )}

              {filteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-60 dark:opacity-40">
                  <div className="p-4 rounded-full bg-white dark:bg-[#111] shadow-sm mb-4">
                     <LayoutGrid size={32} strokeWidth={1.5} className="text-gray-400 dark:text-gray-600" />
                  </div>
                  <p className="font-mono text-sm tracking-widest text-gray-600 dark:text-gray-400">NO TASKS FOUND</p>
                  <button 
                    onClick={handleLoadMockData}
                    className="mt-4 text-xs text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Load Demo Data?
                  </button>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={(id) => dispatch({ type: 'TOGGLE_TASK', payload: id })}
                    onDelete={(id) => dispatch({ type: 'DELETE_TASK', payload: id })}
                    onEdit={(id, text) => dispatch({ type: 'EDIT_TASK', payload: { id, text } })}
                    onToggleEdit={(id) => dispatch({ type: 'TOGGLE_EDIT_MODE', payload: id })}
                  />
                ))
              )}
            </div>

            {/* Floating Deck (Omnibar) - Positioned relative to this column */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-canvas via-canvas/95 to-transparent dark:from-[#050505] dark:via-[#050505]/95 pointer-events-none flex justify-center z-10">
              <div className="w-full max-w-2xl pointer-events-auto shadow-2xl rounded-[28px]">
                <Omnibar 
                  onAddTask={(text, tags, priority) => dispatch({ 
                    type: 'ADD_TASK', 
                    payload: { id: generateId(), text, completed: false, priority, createdAt: Date.now(), tags } 
                  })}
                  onSetSearch={(q) => dispatch({ type: 'SET_SEARCH', payload: q })}
                  onSmartFilter={setSmartFilterIds}
                  onClearSmartFilter={() => { setSmartFilterIds(null); dispatch({ type: 'SET_SEARCH', payload: '' }) }}
                  smartFilterActive={smartFilterIds !== null}
                  tasksForAI={state.tasks}
                  currentFilter={state.filter}
                  onSetFilter={(f) => dispatch({ type: 'SET_FILTER', payload: f })}
                />
              </div>
            </div>

          </main>

          {/* --- HUD SIDEBAR (Right - Visible on Desktop) --- */}
          <aside className="hidden lg:flex w-80 flex-col gap-6 pt-1 h-full overflow-y-auto no-scrollbar pb-10">
            <Dashboard 
              stats={state.stats}
              theme={state.theme}
              history={history}
              onUndo={undo}
              onRedo={redo}
              onImport={(data) => dispatch({ type: 'IMPORT_DATA', payload: data })}
              onExport={() => StorageService.exportData(state.tasks)}
              allTasks={state.tasks}
              isEmbedded={true}
            />
            
            {/* Optional decorative footer for sidebar */}
            <div className="mt-auto pt-4 text-[10px] font-mono text-gray-400 text-center opacity-50">
               SYSTEM V2.0 // NEURAL DECK
            </div>
          </aside>

        </div>
      </div>

      {/* --- MOBILE HUD MODAL (Small Screens Only) --- */}
      {isHudOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-cyber-panel border border-gray-200 dark:border-cyber-border rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 zoom-in-95 duration-300">
            <Dashboard 
              stats={state.stats}
              theme={state.theme}
              history={history}
              onUndo={undo}
              onRedo={redo}
              onImport={(data) => dispatch({ type: 'IMPORT_DATA', payload: data })}
              onExport={() => StorageService.exportData(state.tasks)}
              onMobileClose={() => setIsHudOpen(false)}
              allTasks={state.tasks}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default App;