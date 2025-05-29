import { createContext, useContext, useMemo, useState } from 'react';

interface SidebarContextType {
  sidebarActiveItem: string;
  setSidebarActiveItem: (item: string) => void;
}

const SidebarContext = createContext({
  sidebarActiveItem: '',
  setSidebarActiveItem: (item: string) => {}
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarActiveItem, setSidebarActiveItem] = useState('');

  const value = useMemo(
    () => ({
      sidebarActiveItem,
      setSidebarActiveItem
    }),
    [sidebarActiveItem]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
export function useSidebarContext(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('Must be inside the SidebarProvider');
  }
  return context;
}
