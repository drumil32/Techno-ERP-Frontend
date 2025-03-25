import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useHoverContext } from './hover-context';
import TechnoSidebarItem from './techno-sidebar-item';
import { LogOut } from 'lucide-react';

export default function TechnoSidebarFooter() {
  const hovered = useHoverContext();
  return (
    <>
      {!hovered && (
        <Avatar className="w-[33px] h-[32px] transition-transform duration-300 ease-in-out">
          {/* TODO: Avatar will replace by the College Logo */}
          <AvatarImage
            className=""
            src="/images/techno-logo.png"
            alt="User Avatar"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      )}
      <TechnoSidebarItem icon={LogOut} text="Logout" />
    </>
  );
}
