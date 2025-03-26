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
      className={`px-4 py-2 rounded-md transition-all cursor-pointer ${
        isActive ? 'text-primary font-bold underline' : 'text-black'
      }`}
    >
      {item.title}
    </button>
  );
}
