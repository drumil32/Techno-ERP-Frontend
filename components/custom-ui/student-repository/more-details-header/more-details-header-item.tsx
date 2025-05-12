import { useRouter } from 'next/navigation';
import { useMoreDetailsHeaderContext } from './more-details-header-context';

interface HeaderItem {
  title: string;
  route: string;
}

interface MoreDetailsHeaderItemProps {
  item: HeaderItem;
}

export default function MoreDetailsHeaderItem({ item }: MoreDetailsHeaderItemProps) {
  const { headerActiveItem, setHeaderActiveItem } = useMoreDetailsHeaderContext();
  const router = useRouter();
  const isActive = item.title === headerActiveItem;

  const handleClick = () => {
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
