'use client';
import React from 'react';
import { flexRender, getCoreRowModel, useReactTable, ColumnDef } from '@tanstack/react-table';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import { CardItem } from '@/components/custom-ui/analytic-card/techno-analytic-cards-group';
import { AlertCircle, Shrub } from 'lucide-react';
import { Card } from '@/components/ui/card';

const COLORS = {
  orange: '#ED8936',
  red: '#E53E3E',
  yellow: '#D69E2E',
  blue: '#3182CE',
  gray: '#718096',
  green: '#38A169',
  black: '#000000',
  purple: '#7C3AED',
  pink: '#D53F8C'
};

export const LeadConversionDashboard = ({
  data,
  title = 'Lead Overview',
  description = 'Detailed analytics of lead types'
}: LeadConversionTableProps) => {
  const getColorValue = (className: string) => {
    const colorKey = className.split('-')[1] as keyof typeof COLORS;
    return COLORS[colorKey] || COLORS.purple;
  };

  const isEmpty = data.at(0)?.heading === '0';
  const totalLeads = isEmpty
    ? 0
    : data.reduce((sum, item) => sum + parseInt(item.heading.replace(/,/g, '')), 0);

  const chartConfig: ChartConfig = isEmpty
    ? {}
    : data.reduce(
        (acc, item) => ({
          ...acc,
          [item.title.toLowerCase().replace(/\s+/g, '_')]: {
            label: item.title,
            color: getColorValue(item.color!)
          }
        }),
        {} as ChartConfig
      );

  const chartData = isEmpty
    ? []
    : data.slice(1).map((item) => ({
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

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    value,
    index
  }: any) => {
    const radius = 25 + innerRadius + (outerRadius - innerRadius) * 1.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
    return (
      <text
        x={x}
        y={y}
        fill={getColorValue(chartData[index].color!)}
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${Intl.NumberFormat().format(value)}`}
      </text>
    );
  };

  const renderCustomDataKey = ({ name, value }: any) => {
    return name + '(' + value + ')';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-100">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm">
          <span className="text-gray-600">Leads:</span> {data.value.toLocaleString()}
        </p>
        {data.percent && (
          <p className="text-sm">
            <span className="text-gray-600">Percentage:</span> {data.percent}%
          </p>
        )}
      </div>
    );
  };

  const EmptyState = () => (
    <div className="flex w-full h-[300px] flex-col items-center justify-center  p-6 text-center">
      <Shrub className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700">No data available</h3>
      <p className="text-sm text-gray-500 mt-1">There's no lead data to display at the moment</p>
    </div>
  );

  return (
    <div className="grid gap-4 md:grid-cols-6 grid-cols-1 min-h-max h-max rounded-lg bg-white p-5">
      <div className="md:col-span-3 min-h-max min-w-max">
        <div className="rounded-lg shadow  overflow-clip">
          <Table>
            <TableHeader className="rounded-lg bg-primary/10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent rounded-lg border">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-center text-purple-800 py-4"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-t hover:bg-gray-400/20">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 mx-auto text-center">
                      {cell.column.columnDef.header === 'No. of Leads'
                        ? new Intl.NumberFormat().format(Number(cell.getValue()))
                        : flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="md:col-span-3 grid-cols-1 min-h-max h-max">
        <div className="grid min-h-max h-max grid-cols-1  gap-5">
          <div className="bg-white p-4 rounded-xl min-h-max h-max border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Lead Distribution</h3>
            {isEmpty ? (
              <EmptyState />
            ) : (
              <ChartContainer className="w-full h-[300px]" config={chartConfig}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={2}
                    label={renderCustomizedLabel}
                    labelLine={true}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={getColorValue(entry.color!)}
                        stroke="#fff"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    iconType="circle"
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                  <ChartTooltip content={<CustomTooltip />} />
                </PieChart>
              </ChartContainer>
            )}
          </div>

          {/* <div className="bg-white p-4 rounded-xl min-h-max h-max border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Lead Performance</h3>
            {isEmpty ? (
              <EmptyState />
            ) : (
              <ChartContainer className="w-full h-[300px]" config={chartConfig}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                  <PolarGrid gridType="circle" />
                  <PolarAngleAxis dataKey={renderCustomDataKey} tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<CustomTooltip />} />
                  <Radar
                    name="Leads"
                    dataKey="value"
                    stroke="#7C3AED"
                    fill="#7C3AED"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ChartContainer>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

interface LeadConversionTableProps {
  data: CardItem[];
  title?: string;
  description?: string;
}
