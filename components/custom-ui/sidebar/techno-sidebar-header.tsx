import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import TechnoIcon from '../icon/TechnoIcon';
import { useHoverContext } from './hover-context';
import { Menu } from 'lucide-react';

export default function TechnoSidebarHeader() {
  const hovered = useHoverContext();
  return (
    <div
      className={`flex items-center w-full transition-all duration-100 ease-in-out ${hovered ? 'justify-start pl-4 gap-4' : 'justify-center'}`}
    >
      {hovered && (
        <div className="flex items-center gap-4 transition-opacity duration-100 ease-in-out opacity-100">
          {/* TODO: Name and Avatar will replace by the college logo and name */}
          <Avatar className="w-[30px] h-[30px] transition-transform duration-100 ease-in-out">
            <AvatarImage className="rounded-full" src="/images/techno-logo.png" alt="User Avatar" />
            {/* <AvatarFallback>U</AvatarFallback> */}
          </Avatar>
          <p className="text-xl font-bold transition-all duration-100 ease-in-out">TECHNO</p>
        </div>
      )}

      <TechnoIcon
        type={hovered ? 'button' : undefined}
        className={`transition-transform duration-300 ease-in-out ${hovered ? 'ml-auto' : ''}`}
      >
        <Menu size={32} />
      </TechnoIcon>
    </div>
  );
}
