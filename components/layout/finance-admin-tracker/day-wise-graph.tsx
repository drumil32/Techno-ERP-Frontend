'use client';

import { ExpandIcon } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

import { format, parse } from 'date-fns';
import { DayCollection } from '@/types/finance';

const formatToLakhs = (num: number) => +(num / 100000).toFixed(1);

const formatDate = (input: string): string => {
  if (!input || input.length !== 10) return '';
  const parsed = parse(input, 'dd/MM/yyyy', new Date());
  return `${format(parsed, 'do')} ${format(parsed, 'MMM')}`;
};

const chartConfig = {
  dailyCollection: {
    label: 'Daily Collection',
    color: 'var(--chart-4)'
  }
} satisfies ChartConfig;

export default function ChartDaySummary({
  title,
  chartData,
  chartFooterLabel
}: {
  title: string;
  chartData: DayCollection[];
  chartFooterLabel: string;
}) {
  const isEmpty = chartData.length === 0;

  const formattedData = chartData.map((d) => ({
    date: formatDate(d.date),
    dailyCollection: formatToLakhs(d.dailyCollection)
  }));

  const firstDate = formatDate(chartData[0]?.date || '');
  const lastDate = formatDate(chartData[chartData.length - 1]?.date || '');

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          {firstDate && lastDate ? `${firstDate} - ${lastDate}` : 'No data range available'}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        {isEmpty ? (
          <div className="flex flex-col h-96 justify-center items-center gap-6 text-muted-foreground text-sm">
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
            <span>No collection data available for the selected date range.</span>
          </div>
        ) : (
          <div className="w-full h-96">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedData}
                  barSize={40}
                  margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="4 4" />
                  <XAxis
                    dataKey="date"
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
                    tickFormatter={(value) => `${value.toLocaleString()}L`}
                  />
                  <ChartTooltip
                    cursor={{ fill: 'transparent' }}
                    content={<ChartTooltipContent hideLabel />}
                    formatter={(value) => [`${value.toLocaleString()}L`, ' Daily Collection']}
                  />
                  <Bar
                    dataKey="dailyCollection"
                    fill="var(--chart-4)"
                    radius={[8, 8, 0, 0]}
                    name="Daily Collection"
                  >
                    <LabelList
                      position="top"
                      offset={8}
                      className="fill-foreground"
                      fontSize={12}
                      formatter={(val: any) => `${val.toLocaleString()}L`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <div className="text-sm leading-none text-muted-foreground">
          {isEmpty ? 'Try selecting a different date or check back later.' : chartFooterLabel}
        </div>
      </CardFooter>
    </Card>
  );
}
