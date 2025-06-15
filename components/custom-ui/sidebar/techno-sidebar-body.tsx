'use client';

import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import TechnoSidebarItem from './techno-sidebar-item';
import { Presentation, UserPlus, IndianRupee, FolderOpen, BookOpen, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import useAuthStore from '@/stores/auth-store';
import { getSidebarItemsByUserRoles } from '@/lib/enumDisplayMapper';

export default function TechnoSidebarBody() {
  const { user } = useAuthStore();
  const [enabledItems, setEnabledItems] = useState<string[]>([]);

  useEffect(() => {
    if (user?.roles) {
      const items = new Set(user.roles.flatMap((role) => 
        getSidebarItemsByUserRoles(role)
      ));
      setEnabledItems(Array.from(items));
    }
  }, [user]);

  const visibleItems = MENU_ITEMS.filter(item => enabledItems.includes(item.text));

  return (
    <div className="flex flex-col gap-4 w-full">
      {visibleItems.map((item, i) => (
        <TechnoSidebarItem 
          key={i} 
          icon={item.icon} 
          text={item.text} 
          onClick={() => {}} 
        />
      ))}
    </div>
  );
}

export const MENU_ITEMS = [
  { icon: Presentation, text: SIDEBAR_ITEMS.MARKETING },
  { icon: UserPlus, text: SIDEBAR_ITEMS.ADMISSIONS },
  { icon: IndianRupee, text: SIDEBAR_ITEMS.FINANCE },
  { icon: FolderOpen, text: SIDEBAR_ITEMS.STUDENT_REPOSITORY },
  { icon: BookOpen, text: SIDEBAR_ITEMS.ACADEMICS },
  { icon: Users, text: SIDEBAR_ITEMS.FACULTY }
];