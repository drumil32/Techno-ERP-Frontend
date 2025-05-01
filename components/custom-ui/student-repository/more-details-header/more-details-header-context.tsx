'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation"; 
import { SITE_MAP } from "@/common/constants/frontendRouting";

const MoreDetailsHeaderContext = createContext<any>(null);

export function TopHeaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const [headerActiveItem, setHeaderActiveItem] = useState<string | null>(null);

  useEffect(() => {
    if (!headerActiveItem) {
      if (pathname.includes(SITE_MAP.MARKETING.ALL_LEADS)) {
        setHeaderActiveItem("All Leads");
      } else if (pathname.includes(SITE_MAP.MARKETING.ACTIVE_LEADS)) {
        setHeaderActiveItem("Active Leads");
      } else if (pathname.includes(SITE_MAP.MARKETING.ADMIN_TRACKER)) {
        setHeaderActiveItem("Admin Tracker");
      }
    }
  }, [pathname, headerActiveItem]);

  return (
    <MoreDetailsHeaderContext.Provider value={{ headerActiveItem, setHeaderActiveItem }}>
      {children}
    </MoreDetailsHeaderContext.Provider>
  );
}

export function useMoreDetailsHeaderContext() {
  return useContext(MoreDetailsHeaderContext);
}
