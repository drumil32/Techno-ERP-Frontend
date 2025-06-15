'use client';
import { HoverContext } from '@/components/custom-ui/sidebar/hover-context';
import { SidebarProvider, useSidebarContext } from '@/components/custom-ui/sidebar/sidebar-context';
import TechnoSidebar from '@/components/custom-ui/sidebar/techno-sidebar';
import { MENU_ITEMS } from '@/components/custom-ui/sidebar/techno-sidebar-body';
import { TopHeaderProvider } from '@/components/custom-ui/top-header/top-header-context';
import { getHomePage, getSidebarItemsByUserRoles } from '@/lib/enumDisplayMapper';
import useAuthStore from '@/stores/auth-store';
import { Loader } from 'lucide-react';
import { redirect, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
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

  const expand = (visibleItems.length > 1);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1025);
      if (window.innerWidth < 1025) setHovered(false);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleHover = (isHovered: boolean) => {
    if (isLargeScreen) setHovered(isHovered);
  };

  return (
    <HoverContext.Provider value={hovered}>
      <TopHeaderProvider>
        <div className="flex h-screen w-full overflow-hidden">
          <aside
            className={`fixed left-0 top-0 h-full bg-primary text-white transition-all duration-300 flex flex-col items-center py-6 px-2 rounded-r-4xl shadow-lg gap-8 ${isLargeScreen ? ((hovered && expand) ? 'w-72' : 'w-[62px]') : 'w-[62px]'
              }`}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
          >
            <TechnoSidebar />
          </aside>

          <main
            className={`flex-1 overflow-y-auto transition-all duration-300 bg-[#FAFAFA] ${isLargeScreen ? ((hovered && expand) ? 'pl-80' : 'pl-24') : 'pl-24'
              }`}
          >
            {children}
          </main>
        </div>
      </TopHeaderProvider>
    </HoverContext.Provider>
  );
}
