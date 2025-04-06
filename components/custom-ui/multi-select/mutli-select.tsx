'use client';

import * as React from 'react';
import { ChevronsUpDown, Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export function MultiSelectDropdown({
  options,
  selected,
  onChange,
  placeholder = 'Select options...',
  searchPlaceholder = 'Search...',
  className,
  triggerClassName,
  isLoading = false,
  disabled = false,
}: MultiSelectDropdownProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleClearSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onChange([]);
    setSearchTerm('');
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLabels = React.useMemo(() => {
    return options
      .filter((option) => selected.includes(option.value))
      .map((option) => option.label);
  }, [options, selected]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn(
            'w-full justify-between h-11 text-sm font-normal',
            triggerClassName
          )}
          disabled={disabled || isLoading}
        >
          <div className="flex gap-1 flex-wrap items-center">
            {selectedLabels.length > 0 ? (
              selectedLabels.length > 2 ? (
                <Badge variant="secondary" className="mr-1">
                  {selectedLabels.length} selected
                </Badge>
              ) : (
                selectedLabels.map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))
              )
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center">
            {selectedLabels.length > 0 && !disabled && (
              <Button
                variant="ghost"
                size="sm"
                className="mr-1 p-1 h-auto z-10"
                onClick={handleClearSelection}
                aria-label="Clear selection"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn('w-[--trigger-width] p-0', className)}>
        <div className="p-2 relative">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-full h-[32px] rounded-md bg-[#f3f3f3] text-gray-600 placeholder-gray-400 pr-8" 
            aria-label={searchPlaceholder}
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </span>
        </div>
        <div className="max-h-60 overflow-auto">
          {isLoading ? (
             <DropdownMenuItem disabled className="p-2 justify-center">Loading...</DropdownMenuItem>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={(e) => {
                  e.preventDefault();
                  handleSelect(option.value);
                }}
                className="cursor-pointer hover:bg-gray-100"
              >
                <Checkbox
                  checked={selected.includes(option.value)}
                  // className="mr-2 text-white"
                  aria-label={`Select ${option.label}`}
                />
                <span>{option.label}</span>
              </DropdownMenuItem>
            ))
          ) : (
             <DropdownMenuItem disabled className="p-2 text-center text-muted-foreground">No results found.</DropdownMenuItem>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}