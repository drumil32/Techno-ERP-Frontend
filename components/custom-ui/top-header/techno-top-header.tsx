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
  headerItems: Record<string, { title: string; route: string }>;
}

export default function TechnoTopHeader({ headerItems }: TechnoTopHeaderProps) {
  return (
    <div className="pt-[21px] w-full h-[53px] absolute z-10 border-b border-gray-300 flex text-lg bg-white gap-[24px] px-2">
      {Object.values(headerItems).map((item) => (
        <TechnoTopHeaderItem key={item.title} item={item} />
      ))}
    </div>
  );
}
