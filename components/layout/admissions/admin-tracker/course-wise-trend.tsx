'use client';
import { Card } from '@/components/ui/card';
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
    console.log('Selected date:', newDate);
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
    <Card className="p-4 w-full">
      <DateMonthYearNavigator
        date={false}
        month={true}
        year={false}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        label="Course Wise Admission Trend "
        disableBefore={'12/05/2024'}
        changeToDateTab={tabsChangeToDate}
        changeToMonthTab={tabsChangeToMonth}
      />

      <div className="w-1/2">
        <MonthWiseCourseTrend
          chartData={chartData}
          heading="Month Wise Admissions"
          headingFooter={
            chartData.length > 0
              ? `Total Courses: ${chartData.length}`
              : isError
                ? 'Error loading data'
                : 'No data available'
          }
        />
      </div>
    </Card>
  );
}
