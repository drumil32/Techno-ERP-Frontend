import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useHoverContext } from './hover-context';
import TechnoSidebarItem from './techno-sidebar-item';
import { LogOut } from 'lucide-react';

export default function TechnoSidebarFooter() {
  const hovered = useHoverContext();
  return (
    <>
      {!hovered && (
        <Avatar className="w-12 h-12 transition-transform duration-300 ease-in-out">
          {/* TODO: Avatar will replace by the College Logo */}
          <AvatarImage
            className="rounded-full"
            src="https://github.com/shadcn.png"
            alt="User Avatar"
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
      <TechnoSidebarItem icon={LogOut} text="Logout" />
    </>
  );
}
