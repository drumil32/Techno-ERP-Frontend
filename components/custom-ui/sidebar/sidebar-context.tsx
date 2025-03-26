import { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  sidebarActiveItem: string;
  setSidebarActiveItem: (item: string) => void;
}

const SidebarContext = createContext({
  sidebarActiveItem: '',
  setSidebarActiveItem: (item: string) => {}
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarActiveItem, setSidebarActiveItem] = useState('Marketing');

  return (
    <SidebarContext.Provider value={{ sidebarActiveItem, setSidebarActiveItem }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('Must be inside the SidebarProvider');
  }
  return context;
}
