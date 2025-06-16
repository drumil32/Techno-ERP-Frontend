"use client"
import { createContext, useContext, useMemo, useState } from 'react';

interface HomeContextType {
  homeRoute: string;
  setHomeRoute: (item: string) => void;
}

const HomeContext = createContext({
  homeRoute: '',
  setHomeRoute: (item: string) => {}
});

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [homeRoute, setHomeRoute] = useState('');

  const value = useMemo(
    () => ({
      homeRoute,
      setHomeRoute
    }),
    [homeRoute]
  );

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}
export function useHomeContext(): HomeContextType {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('Must be inside the HomeProvider');
  }
  return context;
}
