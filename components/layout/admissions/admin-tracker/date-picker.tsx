import React, { useState, useEffect } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getOrdinal } from '@/lib/numbers';

interface DateMonthYearNavigatorProps {
  date?: boolean;
  month?: boolean;
  year?: boolean;
  selectedDate: string;
  onDateChange: (date: string) => void;
  label?: string;
  disableBefore?: string; //  dd/mm/yyyy
  changeToYearsTab?: () => void;
  changeToMonthTab?: () => void;
  changeToDateTab?: () => void;
}

export default function DateMonthYearNavigator({
  date = true,
  month = false,
  year = false,
  selectedDate,
  onDateChange,
  disableBefore,
  changeToDateTab,
  changeToMonthTab,
  changeToYearsTab
}: DateMonthYearNavigatorProps) {
  const getActiveMode = () => {
    if (date) return 'date';
    if (month) return 'month';
    if (year) return 'year';
    return 'date';
  };

  const [activeMode, setActiveMode] = useState(getActiveMode());

  // Updated: 4 previous dates + current date (start from 4 days ago)
  const [dateRangeStart, setDateRangeStart] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4);
  });

  // Updated: 3 previous months + current month (start from 3 months ago)
  const [monthRangeStart, setMonthRangeStart] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() - 3, 1);
  });

  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear() - 3, 0, 1);
  });

  const getDisableBeforeDate = () => {
    if (!disableBefore) return null;
    const [day, month, year] = disableBefore.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const disableBeforeDate = getDisableBeforeDate();

  const formatDateForDisplay = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const monthName = date.toLocaleDateString('en-US', { month: 'long' });
    return {
      date: `${getOrdinal(parseInt(day))} ${monthName}'${year.slice(-2)}`,
      day: dayName
    };
  };

  const getMonthName = (monthNum: number) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return months[monthNum - 1];
  };

  const isDateDisabled = (checkDate: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (checkDate > today) return true;

    if (disableBeforeDate && checkDate < disableBeforeDate) return true;

    return false;
  };

  const generateDateRange = () => {
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const newDate = new Date(dateRangeStart);
      newDate.setDate(dateRangeStart.getDate() + i);

      const dateStr = `${newDate.getDate().toString().padStart(2, '0')}/${(newDate.getMonth() + 1).toString().padStart(2, '0')}/${newDate.getFullYear()}`;
      const formatted = formatDateForDisplay(dateStr);
      const disabled = isDateDisabled(newDate);

      dates.push({
        dateStr,
        display: formatted.date,
        day: formatted.day,
        isSelected: dateStr === selectedDate,
        disabled
      });
    }
    return dates;
  };

  const generateMonthRange = () => {
    const months = [];
    // Parse selected date to get month and year for comparison
    const [selectedDay, selectedMonth, selectedYear] = selectedDate
      .split('/')
      .map((num) => parseInt(num));

    for (let i = 0; i < 4; i++) {
      const newDate = new Date(monthRangeStart);
      newDate.setMonth(monthRangeStart.getMonth() + i);

      const firstDayOfMonth = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
      const monthDateStr = `01/${(newDate.getMonth() + 1).toString().padStart(2, '0')}/${newDate.getFullYear()}`;
      const disabled = isDateDisabled(firstDayOfMonth);

      // Check if this month matches the selected date's month and year
      const isSelected =
        newDate.getMonth() + 1 === selectedMonth && newDate.getFullYear() === selectedYear;

      months.push({
        dateStr: monthDateStr,
        display: `${getMonthName(newDate.getMonth() + 1)}'${newDate.getFullYear().toString().slice(-2)}`,
        isSelected,
        disabled
      });
    }
    return months;
  };

  const generateYearRange = () => {
    const years = [];
    for (let i = 0; i < 8; i++) {
      const newDate = new Date(yearRangeStart);
      newDate.setFullYear(yearRangeStart.getFullYear() + i);

      // Create first day of the year for comparison
      const firstDayOfYear = new Date(newDate.getFullYear(), 0, 1);
      const yearDateStr = `01/01/${newDate.getFullYear()}`;
      const disabled = isDateDisabled(firstDayOfYear);

      years.push({
        dateStr: yearDateStr,
        display: newDate.getFullYear().toString(),
        isSelected: yearDateStr === selectedDate,
        disabled
      });
    }
    return years;
  };

  const navigateRange = (direction: number) => {
    if (activeMode === 'date') {
      const newRangeStart = new Date(dateRangeStart);
      newRangeStart.setDate(dateRangeStart.getDate() + direction);
      setDateRangeStart(newRangeStart);
    } else if (activeMode === 'month') {
      const newRangeStart = new Date(monthRangeStart);
      newRangeStart.setMonth(monthRangeStart.getMonth() + direction);
      setMonthRangeStart(newRangeStart);
    } else if (activeMode === 'year') {
      const newRangeStart = new Date(yearRangeStart);
      newRangeStart.setFullYear(yearRangeStart.getFullYear() + direction);
      setYearRangeStart(newRangeStart);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveMode(value);
  };

  const handleItemClick = (dateStr: string, disabled: boolean) => {
    if (!disabled) {
      onDateChange(dateStr);
    }
  };

  // tabs based on props
  const getAvailableTabs = () => {
    const tabs = [];
    if (date) tabs.push({ value: 'date', label: 'Day', changeCallback: changeToDateTab });
    if (month) tabs.push({ value: 'month', label: 'Month', changeCallback: changeToMonthTab });
    if (year) tabs.push({ value: 'year', label: 'Year', changeCallback: changeToYearsTab });
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  // Don't show tabs if there is only one way
  const showTabs = availableTabs.length > 1;

  const daySelector = () => {
    return (
      <>
        {generateDateRange().map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(item.dateStr, item.disabled)}
            className={`flex flex-col gap-1 min-w-24 p-2 rounded-[10px] transition-all ${
              item.disabled
                ? 'bg-gray-100 border-[1px] border-gray-200 cursor-not-allowed opacity-50'
                : item.isSelected
                  ? 'bg-[#F7F4FF] border-[1px] border-[#5B31D1] scale-110 cursor-pointer'
                  : 'bg-[#FAFAFA] border-[1px] border-[#E2E2E2] hover:bg-gray-50 cursor-pointer'
            }`}
          >
            <div
              className={`text-sm font-medium ${
                item.disabled
                  ? 'text-gray-400'
                  : item.isSelected
                    ? 'text-[#5B31D1]'
                    : 'text-gray-900'
              }`}
            >
              {item.display}
            </div>
            <div
              className={`text-sm ${
                item.disabled
                  ? 'text-gray-400'
                  : item.isSelected
                    ? 'text-[#5B31D1]'
                    : 'text-gray-500'
              }`}
            >
              {item.day}
            </div>
          </div>
        ))}
      </>
    );
  };

  const monthSelector = () => {
    return (
      <>
        {generateMonthRange().map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(item.dateStr, item.disabled)}
            className={`flex min-w-32 p-2 rounded-lg transition-all text-center ${
              item.disabled
                ? 'bg-gray-100 border-[1px] border-gray-200 cursor-not-allowed opacity-50'
                : item.isSelected
                  ? 'bg-[#F7F4FF] border-[1px] border-[#5B31D1] scale-110 cursor-pointer'
                  : 'bg-[#FAFAFA] border-[1px] border-[#E2E2E2] hover:bg-gray-50 cursor-pointer'
            }`}
          >
            <div
              className={`text-sm font-medium w-full text-center ${
                item.disabled
                  ? 'text-gray-400'
                  : item.isSelected
                    ? 'text-[#5B31D1]'
                    : 'text-gray-800'
              }`}
            >
              {item.display}
            </div>
          </div>
        ))}
      </>
    );
  };

  const yearSelector = () => {
    return (
      <>
        {generateYearRange().map((item, index) => (
          <div
            key={index}
            onClick={() => handleItemClick(item.dateStr, item.disabled)}
            className={`flex min-w-32 p-2 rounded-lg transition-all ${
              item.disabled
                ? 'bg-gray-100 border-[1px] border-gray-200 cursor-not-allowed opacity-50'
                : item.isSelected
                  ? 'bg-[#F7F4FF] border-[1px] border-[#5B31D1] scale-110 cursor-pointer'
                  : 'bg-[#FAFAFA] border-[1px] border-[#E2E2E2] hover:bg-gray-50 cursor-pointer'
            }`}
          >
            <div
              className={`text-[16px] font-medium ${
                item.disabled
                  ? 'text-gray-400'
                  : item.isSelected
                    ? 'text-[#5B31D1]'
                    : 'text-gray-800'
              }`}
            >
              {item.display}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="w-full">
        {showTabs ? (
          <Tabs defaultValue={activeMode} className="w-full" onValueChange={handleTabChange}>
            <div className="flex items-baseline gap-4">
              <TabsList
                className={`grid grid-cols-${availableTabs.length} mb-4`}
                style={{ width: `${availableTabs.length * 120}px` }}
              >
                {availableTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} onClick={tab.changeCallback}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="flex items-center gap-2 h-24">
              <button
                onClick={() => navigateRange(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ChevronsLeft size={28} />
              </button>

              {date && (
                <TabsContent
                  className="flex w-full justify-around items-center gap-4 overflow-x-auto py-2"
                  value="date"
                >
                  {daySelector()}
                </TabsContent>
              )}

              {month && (
                <TabsContent
                  className="flex w-full justify-around items-center gap-4 overflow-x-auto py-2"
                  value="month"
                >
                  {monthSelector()}
                </TabsContent>
              )}

              {year && (
                <TabsContent
                  className="flex w-full justify-around items-center gap-4 overflow-x-auto py-2"
                  value="year"
                >
                  {yearSelector()}
                </TabsContent>
              )}

              <button
                onClick={() => navigateRange(1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ChevronsRight size={28} />
              </button>
            </div>
          </Tabs>
        ) : (
          <div className="w-full">
            <div className="flex items-center gap-2 h-24">
              <button
                onClick={() => navigateRange(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ChevronsLeft size={28} />
              </button>

              <div className="flex w-full justify-around items-center gap-4 overflow-x-auto py-2">
                {activeMode === 'date' && daySelector()}

                {activeMode === 'month' && monthSelector()}

                {activeMode === 'year' && yearSelector()}
              </div>

              <button
                onClick={() => navigateRange(1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ChevronsRight size={28} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
