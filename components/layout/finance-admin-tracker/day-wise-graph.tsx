"use client"

import { ExpandIcon } from "lucide-react"
import {
  Bar, BarChart, CartesianGrid, Legend,
  ResponsiveContainer, XAxis, YAxis
} from "recharts"

import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"

import {
  type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent
} from "@/components/ui/chart"

import { format, parse } from "date-fns"

// Utility to format numbers into lakhs
const formatToLakhs = (num: number) => +(num / 100000).toFixed(1)

// Utility to format date like "18/05/2024" => "18th May"
const formatDate = (input: string): string => {
  if (!input) return ""
  // date is not valid
  if (input.length !== 10) return ""
  const parsed = parse(input, "dd/MM/yyyy", new Date())
  const day = format(parsed, "do")
  const month = format(parsed, "MMM")
  return `${day} ${month}`
}

const chartConfig = {
  dailyCollection: {
    label: "dailyCollection",
    color: "hsl(265, 83%, 45%)",
  },
} satisfies ChartConfig

export default function ChartDaySummary({
  title,
  chartData,
  chartFooterLabel
}: {
  title: string
  chartData: { date: string, dailyCollection: number }[]
  chartFooterLabel: string
}) {
  // Format and transform chart data
  const formattedData = chartData.map(d => ({
    date: formatDate(d.date),
    dailyCollection: formatToLakhs(d.dailyCollection),
  }))

  console.log(chartData)

  const firstDate = formatDate(chartData[0]?.date || "")
  const lastDate = formatDate(chartData[chartData.length - 1]?.date || "")

  return (
    <Card className="border border-purple-200 border-dashed">
      <CardHeader className="border-b border-dashed border-purple-200 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-gray-700 font-medium">{firstDate} - {lastDate}</span>
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <span className="mr-1">Expand view</span>
            <ExpandIcon className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pb-2">
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formattedData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tickMargin={10} stroke="#6b7280" />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => `${value}L`}
                    stroke="#6b7280"
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5, 6]}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value}L`, "dailyCollection"]}
                  />
                  <Bar
                    dataKey="dailyCollection"
                    fill="hsl(265, 83%, 45%)"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    name="dailyCollection"
                    label={{
                      position: "top",
                      formatter: (value: any) => `${value}L`,
                      fill: "hsl(265, 83%, 45%)",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "20px" }} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div className="text-center text-gray-600 mt-2 mb-2">{chartFooterLabel}</div>
      </CardContent>
    </Card>
  )
}
