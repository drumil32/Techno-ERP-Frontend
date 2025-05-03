'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import TechnoIcon from '../icon/TechnoIcon';
import { useHoverContext } from './hover-context';
import { Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TechnoSidebarHeader() {
  const hovered = useHoverContext();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const shouldShowExpanded = isLargeScreen ? hovered : false;

  return (
    <div
      className={`flex items-center w-full transition-all duration-100 ease-in-out ${
        shouldShowExpanded ? 'justify-start pl-4 gap-4' : 'justify-center'
      }`}
    >
      {shouldShowExpanded && (
        <div className="flex w-full items-center gap-4 transition-opacity duration-100 ease-in-out opacity-100">
          <Avatar className=" transition-transform duration-100 ease-in-out">
            <AvatarImage
              className="rounded-full object-contain p-1 bg-white w-[40px] h-[40px]"
              src="/images/techno-logo.webp"
              alt="User Avatar"
            />
          </Avatar>
          <p className="text-xl font-bold transition-all duration-100 ease-in-out">TECHNO</p>
        </div>
      )}

      <TechnoIcon
        type={shouldShowExpanded ? 'button' : undefined}
        className={`transition-transform duration-300 ease-in-out ${shouldShowExpanded ? 'ml-auto' : ''}`}
      >
        <Menu size={32} />
      </TechnoIcon>
    </div>
  );
}
