"use client"


import { ExpandIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"


const chartData = [
 { date: "30th Apr", collection: 2.5 },
 { date: "1st May", collection: 1.6 },
 { date: "2nd May", collection: 1.4 },
 { date: "3rd May", collection: 0.4 },
 { date: "4th May", collection: 4.9 },
 { date: "5th May", collection: 2.5 },
 { date: "6th May", collection: 1.6 },
 { date: "2nd May", collection: 1.4 },
 { date: "3rd May", collection: 0.4 },
 { date: "4th May", collection: 4.9 },
 { date: "5th May", collection: 2.5 },
 { date: "2nd May", collection: 1.4 },
 { date: "3rd May", collection: 0.4 },
 { date: "4th May", collection: 4.9 },
 { date: "5th May", collection: 2.5 },
]


const chartConfig = {
 collection: {
   label: "Collection",
   color: "hsl(265, 83%, 45%)",
 },
} satisfies ChartConfig


export default function Chart7DaySummary() {
 return (
   <Card className="border border-purple-200 border-dashed">
     <CardHeader className="border-b border-dashed border-purple-200 pb-2">
       <div className="flex justify-between items-center">
         <CardTitle className="text-xl font-bold">Last 7-Day Summary</CardTitle>
       </div>
       <div className="flex justify-between items-center mt-2">
         <span className="text-gray-700 font-medium">30th Apr - 6th May</span>
         <button className="flex items-center text-gray-600 hover:text-gray-900">
           <span className="mr-1">Expand view</span>
           <ExpandIcon className="h-4 w-4" />
         </button>
       </div>
     </CardHeader>
     <CardContent className="pt-6 pb-2">
       <div className="">
         <ChartContainer config={chartConfig}>
           <ResponsiveContainer>
             <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
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
                 formatter={(value) => [`${value}L`, "Collection"]}
               />
               <Bar
                 dataKey="collection"
                 fill="hsl(265, 83%, 45%)"
                 radius={[4, 4, 0, 0]}
                 barSize={40}
                 name="Collection"
                 label={{
                   position: "top",
                   formatter: (value:any) => `${value}L`,
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
       <div className="text-center text-gray-600 mt-2 mb-2">Last 7 Days</div>
     </CardContent>
   </Card>
 )
}
