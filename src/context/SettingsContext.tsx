'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type SettingsContextType = {
  grade: string;
  setGrade: (grade: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [grade, setGradeState] = useState('8');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedGrade = localStorage.getItem('userGrade');
      if (savedGrade) {
        setGradeState(savedGrade);
      }
    } catch (error) {
      console.error("Failed to load grade from localStorage", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setGrade = (newGrade: string) => {
    try {
      localStorage.setItem('userGrade', newGrade);
      setGradeState(newGrade);
    } catch (error) {
        console.error("Failed to save grade to localStorage", error);
    }
  };

  if (!isInitialized) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <SettingsContext.Provider value={{ grade, setGrade }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
