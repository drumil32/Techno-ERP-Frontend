import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation"; 
import { SITE_MAP } from "@/common/constants/frontendRouting";

const TopHeaderContext = createContext<any>(null);

export function TopHeaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const [headerActiveItem, setHeaderActiveItem] = useState<string | null>(null);

  useEffect(() => {
    if (!headerActiveItem) {
      if (pathname.includes(SITE_MAP.MARKETING.ALL_LEADS)) {
        setHeaderActiveItem("All Leads");
      } else if (pathname.includes(SITE_MAP.MARKETING.YELLOW_LEADS)) {
        setHeaderActiveItem("Yellow Leads");
      } else if (pathname.includes(SITE_MAP.MARKETING.ADMIN_TRACKER)) {
        setHeaderActiveItem("Admin Tracker");
      }
    }
  }, [pathname, headerActiveItem]);

  return (
    <TopHeaderContext.Provider value={{ headerActiveItem, setHeaderActiveItem }}>
      {children}
    </TopHeaderContext.Provider>
  );
}

export function useTopHeaderContext() {
  return useContext(TopHeaderContext);
}
