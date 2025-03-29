'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  filters: Record<string, any>;
  updateFilter: (key: string, value: any) => void;
  updateFilters: (newFilters: Record<string, any>) => void;
  clearFilters: () => void;
}

const TechnoFilterContext = createContext<FilterContextType | null>(null);

export function TechnoFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const updateFilter = (key: string, value: any) => {
    if (value === undefined) {
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const updateFilters = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <TechnoFilterContext.Provider value={{ filters, updateFilter, updateFilters, clearFilters }}>
      {children}
    </TechnoFilterContext.Provider>
  );
}

export function useTechnoFilterContext() {
  const context = useContext(TechnoFilterContext);
  if (!context) {
    throw new Error('useTechnoFilterContext must be used within a TechnoFilterProvider');
  }
  return context;
}
