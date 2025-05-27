'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import DateMonthYearNavigator from './date-picker';
import { AdmissionAggregationType } from '@/types/enum';
import { useQuery } from '@tanstack/react-query';
import { fetchAdmissionsAnalyticsData } from '../helpers/fetch-data';
import { refineDataForDayWiseGraph } from './graphs/refine-data-for-graphs';
import { AdmissionAggregationResponse } from '@/types/admissions';
import { DayWiseTrend } from './graphs/daywise-admissions';
import CourseYearWiseTable from './graphs/course-year-wise-table';
import { UserPlus2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AdmissionTrend() {
  const [selectedDate, setSelectedDate] = useState(() => {
    return format(new Date(), 'dd/MM/yyyy');
  });

  const [admissionAggregationType, setAdmissionAggregationType] =
    useState<AdmissionAggregationType>(AdmissionAggregationType.DATE_WISE);

  const tabsChangeToMonth = () => {
    setAdmissionAggregationType(AdmissionAggregationType.MONTH_WISE);
    setSelectedDate(format(new Date(), 'dd/MM/yyyy'));
  };

  const tabsChangeToDate = () => {
    setAdmissionAggregationType(AdmissionAggregationType.DATE_WISE);
    setSelectedDate(format(new Date(), 'dd/MM/yyyy'));
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
  };

  const {
    data: aggregationData,
    isLoading,
    isError
  } = useQuery<AdmissionAggregationResponse, Error>({
    queryKey: ['admission-aggregation', selectedDate, admissionAggregationType],
    queryFn: () =>
      fetchAdmissionsAnalyticsData({ type: admissionAggregationType, date: selectedDate }),
    placeholderData: (previousData: any) => previousData
  });

  const chartData = refineDataForDayWiseGraph({
    data: aggregationData ?? [],
    type: admissionAggregationType
  });

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 items-stretch ">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-green-900">
            <UserPlus2 className="h-6 w-6 text-green-700" />
            Admissions Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DateMonthYearNavigator
            date={true}
            month={true}
            year={false}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            disableBefore={'12/05/2024'}
            changeToDateTab={tabsChangeToDate}
            changeToMonthTab={tabsChangeToMonth}
          />
          <div className="min-h-[520px] flex-1">
            <DayWiseTrend
              chartData={chartData.reverse()}
              heading={
                admissionAggregationType == AdmissionAggregationType.DATE_WISE
                  ? 'Day Wise Trend'
                  : 'Month Wise Trend'
              }
              headingFooter={
                chartData.length > 0
                  ? `${chartData.at(-1)?.day ?? ''} - ${chartData.at(0)?.day ?? ''}`
                  : 'No data available'
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 flex flex-col">
        <CourseYearWiseTable />
      </div>
    </div>
  );
}
