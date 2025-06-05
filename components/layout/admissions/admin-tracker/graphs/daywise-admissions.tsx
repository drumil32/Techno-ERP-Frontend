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
    color: 'var(--chart-4)'
  }
} satisfies ChartConfig;

export function DayWiseTrend({
  chartData,
  heading = 'Day Wise Admissions',
  headingFooter = 'Total Admissions'
}: {
  chartData: { day: string; admissions: number }[];
  heading?: string;
  headingFooter?: string;
}) {
  const isEmpty = chartData.length === 0;
  const max = Math.max(...chartData.map(d => d.admissions));
  const ticks = Array.from({ length: max + 1 }, (_, i) => i);


  return (
    <Card className="w-full bg-gradient-to-br border border-gray-100 shadow-lg rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{heading}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {isEmpty ? 'No data available' : headingFooter}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        {isEmpty ? (
          <div className="flex flex-col h-96 justify-center items-center gap-6 text-muted-foreground text-sm">
            <div className="text-gray-400">
              <svg
                className="w-16 h-16"
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
            <span>No admission data available for the selected date.</span>
          </div>
        ) : (
          <div className="w-full h-96">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <BarChart
                data={chartData}
                barSize={40}
                margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis
                  dataKey="day"
                  tickLine={true}
                  axisLine={true}
                  tickMargin={10}
                  style={{ fontSize: 12 }}
                  stroke="#374151"
                  strokeWidth={1.5}
                />
                <YAxis
                  tickLine={true}
                  axisLine={true}
                  tickMargin={10}
                  style={{ fontSize: 12 }}
                  stroke="#374151"
                  strokeWidth={1.5}
                  ticks={ticks}
                />
                <ChartTooltip
                  cursor={{ fill: 'transparent' }}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="admissions" fill="var(--color-admissions)" radius={[8, 8, 0, 0]}>
                  <LabelList position="top" offset={8} className="fill-foreground" fontSize={12} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="text-sm leading-none text-muted-foreground">
          {isEmpty
            ? 'Try selecting a different date or check back later.'
            : 'Showing the admissions.'}
        </div>
      </CardFooter>
    </Card>
  );
}
