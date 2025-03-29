'use client';

import { useRouter, usePathname } from 'next/navigation';
import TechnoIcon from '../icon/TechnoIcon';
import { useHoverContext } from './hover-context';
import { useSidebarContext } from './sidebar-context';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { ROUTE_MAP } from '@/common/constants/frontendRouting';

export default function TechnoSidebarItem({ icon: Icon, text }: { icon: React.ComponentType<{ size: number, strokeWidth: number }>; text: string }) {
  const hovered = useHoverContext();
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarActiveItem, setSidebarActiveItem } = useSidebarContext();

  // Find the key in SIDEBAR_ITEMS that matches the text
  const routeKey = Object.keys(SIDEBAR_ITEMS).find(
    (key) => SIDEBAR_ITEMS[key as keyof typeof SIDEBAR_ITEMS] === text
  ) as keyof typeof ROUTE_MAP | undefined;

  const route = routeKey ? ROUTE_MAP[routeKey] : null;

  const isActive = pathname === route || sidebarActiveItem === text;

  const handleClick = () => {
    if (route) {
      setSidebarActiveItem(text);
      console.log(route)
      router.push(route);
    }
  };

  return (
    <div
      className={`flex items-center transition-all duration-300 py-3 px-4 ease-in-out cursor-pointer ${hovered
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
      {hovered && (
        <div className="flex items-center gap-4 ml-2">
          <p className="text-md">{text}</p>
        </div>
      )}
    </div>
  );
}

