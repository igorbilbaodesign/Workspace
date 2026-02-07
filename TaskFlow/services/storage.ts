import { Task } from '../types';

const DB_NAME = 'TaskFlowDB';
const DB_VERSION = 1;
const STORE_NAME = 'tasks';
const THEME_KEY = 'taskflow_theme';

// IndexedDB Helper Class
class IndexedDBService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async getAllTasks(): Promise<Task[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Clear store and bulk add (simple strategy for consistency)
      // For a massive app, we would only update changed items, 
      // but for < 10k items, this is fine and ensures sync.
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        tasks.forEach(task => store.add(task));
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

const dbService = new IndexedDBService();

export const StorageService = {
  // Async initialization and loading
  loadTasks: async (): Promise<Task[]> => {
    try {
      return await dbService.getAllTasks();
    } catch (e) {
      console.error('IndexedDB Load Failed', e);
      return [];
    }
  },

  // Async saving
  saveTasks: async (tasks: Task[]) => {
    try {
      await dbService.saveTasks(tasks);
    } catch (e) {
      console.error('IndexedDB Save Failed', e);
    }
  },

  // Theme stays in LocalStorage (synchronous, lightweight)
  saveTheme: (theme: 'light' | 'dark') => {
    localStorage.setItem(THEME_KEY, theme);
  },

  loadTheme: (): 'light' | 'dark' => {
    return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'dark';
  },

  exportData: (tasks: Task[]) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
};