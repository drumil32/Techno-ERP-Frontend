'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation"; 
import { SITE_MAP } from "@/common/constants/frontendRouting";
import { StudentRepositoryTabs } from "../helpers/enum";

const MoreDetailsHeaderContext = createContext<any>(null);

export function MoreDetailsHeaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const { id, stage } = useParams();
  const [headerActiveItem, setHeaderActiveItem] = useState<string | null>(null);

  useEffect(() => {
    if (!headerActiveItem) {
      const validStages = Object.values(StudentRepositoryTabs);
      if (
        validStages.includes(stage as StudentRepositoryTabs) &&
        pathname.includes(SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(id as string, stage as string))
      ) {
        setHeaderActiveItem(typeof stage === 'string' ? stage : null);
      }
    }
  }, [pathname, headerActiveItem, stage]);

  return (
    <MoreDetailsHeaderContext.Provider value={{ headerActiveItem, setHeaderActiveItem }}>
      {children}
    </MoreDetailsHeaderContext.Provider>
  );
}

export function useMoreDetailsHeaderContext() {
  return useContext(MoreDetailsHeaderContext);
}
