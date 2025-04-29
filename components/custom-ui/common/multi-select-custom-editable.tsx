import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Check, ChevronDown } from 'lucide-react';

interface MultiSelectCustomDropdownProps {
  form: any;
  name: string;
  label?: string;
  options: { _id: string; name: string }[];
  placeholder?: string;
  allowCustomInput?: boolean;
  onChange?: (value: string) => void;
  onAddOption?: (value: string) => void;
}

export const MultiSelectCustomDropdown = ({
  form,
  name,
  label,
  options,
  placeholder = 'Select option',
  allowCustomInput = false,
  onChange,
  onAddOption
}: MultiSelectCustomDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [customOptions, setCustomOptions] = useState<{ _id: string; name: string }[]>([]);
  const currentValue = typeof form.watch === 'function' ? form.watch(name) : form[name] || '';

  const allOptions = [...options, ...customOptions];

  const sortedOptions = [...allOptions].sort((a, b) => {
    if (a._id === currentValue) return -1;
    if (b._id === currentValue) return 1;
    return a.name.localeCompare(b.name);
  });

  const filteredOptions = sortedOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exactMatch = allOptions.find((opt) => opt.name.toLowerCase() === searchTerm.toLowerCase());

  const handleSelect = (value: string) => {
    onChange?.(value);
    setIsPopoverOpen(false);
    setSearchTerm('');
  };

  const handleAddFromSearch = () => {
    if (exactMatch) {
      handleSelect(exactMatch._id);
      return;
    }

    if (searchTerm.trim() && !exactMatch) {
      const newOption = { _id: searchTerm.trim(), name: searchTerm.trim() };
      setCustomOptions([...customOptions, newOption]);
      onAddOption?.(searchTerm.trim());
      handleSelect(searchTerm.trim());
    }
  };

  const showAddButton = allowCustomInput && searchTerm.trim() && !exactMatch;

  return (
    <div className="space-y-2 w-full">
      {label && <label className="font-normal text-[#666666] text-sm">{label}</label>}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-left rounded-sm bg-inherit w-full font-normal h-full justify-between"
          >
            <span>
              {currentValue
                ? allOptions.find((opt) => opt._id === currentValue)?.name || currentValue
                : placeholder}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
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
