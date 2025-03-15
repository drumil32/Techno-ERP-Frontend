import TechnoIcon from '../icon/TechnoIcon';
import { useHoverContext } from './hover-context';
import { useSidebarContext } from './sidebar-context';

// TODO: Update the props type
export default function TechnoSidebarItem({ icon: Icon, text }: { icon: any; text: string }) {
  const hovered = useHoverContext();
  const { sidebarActiveItem, setSidebarActiveItem } = useSidebarContext();
  const isActive = sidebarActiveItem == text;
  return (
    <div
      className={`flex items-center transition-all duration-300 py-3 px-4 ease-in-out cursor-pointer ${
        hovered
          ? `justify-start gap-4 rounded-lg w-full ${isActive && `bg-white text-primary rounded-lg`}`
          : isActive
            ? 'justify-start rounded-l-lg w-[145%] bg-white text-primary'
            : 'justify-center w-full'
      }`}
      onClick={() => setSidebarActiveItem(text)}
    >
      <TechnoIcon className="transition-transform duration-100 ease-in-out">
        <Icon size={24} strokeWidth={1.5} />
      </TechnoIcon>
      {hovered && (
        <div className="flex items-center gap-4   ml-2">
          <p className="text-md ">{text}</p>
        </div>
      )}
    </div>
  );
}
