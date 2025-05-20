import { useEffect, useState } from "react";
import DateNavigator from "./collections-selection";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { DailyCollectionData, MonthlyCollectionData } from "@/types/finance";
import { fetchDailyCollections, fetchMonthlyCollections } from "./helpers/fetch-data";
import CollectionSummary from "./collections-summary";
import CourseWiseCollections from "./collections-course-wise";
import Chart7DaySummary from "./day-wise-graph";

export enum ViewMode {
    DAY = 'day',
    MONTH = 'month'
}

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Collections() {
    const [viewMode, setViewMode] = useState(ViewMode.DAY);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    });
    const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

    useEffect(() => {
        console.log(selectedMonth)
        console.log(selectedYear)
    }, [selectedMonth, selectedYear])

    const makeApiCall = async () => {
        console.log('Making API call with:', {
            viewMode,
            selectedDate: viewMode === ViewMode.DAY ? selectedDate : null,
            selectedMonth: viewMode === ViewMode.MONTH ? selectedMonth : null
        });
    };

    useEffect(() => {
        makeApiCall();
    }, [viewMode, selectedDate, selectedMonth]);

    const handleDateChange = (newDate: any) => {
        setSelectedDate(newDate);
    };

    const handleMonthChange = (selected: any) => {
        setSelectedMonth(selected.month);
        setSelectedYear(selectedYear)
    };

    const handleViewModeChange = (newMode: any) => {
        setViewMode(newMode);
    };

    const collectionsQuery = useQuery<DailyCollectionData | MonthlyCollectionData, Error>({
        queryKey: ['collections', (viewMode === ViewMode.DAY ? { date: selectedDate } : { monthNumber: selectedMonth, year: selectedYear })],
        queryFn: viewMode === ViewMode.DAY ?
            (context) => fetchDailyCollections(context as QueryFunctionContext<readonly [string, any]>) :
            (context) => fetchMonthlyCollections(context as QueryFunctionContext<readonly [string, any]>),
        placeholderData: (previousData) => previousData,
    })

    const collectionData = collectionsQuery.data
    const isLoading = collectionsQuery.isLoading


    return (
        <>
            <DateNavigator
                viewMode={viewMode}
                selectedDate={selectedDate}
                selectedMonth={selectedMonth}
                onDateChange={handleDateChange}
                onMonthChange={handleMonthChange}
                onViewModeChange={handleViewModeChange}
            />

            {
                collectionData &&
                <div className="w-full flex gap-6">
                    <div className="flex flex-col w-1/3 gap-6">
                        <CollectionSummary
                            label={viewMode === ViewMode.DAY ? selectedDate : `${months[selectedMonth - 1]} ${selectedYear}`}
                            totalCollections={collectionData?.totalCollection || 0}
                            viewMode={viewMode}
                        />
                        <Chart7DaySummary/>

                    </div>
                    <div className="w-2/3">
                        <CourseWiseCollections
                            courseWiseCollection={collectionData?.courseWiseInformation || []}
                        />
                    </div>
                </div>
            }



            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Current Selection:</h3>
                <div className="text-sm text-gray-800">
                    <div>View Mode: {viewMode}</div>
                    {viewMode === ViewMode.DAY && <div>Selected Date: {selectedDate}</div>}
                    {viewMode === ViewMode.MONTH && <div>Selected Month: {selectedMonth}</div>}
                </div>
            </div>
        </>
    )
}