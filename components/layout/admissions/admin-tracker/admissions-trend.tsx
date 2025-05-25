'use client';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import DateMonthYearNavigator from './date-picker';
import { AdmissionAggregationType } from '@/types/enum';
import { useQuery } from '@tanstack/react-query';
import { fetchAdmissionsAnalyticsData } from '../helpers/fetch-data';
import { refineDataForDayWiseGraph } from './graphs/refine-data-for-graphs';
import { AdmissionAggregationResponse } from '@/types/admissions';
import { DayWiseTrend } from './graphs/daywise-admissions';
import CourseYearWiseTable from './graphs/course-year-wise-table';

export default function AdmissionTrend() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  });

  const [admissionAggregationType, setAdmissionAggregationType] =
    useState<AdmissionAggregationType>(AdmissionAggregationType.DATE_WISE);

  const tabsChangeToMonth = () => {
    setAdmissionAggregationType(AdmissionAggregationType.MONTH_WISE);
  };

  const tabsChangeToDate = () => {
    setAdmissionAggregationType(AdmissionAggregationType.DATE_WISE);
  };

  const handleDateChange = (newDate: string) => {
    setSelectedDate(newDate);
    console.log('Selected date:', newDate);
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

  const chartData = refineDataForDayWiseGraph({ data: aggregationData ?? [] });

  return (
    <Card className="p-4 w-full">
      <DateMonthYearNavigator
        date={true}
        month={true}
        year={false}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        label="Admission Trend "
        disableBefore={'12/05/2024'}
        changeToDateTab={tabsChangeToDate}
        changeToMonthTab={tabsChangeToMonth}
      />

      <div className="flex gap-6">
        <div className="w-1/2">
          <DayWiseTrend
            chartData={chartData}
            heading="Day Wise Admissions"
            headingFooter={
              chartData.length > 0
                ? `${chartData.at(-1)?.day ?? ''} - ${chartData.at(0)?.day ?? ''}`
                : 'No data available'
            }
          />
        </div>
        <div className="w-1/2">
          <CourseYearWiseTable />
        </div>
      </div>
    </Card>
  );
}
