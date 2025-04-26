import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

interface MultiSelectCustomDropdownProps {
  form: any;
  name: string;
  label?: string;
  options: { _id: string; name: string }[];
  placeholder?: string;
  allowCustomInput?: boolean;
  onChange?: (value: string) => void;
}

export const MultiSelectCustomDropdown = ({
  form,
  name,
  label,
  options,
  placeholder = 'Select option',
  allowCustomInput = false,
  onChange
}: MultiSelectCustomDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const currentValue = form[name] || '';

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value: string) => {
    onChange?.(value);
    setIsPopoverOpen(false);
    setSearchTerm('');
  };

  const handleAddFromSearch = () => {
    if (
      searchTerm.trim() &&
      !options.some((opt) => opt.name.toLowerCase() === searchTerm.toLowerCase())
    ) {
      handleSelect(searchTerm.trim());
    }
  };

  const showAddButton =
    allowCustomInput &&
    searchTerm.trim() &&
    !options.some((opt) => opt.name.toLowerCase() === searchTerm.toLowerCase());

  return (
    <div className="space-y-2 w-full">
      {label && <label className="font-normal text-[#666666] text-sm">{label}</label>}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-left rounded-sm bg-inherit w-full font-normal h-full justify-start"
          >
            {currentValue
              ? options.find((opt) => opt._id === currentValue)?.name || currentValue
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] rounded-sm p-2" align="start">
          <div className="space-y-2">
            <div className="relative">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pr-10"
                onKeyDown={(e) => e.key === 'Enter' && handleAddFromSearch()}
              />
              {showAddButton && (
                <Button
                  size="sm"
                  className="absolute right-1 top-1 h-6 px-2 text-xs"
                  onClick={handleAddFromSearch}
                >
                  Add
                </Button>
              )}
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.map((option) => (
                <div
                  key={option._id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleSelect(option._id)}
                >
                  <span className="text-sm">{option.name}</span>
                  {currentValue === option._id && <Check className="h-4 w-4 text-primary" />}
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
