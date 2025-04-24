import * as DropdownMenuNew from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export const CustomStyledDropdown = ({
    value,
    onChange,
    data,
  }: {
    value: string;
    onChange: (newValue: string) => void;
    data: Record< string, { name: string; bgStyle: string; textStyle: string } >;
  }) => {

    let current = data[value];

    return (
      <DropdownMenuNew.Root>
        <DropdownMenuNew.Trigger asChild>
          <button
            className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-center rounded-md border border-gray-300 shadow-sm bg-white cursor-pointer ${current?.bgStyle} ${current?.textStyle}`}
          >
            {current?.name || value}
            <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
          </button>
        </DropdownMenuNew.Trigger>
  
        <DropdownMenuNew.Content
          className="mt-2 w-full border rounded-md border-gray-400 bg-white text-black text-bold shadow-lg "
          sideOffset={0}
        >
          {Object.entries(data).map(([key, val]) => (
            <DropdownMenuNew.Item
              key={key}
              onSelect={() => { onChange(key) }}
              className={`w-[200px] px-3 py-2 text-md cursor-pointer ${val.bgStyle} ${val.textStyle} hover:bg-gray-100 focus:outline-none`}
            >
              {val.name}
            </DropdownMenuNew.Item>
          ))}
        </DropdownMenuNew.Content>
      </DropdownMenuNew.Root>
    );
  };