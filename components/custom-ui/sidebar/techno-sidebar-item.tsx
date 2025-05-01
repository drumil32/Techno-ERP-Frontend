'use client';

import { useRouter, usePathname } from 'next/navigation';
import TechnoIcon from '../icon/TechnoIcon';
import { useHoverContext } from './hover-context';
import { useSidebarContext } from './sidebar-context';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  const { sidebarActiveItem, setSidebarActiveItem } = useSidebarContext();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  const isActive = (route && pathname.startsWith(route)) || sidebarActiveItem === text;

  const handleClick = () => {
    if (route) {
      setSidebarActiveItem(text);
      router.push(route);
    }
    if (onClick) onClick();
  };

  const shouldShowExpanded = isLargeScreen ? hovered : false;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex items-center transition-all duration-300 py-3 px-4 ease-in-out cursor-pointer ${
              shouldShowExpanded
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
