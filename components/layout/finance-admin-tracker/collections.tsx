import { useEffect, useMemo, useState } from 'react';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { DailyCollectionData, MonthlyCollectionData } from '@/types/finance';
import { fetchDailyCollections, fetchMonthlyCollections } from './helpers/fetch-data';
import CollectionSummary from './collections-summary';
import CourseWiseCollections from './collections-course-wise';
import ChartDaySummary from './day-wise-graph';
import DateMonthYearNavigator from '../admissions/admin-tracker/date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PiggyBank } from 'lucide-react';
import { format, parse } from 'date-fns';

export enum ViewMode {
  DAY = 'day',
  MONTH = 'month'
}

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

export default function Collections() {
  const [viewMode, setViewMode] = useState(ViewMode.DAY);
  const [selectedDate, setSelectedDate] = useState(() => {
    return format(new Date(), 'dd/MM/yyyy');
  });

  const parsedDate = parse(selectedDate, 'dd/MM/yyyy', new Date());
  const selectedMonth = parsedDate.getMonth() + 1;
  const selectedYear = parsedDate.getFullYear();

  const handleDateChange = (newDate: any) => {
    setSelectedDate(newDate);
  };

  const collectionsQuery = useQuery<DailyCollectionData | MonthlyCollectionData, Error>({
    queryKey: [
      'collections',
      viewMode === ViewMode.DAY
        ? { date: selectedDate }
        : { monthNumber: selectedMonth, year: selectedYear }
    ],
    queryFn:
      viewMode === ViewMode.DAY
        ? (context) =>
            fetchDailyCollections(context as QueryFunctionContext<readonly [string, any]>)
        : (context) =>
            fetchMonthlyCollections(context as QueryFunctionContext<readonly [string, any]>),
    placeholderData: (previousData) => previousData
  });

  const collectionData = collectionsQuery.data;
  const isLoading = collectionsQuery.isLoading;

  console.log(collectionData);

  const normalizedChartData = useMemo(() => {
    if (!collectionData) return [];

    if (viewMode === ViewMode.DAY) {
      const dailyData = (collectionData as DailyCollectionData)?.pastSevenDays;
      return (
        dailyData?.map((d) => ({
          date: d.date,
          dailyCollection: d.dailyCollection
        })) || []
      );
    } else {
      const monthlyData = (collectionData as MonthlyCollectionData)?.monthWiseData;
      return (
        monthlyData?.map((d) => ({
          date: d.date,
          dailyCollection: d.totalCollection
        })) || []
      );
    }
  }, [viewMode, collectionData]);

  const tabsChangeToMonth = () => {
    setSelectedDate(format(new Date(), 'dd/MM/yyyy'));
    setViewMode(ViewMode.MONTH);
  };

  const tabsChangeToDate = () => {
    setSelectedDate(format(new Date(), 'dd/MM/yyyy'));
    setViewMode(ViewMode.DAY);
  };

  return (
    <>
      <Card>
        <CardHeader className="">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-purple-700 pb-3 border-b border-gray-100">
            <PiggyBank className="size-7 text-purple-600" />
            Semester-wise Fees Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-1/2">
            <DateMonthYearNavigator
              date={true}
              month={true}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              changeToDateTab={tabsChangeToDate}
              changeToMonthTab={tabsChangeToMonth}
            />
          </div>
        </CardContent>
      </Card>
      {collectionData && (
        <div className="w-full flex gap-6 my-4">
          <div className="flex flex-col w-[60%] gap-6">
            <CollectionSummary
              label={
                viewMode === ViewMode.DAY
                  ? selectedDate
                  : `${months[selectedMonth - 1]} ${selectedYear}`
              }
              totalCollections={collectionData?.totalCollection || 0}
              viewMode={viewMode}
            />
            <ChartDaySummary
              chartData={normalizedChartData}
              chartFooterLabel={
                viewMode === ViewMode.DAY ? 'Last 7-Day Summary' : 'Monthly Summary'
              }
              title={viewMode === ViewMode.DAY ? 'Last 7-Day Summary' : 'Monthly Summary'}
            />
          </div>
          <div className="w-[40%]">
            <CourseWiseCollections
              courseWiseCollection={
                viewMode === ViewMode.DAY
                  ? (collectionData as DailyCollectionData)?.courseWiseInformation || []
                  : (collectionData as MonthlyCollectionData)?.courseWiseCollection || []
              }
            />
          </div>
        </div>
      )}
    </>
  );
}
