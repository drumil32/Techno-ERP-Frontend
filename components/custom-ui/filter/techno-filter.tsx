import { useState, useEffect } from 'react';
import { useTechnoFilterContext } from './filter-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar1, ChevronDown, Search } from 'lucide-react';
import { format, parse } from 'date-fns';
import TechnoLeadTypeTag, { TechnoLeadType } from '../lead-type-tag/techno-lead-type-tag';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface FilterOption {
    id: string;
    label: string;
}

interface TechnoFilterProps {
  filterKey: string;
  filterLabel: string;
  filterPlaceholder: string;
  options?: (string | FilterOption)[];
  hasSearch?: boolean;
  multiSelect?: boolean;
  isDateFilter?: boolean;
}

const formatDateForAPI = (date: Date | undefined): string | undefined => {
  if (!date) return undefined;
  return format(date, 'dd/MM/yyyy');
};

const parseDateFromAPI = (dateString: string | undefined): Date | undefined => {
  if (!dateString) return undefined;
  try {
    return parse(dateString, 'dd/MM/yyyy', new Date());
  } catch (error) {
    console.error('Error parsing date:', error);
    return undefined;
  }
};

export default function TechnoFilter({
  filterKey,
  filterLabel,
  filterPlaceholder,
  options = [],
  hasSearch = false,
  multiSelect = false,
  isDateFilter = false
}: TechnoFilterProps) {
  const { filters, updateFilter } = useTechnoFilterContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(parseDateFromAPI(filters.startDate));
  const [endDate, setEndDate] = useState<Date | undefined>(parseDateFromAPI(filters.endDate));
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);
  const [isThisMonth, setIsThisMonth] = useState(filters[filterKey] === 'This Month');

  useEffect(() => {
    setIsThisMonth(filters[filterKey] === 'This Month');

    if (filters.startDate) {
      setStartDate(parseDateFromAPI(filters.startDate));
    }

    if (filters.endDate) {
      setEndDate(parseDateFromAPI(filters.endDate));
    }
  }, [filters, filterKey]);

  const filteredOptions = options.filter((option) => {
    const label = typeof option === 'string' ? option : option.label;
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSelect = (option: string | FilterOption) => {
    const value = typeof option === 'string' ? option : option.id;
    const displayLabel = typeof option === 'string' ? option : option.label;

    if (multiSelect) {
      const current = filters[filterKey] || [];
      const newFilters = current.includes(value)
        ? current.filter((item: string) => item !== value)
        : [...current, value];
      updateFilter(filterKey, newFilters);
    } else {
      updateFilter(filterKey, value);
    }
  };

  const handleDateChange = (type: 'start' | 'end', selectedDate: Date | undefined) => {
    if (isThisMonth) {
      setIsThisMonth(false);
      updateFilter('date', undefined);
    }

    const handleDateChange = (type: 'start' | 'end', selectedDate: Date | undefined) => {
        if (isThisMonth) {
            setIsThisMonth(false);
            updateFilter('date', undefined);
        }

        if (type === 'start') {
            setStartDate(selectedDate);
            updateFilter('startDate', formatDateForAPI(selectedDate));
            setStartCalendarOpen(false);
        } else {
            setEndDate(selectedDate);
            updateFilter('endDate', formatDateForAPI(selectedDate));
            setEndCalendarOpen(false);
        }
    };


  const handleThisMonth = () => {
    const newIsThisMonth = !isThisMonth;
    setIsThisMonth(newIsThisMonth);

    if (newIsThisMonth) {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      setStartDate(firstDay);
      setEndDate(lastDay);

      updateFilter(filterKey, 'This Month');
      updateFilter('startDate', formatDateForAPI(firstDay));
      updateFilter('endDate', formatDateForAPI(lastDay));
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
      updateFilter(filterKey, undefined);
      updateFilter('startDate', undefined);
      updateFilter('endDate', undefined);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {filterLabel}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {isDateFilter ? (
          <div className="p-2 space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleThisMonth}>
              <Checkbox checked={isThisMonth} />
              <span>This Month</span>
            </div>
            <div
              className={`flex flex-col gap-4 ${isThisMonth ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Calendar1 className="h-4 w-4" />
                  <span>Start Date:</span>
                </div>
                <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {startDate ? formatDateForAPI(startDate) : 'Select start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => handleDateChange('start', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Calendar1 className="h-4 w-4" />
                  <span>End Date:</span>
                </div>
                <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {endDate ? formatDateForAPI(endDate) : 'Select end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => handleDateChange('end', date)}
                      initialFocus
                      disabled={(date) => (startDate ? date < startDate : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        ) : (
          <>
            {hasSearch && (
              <div className="p-2 relative">
                <Input
                  placeholder={`Search for ${filterPlaceholder}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-full h-[32px] rounded-md bg-[#f3f3f3]  text-gray-600 placeholder-gray-400"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-5">
                  <Search className="h-4 w-4 text-gray-500" />
                </span>
              </div>
            )}
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                <Checkbox
                  checked={
                    multiSelect
                      ? filters[filterKey]?.includes(
                          typeof option === 'string' ? option : option.id
                        )
                      : filters[filterKey] === (typeof option === 'string' ? option : option.id)
                  }
                />
                {filterKey === 'leadType' ? (
                  <TechnoLeadTypeTag
                    type={
                      typeof option === 'string'
                        ? (option as TechnoLeadType)
                        : (option.label as TechnoLeadType)
                    }
                  />
                ) : (
                  <span>{typeof option === 'string' ? option : option.label}</span>
                )}
              </div>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
