import { useTopHeaderContext } from './top-header-context';

interface HeaderItem {
  title: string;
}

interface TechnoTopHeaderItemProps {
  item: HeaderItem;
}

export default function TechnoTopHeaderItem({ item }: TechnoTopHeaderItemProps) {
  const { headerActiveItem, setHeaderActiveItem } = useTopHeaderContext();
  const isActive = item.title === headerActiveItem;

  return (
    <button
      onClick={() => setHeaderActiveItem(item.title)}
      className={`px-2 pb-4 rounded-[3px] transition-all cursor-pointer ${
        isActive ? 'text-primary font-bold border-b-4 border-b-[#5B31D1]' : 'text-black'
      }`}
    >
      {item.title}
    </button>
  );
}
