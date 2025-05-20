import React, { useState, useEffect } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

export default function DateNavigator({
    viewMode,
    selectedDate,
    selectedMonth,
    onDateChange,
    onMonthChange,
    onViewModeChange
}: any) {
    const [dateRangeStart, setDateRangeStart] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3); // Start 3 days before today
    });

    const [monthRangeStart, setMonthRangeStart] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth() - 5, 1); // Start 5 months before current month
    });

    const formatDateForDisplay = (dateStr: string) => {
        const [day, month, year] = dateStr.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const monthName = date.toLocaleDateString('en-US', { month: 'long' });
        return {
            date: `${parseInt(day)}${getOrdinalSuffix(parseInt(day))} ${monthName} ${year.slice(-2)}`,
            day: dayName
        };
    };

    const getOrdinalSuffix = (day: any) => {
        if (day > 3 && day < 21) return 'th';
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const getMonthName = (monthNum: number) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNum - 1];
    };

    const generateDateRange = () => {
        const dates = [];

        for (let i = 0; i < 10; i++) {
            const newDate = new Date(dateRangeStart);
            newDate.setDate(dateRangeStart.getDate() + i);

            const dateStr = `${newDate.getDate().toString().padStart(2, '0')}/${(newDate.getMonth() + 1).toString().padStart(2, '0')}/${newDate.getFullYear()}`;
            const formatted = formatDateForDisplay(dateStr);

            dates.push({
                dateStr,
                display: formatted.date,
                day: formatted.day,
                isSelected: dateStr === selectedDate
            });
        }
        return dates;
    };

    const generateMonthRange = () => {
        const months = [];

        // Generate 12 months starting from monthRangeStart
        for (let i = 0; i < 8; i++) {
            const newDate = new Date(monthRangeStart);
            newDate.setMonth(monthRangeStart.getMonth() + i);

            months.push({
                month: newDate.getMonth() + 1,
                year: newDate.getFullYear(),
                display: `${getMonthName(newDate.getMonth() + 1)} ${newDate.getFullYear().toString().slice(-2)}`,
                isSelected: (newDate.getMonth() + 1) === selectedMonth && newDate.getFullYear() === new Date().getFullYear()
            });
        }
        return months;
    };

    const navigateDate = (direction: number) => {
        if (viewMode === 'day') {
            const newRangeStart = new Date(dateRangeStart);
            newRangeStart.setDate(dateRangeStart.getDate() + direction);
            setDateRangeStart(newRangeStart);
        } else {
            const newRangeStart = new Date(monthRangeStart);
            newRangeStart.setMonth(monthRangeStart.getMonth() + direction);
            setMonthRangeStart(newRangeStart);
        }
    };

    const handleTabChange = (value: string) => {
        onViewModeChange(value);
    };

    return (
        <div className="w-full flex flex-col gap-6 px-4 py-5 bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <Tabs defaultValue={viewMode || "day"} className="w-full" onValueChange={handleTabChange}>
                    <div className="flex items-baseline mb-4 gap-4">
                        <div className="text-lg font-semibold">Collections</div>
                        <TabsList className="grid w-[500px] grid-cols-2 mb-4">
                            <TabsTrigger value="day">Day-Wise Trend</TabsTrigger>
                            <TabsTrigger value="month">Month-Wise Trend</TabsTrigger>
                        </TabsList>

                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigateDate(-1)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <ChevronsLeft size={28} />
                        </button>


                        <TabsContent className="flex w-full justify-around items-center gap-4 overflow-x-auto py-2" value="day">
                            {generateDateRange().map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => onDateChange(item.dateStr)}
                                    className={`flex flex-col gap-1 min-w-32 p-2 rounded-[10px] cursor-pointer transition-all ${item.isSelected
                                        ? 'bg-[#F7F4FF] border-[1px] border-[#5B31D1] scale-110'
                                        : 'bg-[#FAFAFA] border-[1px] border-[#E2E2E2] hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`text-[16px] font-medium ${item.isSelected ? 'text-[#5B31D1]' : 'text-gray-900'
                                        }`}>
                                        {item.display}
                                    </div>
                                    <div className={`text-[16px] ${item.isSelected ? 'text-[#5B31D1]' : 'text-gray-500'
                                        }`}>
                                        {item.day}
                                    </div>
                                </div>
                            ))}
                        </TabsContent>

                        <span className='overflow-x-auto'>
                            <TabsContent className="flex justify-around items-center gap-4 overflow-x-auto py-2" value="month">
                                {generateMonthRange().map((item, index) => (
                                    <div
                                        key={index}
                                        onClick={() => onMonthChange(item)}
                                        className={`flex min-w-32 p-2 rounded-lg cursor-pointer transition-all ${item.isSelected
                                            ? 'bg-[#F7F4FF] border-[1px] border-[#5B31D1] scale-110'
                                            : 'bg-[#FAFAFA] border-[1px] border-[#E2E2E2] hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`text-[16px] font-medium ${item.isSelected ? 'text-[#5B31D1]' : 'text-gray-800'
                                            }`}>
                                            {item.display}
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>
                        </span>

                        <button
                            onClick={() => navigateDate(1)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <ChevronsRight size={28} />
                        </button>
                    </div>

                </Tabs>
            </div>
        </div>
    );
}