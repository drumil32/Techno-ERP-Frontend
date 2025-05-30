// stores/techno-filter-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FilterState {
  sectionFilters: Record<string, Record<string, any>>;
  updateFilter: (sectionKey: string, filterKey: string, value: any) => void;
  updateFilters: (sectionKey: string, newFilters: Record<string, any>) => void;
  clearFilters: (sectionKey: string) => void;
}

export const useTechnoFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      sectionFilters: {},

      updateFilter: (sectionKey, filterKey, value) => {
        set((state) => {
          const currentFilters = state.sectionFilters[sectionKey] || {};

          // Skip update if value hasn't changed
          if (currentFilters[filterKey] === value) {
            return state;
          }

          const newFilters = { ...currentFilters };

          if (value === undefined || value === null || value === '') {
            delete newFilters[filterKey];
          } else {
            newFilters[filterKey] = value;
          }

          return {
            sectionFilters: {
              ...state.sectionFilters,
              [sectionKey]: newFilters
            }
          };
        });
      },

      updateFilters: (sectionKey, newFilters) => {
        set((state) => {
          // Skip update if filters haven't changed
          if (JSON.stringify(state.sectionFilters[sectionKey]) === JSON.stringify(newFilters)) {
            return state;
          }

          return {
            sectionFilters: {
              ...state.sectionFilters,
              [sectionKey]: newFilters
            }
          };
        });
      },

      clearFilters: (sectionKey) => {
        set((state) => {
          // Skip update if section already has no filters
          if (!state.sectionFilters[sectionKey]) {
            return state;
          }

          const sectionFilters = { ...state.sectionFilters };
          delete sectionFilters[sectionKey];
          return { sectionFilters };
        });
      }
    }),
    {
      name: 'techno-filters-storage'
    }
  )
);
