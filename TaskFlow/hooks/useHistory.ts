import React, { useState, useEffect, useCallback } from 'react';
import { AppState, Task, HistoryState } from '../types';

export const useHistory = (tasks: Task[], isLoading: boolean, dispatch: React.Dispatch<any>) => {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: [],
    future: []
  });

  // Sync history when tasks change (debounce/filter could be added here for performance)
  useEffect(() => {
    if (tasks !== history.present && !isLoading) {
      setHistory(curr => ({
        past: [...curr.past, curr.present].slice(-20), // Keep last 20 states
        present: tasks,
        future: [] 
      }));
    }
  }, [tasks, isLoading]);

  const undo = useCallback(() => {
    if (history.past.length === 0) return;
    const newPresent = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);
    
    setHistory({
      past: newPast,
      present: newPresent,
      future: [history.present, ...history.future]
    });
    
    dispatch({ type: 'SET_TASKS', payload: newPresent });
  }, [history, dispatch]);

  const redo = useCallback(() => {
    if (history.future.length === 0) return;
    const newPresent = history.future[0];
    const newFuture = history.future.slice(1);
    
    setHistory({
      past: [...history.past, history.present],
      present: newPresent,
      future: newFuture
    });
    
    dispatch({ type: 'SET_TASKS', payload: newPresent });
  }, [history, dispatch]);

  return { history, undo, redo };
};