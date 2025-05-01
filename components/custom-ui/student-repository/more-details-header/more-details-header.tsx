import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import MoreDetailsHeaderItem from './more-details-header-item';
import { useMoreDetailsHeaderContext } from './more-details-header-context';

interface HeaderItem {
  title: string;
  route: string;
}

interface MoreDetailsHeaderProps {
  headerItems: Record<string, HeaderItem>;
}

export default function MoreDetailsHeader({ headerItems }: MoreDetailsHeaderProps) {
  const pathname = usePathname();
  const { setHeaderActiveItem } = useMoreDetailsHeaderContext();

  useEffect(() => {
    const matchingItem = Object.values(headerItems).find((item) => item.route === pathname);
    if (matchingItem) setHeaderActiveItem(matchingItem.title);
  }, [pathname, headerItems, setHeaderActiveItem]);

  return (
    <div className="relative w-full h-[53px] border-b border-gray-300 flex text-lg bg-white px-2 ">
      <div className="flex-grow mt-[21px] flex gap-[24px] overflow-x-auto no-scrollbar">
        {Object.values(headerItems).map((item) => (
          <MoreDetailsHeaderItem key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}
