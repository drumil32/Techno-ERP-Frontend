'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import DateMonthYearNavigator from './date-picker';
import { AdmissionAggregationType } from '@/types/enum';
import { useQuery } from '@tanstack/react-query';
import {
  fetchAdmissionsAnalyticsData,
  fetchAdmissionsCourseMonthAnalyticsData
} from '../helpers/fetch-data';
import { refineDataForDayWiseGraph } from './graphs/refine-data-for-graphs';
import { AdmissionAggregationResponse, AdmissionMonthCourseWiseResponse } from '@/types/admissions';
import { DayWiseTrend } from './graphs/daywise-admissions';
import CourseYearWiseTable from './graphs/course-year-wise-table';
import { MonthWiseCourseTrend } from './graphs/month-wise-graph';
import { ChartArea, ChartNoAxesColumn } from 'lucide-react';

export default function CourseWiseAdmissionTrend() {
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
  };

  const { data, isError, isLoading, error } = useQuery<AdmissionMonthCourseWiseResponse, Error>({
    queryKey: ['month-aggregation', selectedDate],
    queryFn: () =>
      fetchAdmissionsCourseMonthAnalyticsData({
        type: AdmissionAggregationType.MONTH_AND_COURSE_WISE,
        date: selectedDate
      }),
    placeholderData: (previousData: any) => previousData
  });

  const chartData = data?.monthWise?.[0]?.courseWise ?? [];

  return (
    <Card className="w-full">
      <CardHeader className="-mb-6">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-orange-800">
          <ChartArea className="h-6 w-6 text-orange-700" />
          Course Wise Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-1/2">
          <DateMonthYearNavigator
            date={false}
            month={true}
            year={false}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            disableBefore={'12/05/2024'}
            changeToDateTab={tabsChangeToDate}
            changeToMonthTab={tabsChangeToMonth}
            startFromMonths={4}
          />
        </div>
        <div className="w-full flex">
          <div className="w-full">
            <MonthWiseCourseTrend
              chartData={chartData}
              heading="Corse Wise Admissions"
              headingFooter={
                chartData.length > 0
                  ? `Total Courses: ${chartData.length}`
                  : isError
                    ? 'Error loading data'
                    : 'No data available'
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
