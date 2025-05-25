'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartConfig = {
  admissions: {
    label: 'admissions',
    color: 'var(--chart-5)'
  }
} satisfies ChartConfig;

export function MonthWiseCourseTrend({
  chartData,
  heading = 'Month Wise Admissions',
  headingFooter = 'Total Admissions'
}: {
  chartData: { courseCode: string; count: number }[];
  heading?: string;
  headingFooter?: string;
}) {
  const isEmpty = chartData.length === 0;

  return (
    <Card className="h-full bg-gradient-to-br border border-gray-100 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
        <CardDescription className="text-muted-foreground">{headingFooter}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {isEmpty ? (
          <div className="flex flex-col h-full flex-1 justify-center items-center gap-6 text-muted-foreground text-sm py-12">
            <div className="text-yellow-300">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            No admission data available for the selected date.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart
              data={chartData}
              barSize={48}
              margin={{ top: 20, bottom: 20, left: 20, right: 10 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis
                dataKey="courseCode"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                style={{ fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={10} style={{ fontSize: 12 }} />
              <ChartTooltip
                cursor={{ fill: 'transparent' }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-admissions)" radius={[8, 8, 0, 0]}>
                <LabelList position="top" offset={8} className="fill-foreground" fontSize={12} />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          {isEmpty
            ? 'Try selecting another month or check back later.'
            : 'Showing the course-wise admissions.'}
        </div>
      </CardFooter>
    </Card>
  );
}
