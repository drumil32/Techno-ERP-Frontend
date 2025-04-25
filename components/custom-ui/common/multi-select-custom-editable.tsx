import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

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
  placeholder = "Select options",
  allowCustomInput = false,
  onChange,
}: MultiSelectCustomDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const currentValue = form[name] || '';

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleValueChange = (newValue: string) => {
    onChange?.(newValue);
    setIsPopoverOpen(false);
  };

  const handleAddCustomValue = () => {
    if (customValue.trim()) {
      handleValueChange(customValue.trim());
      setCustomValue("");
    }
  };

  return (
    <div className="space-y-2 w-full">
      {label && <label className="font-normal text-[#666666] text-sm">{label}</label>}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="text-left rounded-sm bg-inherit w-full max-w-full truncate font-normal h-full"
          >
            <span className="block overflow-hidden text-ellipsis whitespace-nowrap w-full">
              {currentValue 
                ? options.find(opt => opt._id === currentValue)?.name || currentValue
                : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[250px] rounded-sm" 
          align="start"
          onInteractOutside={(e) => {
            if (customValue.trim()) {
              handleAddCustomValue();
            }
          }}
        >
          <div className="space-y-2">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
            <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
              {filteredOptions.map((option) => (
                <div
                  key={option._id}
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => handleValueChange(option._id)}
                >
                  <Checkbox
                    id={option._id}
                    checked={currentValue === option._id}
                    className="rounded-sm"
                  />
                  <label htmlFor={option._id} className="text-[12px] cursor-pointer">
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
            {allowCustomInput && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom value"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className="h-8"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomValue()}
                />
                <Button
                  size="sm"
                  onClick={handleAddCustomValue}
                  disabled={!customValue.trim()}
                >
                  Add
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};