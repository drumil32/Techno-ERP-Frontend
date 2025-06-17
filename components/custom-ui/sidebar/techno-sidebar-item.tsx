'use client';

import { useRouter, usePathname, redirect } from 'next/navigation';
import TechnoIcon from '../icon/TechnoIcon';
import { useHoverContext } from './hover-context';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebarStore } from '@/stores/sidebar-item';
import useAuthStore from '@/stores/auth-store';
import { getSidebarItemsByUserRoles } from '@/lib/enumDisplayMapper';
import { MENU_ITEMS } from './techno-sidebar-body';
import { getAccess } from '@/lib/checkAccess';
import { tuple } from 'zod';
import Loading from '@/app/loading';

export default function TechnoSidebarItem({
  icon: Icon,
  text,
  onClick
}: {
  icon: React.ComponentType<{ size: number; strokeWidth: number }>;
  text: string;
  onClick?: () => void;
}) {
  const hovered = useHoverContext();
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarActiveItem, setSidebarActiveItem } = useSidebarStore();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1025);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  const routeKey = Object.keys(SIDEBAR_ITEMS).find(
    (key) => SIDEBAR_ITEMS[key as keyof typeof SIDEBAR_ITEMS] === text
  ) as keyof typeof SITE_MAP | undefined;

  const getRoute = () => {
    if (!routeKey) return null;

    const mapValue = SITE_MAP[routeKey];

    if (typeof mapValue === 'string') {
      return mapValue;
    } else if (typeof mapValue === 'object') {
      return mapValue.DEFAULT;
    }

    return null;
  };

  const route = getRoute();

  // Check if current item matches active path
  const checkIsActive = () => {
    // First check if pathname matches the route exactly or starts with it
    if (route && pathname.startsWith(route)) {
      return true;
    }

    return sidebarActiveItem === text;
  };

  const [isActive, setIsActive] = useState(checkIsActive());

  // Update active state when pathname or sidebarActiveItem changes
  useEffect(() => {
    setIsActive(checkIsActive());
  }, [pathname, sidebarActiveItem]);

  useEffect(() => {
    let url = "";
    setLoading(true);
    if (pathname.includes("/c/marketing")) {
      url = getAccess(user, SIDEBAR_ITEMS.MARKETING)
      setSidebarActiveItem(SIDEBAR_ITEMS.MARKETING);
    }
    else if (pathname.includes("/c/admission")) {
      url = getAccess(user, SIDEBAR_ITEMS.ADMISSIONS)
      setSidebarActiveItem(SIDEBAR_ITEMS.ADMISSIONS);
    }
    else if (pathname.includes("/c/finance")) {
      url = getAccess(user, SIDEBAR_ITEMS.FINANCE)
      setSidebarActiveItem(SIDEBAR_ITEMS.FINANCE);
    }
    else if (pathname.includes("/c/academics")) {
      url = getAccess(user, SIDEBAR_ITEMS.ACADEMICS)
      setSidebarActiveItem(SIDEBAR_ITEMS.ACADEMICS);
    }
    else if (pathname.includes("/c/student-repository")) {
      url = getAccess(user, SIDEBAR_ITEMS.STUDENT_REPOSITORY)
    }

    setLoading(false)
     if (url && url !== pathname) {
      router.push(url);
    }
  }, [pathname])

  const handleClick = () => {
    setSidebarActiveItem(text);
    if (route) {
      router.push(route);
    }
    if (onClick) onClick();
  };

  const shouldShowExpanded = isLargeScreen ? (hovered && expand) : false;

  if (loading) {
    <Loading />;
  }

  return (
    <TooltipProvider>

      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center transition-all duration-300 py-3 px-4 ease-in-out cursor-pointer ${shouldShowExpanded
              ? `justify-start gap-4 rounded-lg w-full ${isActive && `bg-[#FAFAFA] text-primary rounded-lg`}`
              : isActive
                ? 'justify-start rounded-l-lg w-[145%] bg-[#FAFAFA] text-primary'
                : 'justify-center w-full'
              }`}
            onClick={handleClick}
          >
            <TechnoIcon className="transition-transform duration-100 ease-in-out">
              <Icon size={24} strokeWidth={1.5} />
            </TechnoIcon>
            {shouldShowExpanded && (
              <div className="flex items-center gap-4 ml-2">
                <p className="text-md">{text}</p>
              </div>
            )}
          </div>
        </TooltipTrigger>
        {!isLargeScreen && !shouldShowExpanded && (
          <TooltipContent side="right">
            <p>{text}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}