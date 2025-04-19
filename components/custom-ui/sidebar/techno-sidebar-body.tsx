import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import TechnoSidebarItem from './techno-sidebar-item';
import { Presentation, UserPlus, IndianRupee, FolderOpen, BookOpen, Users } from 'lucide-react';

export default function TechnoSidebarBody() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {MENU_ITEMS.map((item, i) => (
        <TechnoSidebarItem key={i} icon={item.icon} text={item.text} />
      ))}
    </div>
  );
}

const MENU_ITEMS = [
  { icon: Presentation, text: SIDEBAR_ITEMS.MARKETING },
  { icon: UserPlus, text: SIDEBAR_ITEMS.ADMISSIONS },
  { icon: IndianRupee, text: SIDEBAR_ITEMS.FINANCE },
  { icon: FolderOpen, text: SIDEBAR_ITEMS.STUDENT_REPOSITORY },
  { icon: BookOpen, text: SIDEBAR_ITEMS.ACADEMICS },
  { icon: Users, text: SIDEBAR_ITEMS.FACULTY }
];

