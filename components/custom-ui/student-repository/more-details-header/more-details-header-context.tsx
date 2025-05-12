'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { StudentRepositoryTabs } from '../helpers/enum';

const MoreDetailsHeaderContext = createContext<any>(null);

export function MoreDetailsHeaderProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { id, tabName } = useParams();
  const [headerActiveItem, setHeaderActiveItem] = useState<string | null>(null);

  useEffect(() => {
    if (!headerActiveItem) {
      const validStages = Object.values(StudentRepositoryTabs);
      if (
        validStages.includes(tabName as StudentRepositoryTabs) &&
        pathname.includes(
          SITE_MAP.STUDENT_REPOSITORY.SINGLE_STUDENT(id as string, tabName as string)
        )
      ) {
        setHeaderActiveItem(typeof tabName === 'string' ? tabName : null);
      }
    }
  }, [pathname, headerActiveItem, tabName]);

  return (
    <MoreDetailsHeaderContext.Provider value={{ headerActiveItem, setHeaderActiveItem }}>
      {children}
    </MoreDetailsHeaderContext.Provider>
  );
}

export function useMoreDetailsHeaderContext() {
  return useContext(MoreDetailsHeaderContext);
}
