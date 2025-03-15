"use client"
import { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
    filters: Record<string, any>;
    updateFilter: (key: string, value: any) => void;
};

const TechnoFilterContext = createContext<FilterContextType | null>(null);

export function TechnoFilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<Record<string, any>>({});

    const updateFilter = (key: string, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <TechnoFilterContext.Provider value={{ filters, updateFilter }}>
            {children}
        </TechnoFilterContext.Provider>
    );
}

export function useTechnoFilterContext() {
    const context = useContext(TechnoFilterContext);
    if (!context) {
        throw new Error("Must be in TechnoFilterProvider");
    }
    return context;
}

