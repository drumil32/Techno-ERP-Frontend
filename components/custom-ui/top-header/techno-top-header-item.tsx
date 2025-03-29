import { useTopHeaderContext } from './top-header-context';
import { useRouter } from 'next/navigation';

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
    setHeaderActiveItem(item.title);
    router.push(item.route); 
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-md transition-all cursor-pointer ${
        isActive ? 'text-primary font-bold underline' : 'text-black'
      }`}
    >
      {item.title}
    </button>
  );
}
