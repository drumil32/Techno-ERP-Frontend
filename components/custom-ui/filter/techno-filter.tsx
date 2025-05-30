'use client';

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
import TechnoLeadTypeTag from '../lead-type-tag/techno-lead-type-tag';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import FinalConversionTag from '@/components/layout/yellowLeads/final-conversion-tag';
import { Course, CourseNameMapper, FinalConversionStatus } from '@/types/enum';
import { toPascal } from '@/lib/utils';
import { LeadType } from '@/types/enum';

export interface FilterOption {
  id: string | number;
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
  applyFilters: () => void;
}

export const formatDateForAPI = (date: Date | undefined): string | undefined => {
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
  applyFilters,
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

    applyFilters();
  }, [filters, filterKey]);

  const filteredOptions = options.filter((option) => {
    let label = '';

    if (option === null || option === undefined) {
      return false;
    }

    if (typeof option === 'string') {
      label = option;
    } else if (option.label && typeof option.label === 'string') {
      label = option.label;
    }

    if (typeof searchTerm !== 'string' || typeof label !== 'string') {
      return false;
    }

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
      if (filters[filterKey] === value) {
        updateFilter(filterKey, undefined);
      } else {
        updateFilter(filterKey, value);
      }
    }
  };

  const handleDateChange = (type: 'start' | 'end', selectedDate: Date | undefined) => {
    if (isThisMonth) {
      setIsThisMonth(false);
      updateFilter(filterKey, undefined);
    }

    const datePrefix = filterKey === 'leadTypeModifiedDate' ? 'LTC' : '';
    const startDateKey = `start${datePrefix}Date`;
    const endDateKey = `end${datePrefix}Date`;

    updateFilter(
      startDateKey,
      type === 'start' ? formatDateForAPI(selectedDate) : filters[startDateKey]
    );
    updateFilter(endDateKey, type === 'end' ? formatDateForAPI(selectedDate) : filters[endDateKey]);

    if (type === 'start') {
      setStartDate(selectedDate);
      setStartCalendarOpen(false);
    } else {
      setEndDate(selectedDate);
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

      const datePrefix = filterKey === 'leadTypeModifiedDate' ? 'LTC' : '';
      updateFilter(`start${datePrefix}Date`, formatDateForAPI(firstDay));
      updateFilter(`end${datePrefix}Date`, formatDateForAPI(lastDay));
      updateFilter(filterKey, 'This Month');
    } else {
      const datePrefix = filterKey === 'leadTypeModifiedDate' ? 'LTC' : '';
      updateFilter(`start${datePrefix}Date`, undefined);
      updateFilter(`end${datePrefix}Date`, undefined);
      updateFilter(filterKey, undefined);
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  useEffect(() => {
    const datePrefix = filterKey === 'leadTypeModifiedDate' ? 'LTC' : '';
    const startDateKey = `start${datePrefix}Date`;
    const endDateKey = `end${datePrefix}Date`;

    setIsThisMonth(filters[filterKey] === 'This Month');
    setStartDate(parseDateFromAPI(filters[startDateKey]));
    setEndDate(parseDateFromAPI(filters[endDateKey]));

    if (!filters[startDateKey] && !filters[endDateKey] && filters[filterKey] !== 'This Month') {
      setStartDate(undefined);
      setEndDate(undefined);
      setIsThisMonth(false);
    }
  }, [filters, filterKey]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer" variant="outline">
          {filterLabel}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto min-w-[200px] max-w-[400px]">
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
                      captionLayout={'dropdown-buttons'}
                      fromYear={new Date().getFullYear() - 100}
                      toYear={new Date().getFullYear() + 10}
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
                      captionLayout={'dropdown-buttons'}
                      fromYear={new Date().getFullYear() - 100}
                      toYear={new Date().getFullYear() + 10}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        ) : (
          <>
            {hasSearch && (
              <div className="p-2 w-max relative">
                <Input
                  placeholder={`Search for ${filterPlaceholder}`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-full w-max h-[32px] rounded-md bg-[#f3f3f3]  text-gray-600 placeholder-gray-400"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-5">
                  <Search className="h-4 w-4 text-gray-500" />
                </span>
              </div>
            )}
            <div className="max-h-[540px] overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap"
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
                          ? (option as LeadType)
                          : (option.label as LeadType)
                      }
                    />
                  ) : filterKey === 'finalConversionType' ? (
                    <FinalConversionTag
                      status={
                        typeof option === 'string'
                          ? (option as FinalConversionStatus)
                          : (option.label as FinalConversionStatus)
                      }
                    />
                  ) : filterKey === 'source' ? (
                    <span>{typeof option === 'string' ? option : option.label}</span>
                  ) : (
                    <span>{typeof option === 'string' ? option : option.label}</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
