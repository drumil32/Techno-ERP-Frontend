import { createContext, useContext, useState } from "react";

const SidebarContext = createContext({ activeItem: "", setActiveItem: (item: string) => { } });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [activeItem, setActiveItem] = useState("Marketing");

    return (
        <SidebarContext.Provider value={{ activeItem, setActiveItem }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarContext() {
  return useContext(SidebarContext);
}
