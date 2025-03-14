import { SidebarProvider } from "./sidebar-context";
import TechnoSidebarItem from "./techno-sidebar-item";
import { Presentation, UserPlus, IndianRupee, FolderOpen, BookOpen, Users } from 'lucide-react';

export default function TechnoSidebarBody() {
    return (
        <SidebarProvider>
            <div className="flex flex-col gap-4 w-full">
                {MENU_ITEMS.map((item, i) => (
                    <TechnoSidebarItem key={i} icon={item.icon} text={item.text} />
                ))}
            </div>
        </SidebarProvider>
    );
}

const MENU_ITEMS = [
  { icon: Presentation, text: "Marketing" },
  { icon: UserPlus, text: "Admissions" },
  { icon: IndianRupee, text: "Finance" },
  { icon: FolderOpen, text: "Student Repository" },
  { icon: BookOpen, text: "All Courses" },
  { icon: Users, text: "Faculty" },
];
