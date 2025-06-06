'use client';

import { useTopHeaderContext } from './top-header-context';
import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';

interface HeaderItem {
  title: string;
  route: string;
}

interface TechnoTopHeaderItemProps {
  item: HeaderItem;
}

export default function TechnoTopHeaderItem({ item }: TechnoTopHeaderItemProps) {
  const { headerActiveItem, setHeaderActiveItem } = useTopHeaderContext();
  const router = useRouter();
  const isActive = item.title === headerActiveItem;

  const handleClick = () => {
    NProgress.start();

    setHeaderActiveItem(item.title);

    router.push(item.route);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-2 pb-4 rounded-[3px] transition-all cursor-pointer ${
        isActive ? 'text-primary font-bold border-b-4 border-b-[#5B31D1]' : 'text-black'
      }`}
    >
      {item.title}
    </button>
  );
}
