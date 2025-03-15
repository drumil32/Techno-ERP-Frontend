import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext({ sidebarActiveItem: '', setSidebarActiveItem: (item: string) => {} });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarActiveItem, setSidebarActiveItem] = useState('Marketing');

  return (
    <SidebarContext.Provider value={{ sidebarActiveItem, setSidebarActiveItem }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if(!context) {
    return new Error("Must be in the SiderBarProvider")
  }
  return context
}
