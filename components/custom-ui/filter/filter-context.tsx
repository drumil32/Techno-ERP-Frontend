'use client';
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface FilterContextType {
  filters: Record<string, any>;
  updateFilter: (key: string, value: any) => void;
  updateFilters: (newFilters: Record<string, any>) => void;
  clearFilters: () => void;
}

const TechnoFilterContext = createContext<FilterContextType | null>(null);

const TechnoFilterProvider = ({
  children,
  sectionKey
}: {
  children: ReactNode;
  sectionKey?: string;
}) => {
  const [filters, setFilters] = useState<Record<string, any>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem(`techno-filters-${sectionKey}`);
    return saved ? JSON.parse(saved) : {};
  });

  const persistFilters = useCallback(
    (newFilters: Record<string, any>) => {
      localStorage.setItem(`techno-filters-${sectionKey}`, JSON.stringify(newFilters));
    },
    [sectionKey]
  );

  const updateFilter = useCallback(
    (key: string, value: any) => {
      setFilters((prev) => {
        const newFilters = { ...prev };
        if (value == null || value === '') {
          delete newFilters[key];
        } else {
          newFilters[key] = value;
        }
        persistFilters(newFilters);
        return newFilters;
      });
    },
    [persistFilters]
  );

  const updateFilters = useCallback(
    (newFilters: Record<string, any>) => {
      setFilters((prev) => {
        const merged = { ...prev, ...newFilters };
        Object.keys(merged).forEach((key) => {
          if (newFilters[key] == null || newFilters[key] === '') {
            delete merged[key];
          }
        });
        persistFilters(merged);
        return merged;
      });
    },
    [persistFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters({});
    persistFilters({});
  }, [persistFilters]);

  return (
    <TechnoFilterContext.Provider value={{ filters, updateFilter, updateFilters, clearFilters }}>
      {children}
    </TechnoFilterContext.Provider>
  );
};

export { TechnoFilterProvider };

export function useTechnoFilterContext() {
  const context = useContext(TechnoFilterContext);
  if (!context)
    throw new Error('useTechnoFilterContext must be used within a TechnoFilterProvider');
  return context;
}
