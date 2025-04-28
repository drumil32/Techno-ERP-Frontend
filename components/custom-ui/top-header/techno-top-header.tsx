import { useEffect } from 'react';
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
  const pathname = usePathname();
  const { setHeaderActiveItem } = useTopHeaderContext();

  useEffect(() => {
    const matchingItem = Object.values(headerItems).find((item) => item.route === pathname);
    if (matchingItem) setHeaderActiveItem(matchingItem.title);
  }, [pathname, headerItems, setHeaderActiveItem]);

  return (
    <div className="relative w-full h-[53px] border-b border-gray-300 flex text-lg bg-white px-2 ">
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
