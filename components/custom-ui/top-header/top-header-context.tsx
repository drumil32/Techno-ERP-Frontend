import { createContext, useContext, useState } from 'react';

const TopHeaderContext = createContext({
  headerActiveItem: '',
  setHeaderActiveItem: (item: string) => {}
});

export function TopHeaderProvider({ children }: { children: React.ReactNode }) {
  const [headerActiveItem, setHeaderActiveItem] = useState('All Leads');

  return (
    <TopHeaderContext.Provider value={{ headerActiveItem, setHeaderActiveItem }}>
      {children}
    </TopHeaderContext.Provider>
  );
}

export function useTopHeaderContext() {
  return useContext(TopHeaderContext);
}
