import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTopHeaderContext } from './top-header-context';
import TechnoTopHeaderItem from './techno-top-header-item';

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

    if (matchingItem) {
      setHeaderActiveItem(matchingItem.title);
    }
  }, [pathname, headerItems, setHeaderActiveItem]);

  return (
    <div className="pt-[21px] w-full h-[53px] absolute z-20 border-b border-gray-300 flex text-lg bg-white gap-[24px] px-2">
      {Object.values(headerItems).map((item) => (
        <TechnoTopHeaderItem key={item.title} item={item} />
      ))}
    </div>
  );
}
