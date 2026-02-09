import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FocusContextType {
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
  isDimmed: (id: string) => boolean;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export const FocusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  // Helper to determine if an item should be visually receded
  const isDimmed = (id: string) => {
    return focusedId !== null && focusedId !== id;
  };

  return (
    <FocusContext.Provider value={{ focusedId, setFocusedId, isDimmed }}>
      {children}
    </FocusContext.Provider>
  );
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
};