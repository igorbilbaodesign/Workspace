export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  createdAt: number;
  tags: string[];
  isEditing?: boolean; // UI state
}

export type FilterType = 'all' | 'active' | 'completed';

export interface AppState {
  tasks: Task[];
  filter: FilterType;
  searchQuery: string;
  theme: 'light' | 'dark';
  isLoading: boolean; // Added for Async IndexedDB
  stats: {
    total: number;
    completed: number;
    active: number;
  };
}

export type Action =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'EDIT_TASK'; payload: { id: string; text: string } }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'IMPORT_DATA'; payload: Task[] }
  | { type: 'BULK_COMPLETE' }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'TOGGLE_EDIT_MODE'; payload: string }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_LOADING'; payload: boolean }; // New action

export interface HistoryState {
  past: AppState['tasks'][];
  present: AppState['tasks'];
  future: AppState['tasks'][];
}