import * as DropdownMenuNew from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';

export const CustomStyledDropdown = ({
  value,
  onChange,
  data,
}: {
  value: string;
  onChange: (newValue: string) => void;
  data: Record<string, { name: string; bgStyle: string; textStyle: string }>;
}) => {
  const current = data[value];

  return (
    <DropdownMenuNew.Root>
      <DropdownMenuNew.Trigger asChild>
        <button
          className={`
            flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md 
            border border-gray-300 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300
            ${current?.bgStyle || 'bg-white'} ${current?.textStyle || 'text-black'}
          `}
        >
          <span className="truncate">{current?.name || value}</span>
          <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
        </button>
      </DropdownMenuNew.Trigger>

      <DropdownMenuNew.Content
        sideOffset={4}
        className="w-[240px] mt-2 rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none max-h-[250px] overflow-auto"
      >
        {Object.entries(data).map(([key, val]) => (
          <DropdownMenuNew.Item
            key={key}
            onSelect={() => onChange(key)}
            className={`
              px-4 py-2 text-sm font-medium cursor-pointer transition truncate
              ${val.bgStyle} ${val.textStyle}
              hover:bg-gray-200 hover:text-black hover:font-bold focus:outline-none
              ${key === value ? 'ring-1 ring-inset ring-gray-400 rounded-md' : ''}
            `}
          >
            {val.name}
          </DropdownMenuNew.Item>
        ))}
      </DropdownMenuNew.Content>
    </DropdownMenuNew.Root>
  );
};
