import { useEffect, useState } from 'react';
import TechnoTopHeaderItem from './techno-top-header-item';
import { fetchProfileData } from './utils/fetch-data';
import { toast } from 'sonner';
interface HeaderItem {
  title: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface TechnoTopHeaderProps {
  headerItems: HeaderItem[];
}

export default function TechnoTopHeader({ headerItems }: TechnoTopHeaderProps) {
  return (
    <div className="pt-[21px] w-screen h-[53px] z-10 border-b border-gray-300 flex text-lg bg-white gap-[24px]">
      <div className='absolute w-screen h-[53px] border-b bg-white'></div>
      {headerItems.map((item, i) => (
        <TechnoTopHeaderItem key={i} item={item} />
      ))}
    </div>
  );
}
