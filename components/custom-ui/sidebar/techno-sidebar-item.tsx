'use client';

import { useRouter, usePathname } from 'next/navigation';
import TechnoIcon from '../icon/TechnoIcon';
import { useHoverContext } from './hover-context';
import { useSidebarContext } from './sidebar-context';
import { ROUTE_MAP } from '@/common/constants/frontendRouting';

export default function TechnoSidebarItem({ icon: Icon, text }: { icon: React.ComponentType<{ size: number, strokeWidth: number }>; text: string }) {
  const hovered = useHoverContext();
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarActiveItem, setSidebarActiveItem } = useSidebarContext();
  
  const isActive = pathname === ROUTE_MAP[text] || sidebarActiveItem === text;
  const handleClick = () => {
    const route = ROUTE_MAP[text];
    setSidebarActiveItem(text);
    if (route) {
      router.push(route);
    }
  };

  return (
    <div
      className={`flex items-center transition-all duration-300 py-3 px-4 ease-in-out cursor-pointer ${
        hovered
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