'use client';
import React, { ReactElement } from 'react';
import { flexRender, getCoreRowModel, useReactTable, ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  LineChart,
  Line,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import { CardItem } from '@/components/custom-ui/analytic-card/techno-analytic-cards-group';

interface LeadConversionTableProps {
  data: CardItem[];
  title?: string;
  description?: string;
}

export const LeadConversionDashboard = ({
  data,
  title = 'Lead Overview',
  description = 'Detailed analytics of lead types'
}: LeadConversionTableProps) => {
  const totalLeads = data.reduce((sum, item) => sum + parseInt(item.heading.replace(/,/g, '')), 0);

  const getColorValue = (className: string) =>
    ({
      orange: '#ED8936',
      red: '#E53E3E',
      yellow: '#D69E2E',
      blue: '#3182CE',
      gray: '#718096',
      green: '#38A169',
      black: '#000000',
      purple: '#805AD5',
      pink: '#D53F8C'
    })[className.split('-')[1]] || '#718096';

  const chartConfig: ChartConfig = data.reduce(
    (acc, item) => ({
      ...acc,
      [item.title.toLowerCase().replace(/\s+/g, '_')]: {
        label: item.title,
        color: getColorValue(item.color!)
      }
    }),
    {} as ChartConfig
  );

  const chartData = data.map((item) => ({
    name: item.title,
    value: parseInt(item.heading.replace(/,/g, '')) || 0,
    percent: parseFloat(item.subheading.replace('%', '')),
    color: item.color
  }));

  const columns: ColumnDef<CardItem>[] = [
    {
      accessorKey: 'title',
      header: 'Lead Type',
      cell: ({ row }) => (
        <div className="flex items-center">
          <span
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: getColorValue(row.original.color!) }}
          />
          <span>{row.original.title}</span>
        </div>
      )
    },
    {
      accessorKey: 'heading',
      header: 'No. of Leads',
      cell: ({ row }) => <span className="font-medium">{row.original.heading}</span>
    },
    {
      accessorKey: 'subheading',
      header: 'Percentage',
      cell: ({ row }) => <span className="font-medium">{row.original.subheading}</span>
    }
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const renderChart = (title: string, chart: ReactElement) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
      <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig}>{chart}</ChartContainer>
      </div>
    </div>
  );

  return (
    <>
      <div className="grid gap-4 md:grid-cols-6 grid-cols-1 w-full h-max rounded-lg bg-white p-5">
        <div className="md:col-span-2 ">
          <Table>
            <TableHeader className="rounded-lg bg-primary/10  ">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent rounded-lg border">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold  text-purple-800 py-4 ">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-t hover:bg-purple-50/30">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:col-span-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderChart(
              'Lead Distribution',
              <ChartContainer config={chartConfig}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={getColorValue(entry.color!)} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}

            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow md:col-span-1">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Lead Performance</h3>
              <div className=" w-full">
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid gridType="circle" />
                      <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} tick={{ fontSize: 10 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Radar
                        name="Leads"
                        dataKey="value"
                        stroke="#7C3AED"
                        fill="#7C3AED"
                        fillOpacity={0.15}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
