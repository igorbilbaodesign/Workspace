import { AppState, Action, Task, FilterType } from '../types';

export const initialState: AppState = {
  tasks: [],
  filter: 'all',
  searchQuery: '',
  theme: 'dark',
  isLoading: true,
  stats: { total: 0, completed: 0, active: 0 }
};

const calculateStats = (tasks: Task[]) => ({
  total: tasks.length,
  completed: tasks.filter(t => t.completed).length,
  active: tasks.filter(t => !t.completed).length
});

export const appReducer = (state: AppState, action: Action): AppState => {
  let newTasks: Task[];
  
  switch (action.type) {
    case 'ADD_TASK':
      newTasks = [action.payload, ...state.tasks];
      return { ...state, tasks: newTasks, stats: calculateStats(newTasks) };
    
    case 'DELETE_TASK':
      newTasks = state.tasks.filter(t => t.id !== action.payload);
      return { ...state, tasks: newTasks, stats: calculateStats(newTasks) };
    
    case 'TOGGLE_TASK':
      newTasks = state.tasks.map(t => 
        t.id === action.payload ? { ...t, completed: !t.completed } : t
      );
      return { ...state, tasks: newTasks, stats: calculateStats(newTasks) };
    
    case 'EDIT_TASK':
      newTasks = state.tasks.map(t => 
        t.id === action.payload.id ? { ...t, text: action.payload.text, isEditing: false } : t
      );
      return { ...state, tasks: newTasks };

    case 'TOGGLE_EDIT_MODE':
      newTasks = state.tasks.map(t => 
        t.id === action.payload ? { ...t, isEditing: !t.isEditing } : { ...t, isEditing: false }
      );
      return { ...state, tasks: newTasks };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'BULK_COMPLETE':
      newTasks = state.tasks.map(t => ({ ...t, completed: true }));
      return { ...state, tasks: newTasks, stats: calculateStats(newTasks) };
    
    case 'CLEAR_COMPLETED':
      newTasks = state.tasks.filter(t => !t.completed);
      return { ...state, tasks: newTasks, stats: calculateStats(newTasks) };

    case 'IMPORT_DATA':
      newTasks = [...action.payload, ...state.tasks];
      const uniqueTasks = Array.from(new Map(newTasks.map(item => [item.id, item])).values());
      return { ...state, tasks: uniqueTasks, stats: calculateStats(uniqueTasks) };

    case 'SET_TASKS': 
      return { ...state, tasks: action.payload, stats: calculateStats(action.payload) };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
};