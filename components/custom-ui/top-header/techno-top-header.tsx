'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTopHeaderContext } from './top-header-context';
import TechnoTopHeaderItem from './techno-top-header-item';
import { ProfileDropdown } from '../profile/profile-dropdown';

interface HeaderItem {
  title: string;
  route: string;
}

interface TechnoTopHeaderProps {
  headerItems: Record<string, HeaderItem>;
}

export default function TechnoTopHeader({ headerItems }: TechnoTopHeaderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { headerActiveItem, setHeaderActiveItem } = useTopHeaderContext();

  useEffect(() => {
    setIsMounted(true);
    const matchingItem = Object.values(headerItems)
      .filter((item) => pathname.startsWith(item.route))
      .sort((a, b) => b.route.length - a.route.length)[0];
    if (matchingItem) setHeaderActiveItem(matchingItem.title);
  }, [pathname, headerItems, setHeaderActiveItem]);

  if (!isMounted) return null;

  return (
    <div className="relative w-full h-[53px] border-b border-gray-300 flex text-lg bg-white px-2">
      <div className="flex-grow mt-[21px] flex gap-[24px] overflow-x-auto no-scrollbar">
        {Object.values(headerItems).map((item) => (
          <TechnoTopHeaderItem key={item.title} item={item} />
        ))}
      </div>
      <div className="my-auto">
        <ProfileDropdown />
      </div>
    </div>
  );
}
